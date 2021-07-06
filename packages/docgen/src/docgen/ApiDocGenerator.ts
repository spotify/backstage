/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ts from 'typescript';
import {
  relative as relativePath,
  sep as pathSep,
  posix as posixPath,
} from 'path';
import {
  ExportedInstance,
  ApiDoc,
  InterfaceInfo,
  FieldInfo,
  TypeInfo,
  TypeLink,
} from './types';

// Always use unix path separators for the relative file
// paths, since we'll be using those for HTTP URLs.
function relativeLink(basePath: string, filePath: string) {
  return relativePath(basePath, filePath).split(pathSep).join(posixPath.sep);
}

/**
 * The ApiDocGenerator uses the typescript compiler API to build the data structure that
 * describes a Backstage API and all of it's related types.
 *
 * It receives an exported instance that of the form
 * `export name = createApiRef<Interface>({id: ..., description: ...})`.
 * It will then traverse all fields and methods on the interface type, and also
 * types and declaration of all types that are used by those, both directly and indirectly.
 * While traversing, it collects information such as names, location in source, docs, etc.
 */
export default class ApiDocGenerator {
  static fromProgram(program: ts.Program, sourcePath: string) {
    return new ApiDocGenerator(program.getTypeChecker(), sourcePath);
  }

  constructor(
    private readonly checker: ts.TypeChecker,
    private readonly basePath: string,
  ) {}

  /**
   * Generate documentation information for a given exported symbol.
   */
  toDoc(apiInstance: ExportedInstance): ApiDoc {
    const { name, source, args, typeArgs } = apiInstance;

    const [info] = args;
    if (!ts.isObjectLiteralExpression(info)) {
      throw new Error('api info is not an object literal');
    }

    const id = this.getObjectPropertyLiteral(info, 'id');
    const description = this.getObjectPropertyLiteral(info, 'description');
    const file = relativeLink(this.basePath, source.fileName);
    const { line } = source.getLineAndCharacterOfPosition(
      apiInstance.node.getStart(),
    );

    const rootTypeNode = typeArgs[0];
    const typeNodes = ts.isIntersectionTypeNode(rootTypeNode)
      ? rootTypeNode.types.slice()
      : [rootTypeNode];
    const interfaceInfos = typeNodes.map(typeNode =>
      this.getInterfaceInfo(typeNode),
    );

    return {
      id,
      name,
      file,
      lineInFile: line + 1,
      description,
      interfaceInfos,
    };
  }

  /**
   * Grab jsDoc and regular comments for a node
   */
  private getNodeDocs(node: ts.Node): string[] {
    const docNodes = ((node && (node as any).jsDoc) || []) as ts.JSDoc[];
    const docs = docNodes.map(docNode => docNode.comment || '').filter(Boolean);
    return docs;
  }

  /**
   * Collect information about a top-level type.
   */
  private getInterfaceInfo(typeNode: ts.TypeNode): InterfaceInfo {
    if (ts.isTypeQueryNode(typeNode)) {
      throw new Error(
        'APIs must have a proper type parameter, TypeQueries are now allowed',
      );
    }
    if (!ts.isTypeReferenceNode(typeNode)) {
      throw new Error('Interface is not a type node');
    }

    const type = this.checker.getTypeFromTypeNode(typeNode);
    const interfaceMembers = type.symbol.members as Map<string, ts.Symbol>;
    if (!interfaceMembers) {
      throw new Error('Interface does not have any members');
    }
    const name = (type.aliasSymbol || type.symbol).name;
    const [declaration] = (type.aliasSymbol || type.symbol).declarations;
    const sourceFile = declaration.getSourceFile();
    const file = relativeLink(this.basePath, sourceFile.fileName);
    const { line } = sourceFile.getLineAndCharacterOfPosition(
      declaration.getStart(),
    );
    const docs = this.getNodeDocs(declaration);

    const membersAndTypes = Array.from(
      interfaceMembers.values(),
    ).flatMap(fieldSymbol => this.getMemberInfo(name, fieldSymbol));

    const members = membersAndTypes.map(t => t.member);
    const dependentTypes = this.flattenTypes(
      membersAndTypes.flatMap(t => t.dependentTypes),
    );

    return { name, docs, file, lineInFile: line + 1, members, dependentTypes };
  }

  /**
   * Grab primitive values from an object literal expression.
   */
  private getObjectPropertyLiteral(
    objectLiteral: ts.ObjectLiteralExpression,
    propertyName: string,
  ): string {
    const matchingProp = objectLiteral.properties.filter(
      prop =>
        ts.isPropertyAssignment(prop) &&
        ts.isIdentifier(prop.name) &&
        prop.name.text === propertyName,
    )[0] as ts.PropertyAssignment;

    if (!matchingProp) {
      throw new Error(`no identifier found for property ${propertyName}`);
    }

    const { initializer } = matchingProp;
    if (!ts.isStringLiteral(initializer)) {
      throw new Error(`no string literal for ${propertyName}`);
    }

    return initializer.text;
  }

  /**
   * Get field definitions for a given symbol.
   */
  private getMemberInfo(
    parentName: string,
    symbol: ts.Symbol,
  ): { member: FieldInfo; dependentTypes: TypeInfo[] } {
    const declaration = symbol.valueDeclaration;

    const { links, infos: dependentTypes } = this.findAllTypeReferences(
      declaration,
    );

    let type: FieldInfo['type'] = 'prop';
    if (
      ts.isPropertySignature(declaration) &&
      declaration.type &&
      ts.isFunctionTypeNode(declaration.type)
    ) {
      type = 'method';
    } else if (ts.isMethodSignature(declaration)) {
      type = 'method';
    }

    return {
      member: {
        type,
        name: symbol.name,
        path: `${parentName}.${symbol.name}`,
        text: declaration.getText().replace(/;$/, ''),
        docs: this.getNodeDocs(declaration),
        links: this.recalculateLinkOffsets(declaration, links),
      },
      dependentTypes,
    };
  }

  /**
   * Recursively search for references to types that we care about and want to include in the documentation.
   */
  private findAllTypeReferences = (
    node: ts.Node | undefined,
    visited: Set<ts.Node> = new Set(),
  ): { links: TypeLink[]; infos: TypeInfo[] } => {
    if (!node || visited.has(node)) {
      return { links: [], infos: [] };
    }
    // This makes sure we don't end up in a loop.
    // It doesn't exclude repeated types, e.g. Array<Array<MyType>>, since we're exiting on duplicate nodes, not types.
    visited.add(node);

    const children = node
      .getChildren()
      .flatMap(child => this.findAllTypeReferences(child, visited));

    if (!ts.isTypeReferenceNode(node)) {
      return {
        links: children.flatMap(child => child.links),
        infos: children.flatMap(child => child.infos),
      };
    }

    const type = this.checker.getTypeFromTypeNode(node);

    const info = this.validateTypeDeclaration(type);
    if (!info) {
      return {
        links: children.flatMap(child => child.links),
        infos: children.flatMap(child => child.infos),
      };
    }
    const { symbol, declaration } = info;

    const typeRefs = this.findAllTypeReferences(declaration, visited);

    const sourceFile = declaration.getSourceFile();
    const { line } = sourceFile.getLineAndCharacterOfPosition(
      declaration.getStart(),
    );
    const file = relativeLink(this.basePath, sourceFile.fileName);
    const typeInfo = {
      id: (symbol as any).id,
      name: symbol.name,
      text: declaration.getText().replace(/;$/, ''),
      docs: this.getNodeDocs(declaration),
      path: `${file}/${symbol.name}`,
      file,
      lineInFile: line + 1, // TS line is 0-based
      links: this.recalculateLinkOffsets(declaration, typeRefs.links),
      children: typeRefs.infos,
    };

    const link = {
      id: typeInfo.id,
      path: typeInfo.path,
      name: typeInfo.name,
      location: [node.typeName.getStart(), node.typeName.getEnd()] as const,
    };

    return {
      links: [link, ...children.flatMap(child => child.links)],
      infos: [typeInfo, ...children.flatMap(child => child.infos)],
    };
  };

  /**
   * Check if a given type declaration is one that we care about.
   */
  private validateTypeDeclaration(
    type: ts.Type | undefined,
  ): undefined | { symbol: ts.Symbol; declaration: ts.Declaration } {
    if (!type) {
      return undefined;
    }
    const symbol = type.aliasSymbol || type.symbol;
    if (!symbol) {
      return undefined;
    }

    const [declaration] = symbol.declarations;

    // Don't generate standalone infos for type paramters
    if (ts.isTypeParameterDeclaration(declaration)) {
      return undefined;
    }

    if (declaration.getSourceFile().fileName.includes('node_modules')) {
      return undefined;
    }

    return { symbol, declaration };
  }

  /**
   * Flatten a tree of TypeInfos with children into a flat
   * list of TypeInfos with duplicates removed.
   */
  private flattenTypes(descs: TypeInfo[]): TypeInfo[] {
    function getChildren(parent: TypeInfo): TypeInfo[] {
      return [
        {
          ...parent,
          children: [],
        },
        ...parent.children.flatMap(getChildren),
      ];
    }

    const flatDescs = descs.flatMap(getChildren);
    const seenTypes = new Set<number>();
    return flatDescs.filter(desc => {
      if (seenTypes.has(desc.id)) {
        return false;
      }
      seenTypes.add(desc.id);
      return true;
    });
  }

  /**
   * Calculate link positions within a block of code, with 0 being
   * the first character in the block.
   */
  private recalculateLinkOffsets(
    parent: ts.Node,
    links: TypeLink[],
  ): TypeLink[] {
    const parentStart = parent.getStart();
    return links.map(link => {
      const [start, end] = link.location;
      return {
        ...link,
        location: [start - parentStart, end - parentStart],
      };
    });
  }
}
