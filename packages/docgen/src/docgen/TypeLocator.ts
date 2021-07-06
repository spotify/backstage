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
import { ExportedInstance } from './types';

/**
 * The TypeLocator is used to extract typescrint Type structures from a compiled program,
 * as well as finding locations where types are used in according to a matching pattern.
 *
 * This is used to e.g. find exported APIs that we should generate documentation for.
 */
export default class TypeLocator {
  static fromProgram(program: ts.Program, sourcePath: string) {
    return new TypeLocator(program.getTypeChecker(), program, sourcePath);
  }

  constructor(
    private readonly checker: ts.TypeChecker,
    private readonly program: ts.Program,
    private readonly sourcePath: string,
  ) {}

  /**
   * Get the type of a symbol by export path and name
   */
  getExportedType(path: string, exportedName: string = 'default'): ts.Type {
    const source = this.program.getSourceFile(path);
    if (!source) {
      throw new Error(`Source not found for path '${path}'`);
    }
    const exported = this.checker.getExportsOfModule(
      this.checker.getSymbolAtLocation(source)!,
    );
    const [symbol] = exported.filter(e => e.name === exportedName);
    if (!symbol) {
      throw new Error(`No export '${exportedName}' found in ${path}`);
    }
    const type = this.checker.getTypeOfSymbolAtLocation(symbol, source);
    return type;
  }

  /**
   * Find exported instances and return values from calls using the types
   * provided in the lookup table.
   */
  findExportedInstances<T extends string>(
    typeLookupTable: { [key in T]: ts.Type },
  ): { [key in T]: ExportedInstance[] } {
    const docMap = new Map<ts.Type, ExportedInstance[]>();
    for (const type of Object.values<ts.Type>(typeLookupTable)) {
      docMap.set(type, []);
    }

    this.program.getSourceFiles().forEach(source => {
      const inRoot = source.fileName.startsWith(this.sourcePath);
      if (!inRoot) {
        return;
      }
      ts.forEachChild(source, node => {
        const decl = this.getExportedConstructorDeclaration(node);
        if (!decl || !docMap.has(decl.constructorType)) {
          return;
        }

        docMap.get(decl.constructorType)!.push({ node, source, ...decl });
      });
    });

    const result: { [key in T]?: ExportedInstance[] } = {};

    for (const key in typeLookupTable) {
      if (typeLookupTable.hasOwnProperty(key)) {
        const type = typeLookupTable[key];
        result[key] = docMap.get(type)!;
      }
    }

    return result as { [key in T]: ExportedInstance[] };
  }

  private getExportedConstructorDeclaration(
    node: ts.Node,
  ):
    | {
        constructorType: ts.Type;
        args: ts.Expression[];
        typeArgs: ts.TypeNode[];
        name: string;
      }
    | undefined {
    if (!ts.isVariableStatement(node)) {
      return undefined;
    }
    if (
      !node.modifiers ||
      !node.modifiers.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      return undefined;
    }
    const { declarations } = node.declarationList;
    if (declarations.length !== 1) {
      return undefined;
    }

    const [declaration] = declarations;
    const { initializer, name } = declaration;

    if (!initializer || !name) {
      return undefined;
    }
    if (!ts.isCallOrNewExpression(initializer)) {
      return undefined;
    }
    if (!ts.isIdentifier(name)) {
      return undefined;
    }

    const constructorType = this.checker.getTypeAtLocation(
      initializer.expression,
    );
    const args = Array.from(initializer.arguments ?? []);
    const typeNode = declaration.type;
    const typeArgs = Array.from(
      (typeNode && ts.isTypeReferenceNode(typeNode)
        ? typeNode.typeArguments
        : initializer.typeArguments) ?? [],
    );

    return { constructorType, args, typeArgs, name: name.text };
  }
}
