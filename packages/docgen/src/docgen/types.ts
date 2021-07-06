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

/**
 * A TypeLink is a link to a different type.
 */
export type TypeLink = {
  // The ID of the linked type
  id: number;
  // The path to the type from the project root
  path: string;
  // The name of the type, to display
  name: string;
  // The location of the type name as it appears in it's parent text.
  location: readonly [number, number];
};

/**
 * TypeInfo describes a TypeScript Type.
 */
export type TypeInfo = {
  id: number;
  name: string;
  path: string;
  file: string;
  lineInFile: number;
  text: string;
  docs: string[];
  links: TypeLink[];
  children: TypeInfo[];
};

/**
 * FieldInfo describes a property or method in a documented API.
 */
export type FieldInfo = {
  type: 'prop' | 'method';
  name: string;
  path: string;
  text: string;
  docs: string[];
  links: TypeLink[];
};

/**
 * InterfaceInfo describes the type of a documented API.
 */
export type InterfaceInfo = {
  name: string;
  docs: string[];
  file: string;
  lineInFile: number;
  members: Array<FieldInfo>;
  dependentTypes: TypeInfo[];
};

/**
 * ApiDoc describes a documented API.
 */
export type ApiDoc = {
  id: string;
  name: string;
  description: string;
  file: string;
  lineInFile: number;
  interfaceInfos: InterfaceInfo[];
};

/**
 * ExportedInstance describes an expression matching `export {name} = new {Contructor}<{typeArgs}...>({args}...)`
 */
export type ExportedInstance = {
  node: ts.Node;
  name: string;
  source: ts.SourceFile;
  args: Array<ts.Expression>;
  typeArgs: Array<ts.TypeNode>;
};

export type Highlighter = {
  highlight(test: string): string;
};

/**
 * Markdown printer is an abstraction for printing markdown documents of different flavors.
 */
export type MarkdownPrinter = {
  text(text: string): void;
  header(level: number, text: string, id?: string): void;
  paragraph(...text: string[]): void;
  code(options: { text: string; links?: TypeLink[] }): void;

  headerLink(header: string, id?: string): string;
  /** Link from pages to index */
  indexLink(): string;
  /** Link from index to pages */
  pageLink(name: string): string;
  srcLink(
    { file, lineInFile }: { file: string; lineInFile: number },
    text?: string,
  ): string;

  toBuffer(): Buffer;
};
