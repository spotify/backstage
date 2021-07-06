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
import TypeLocator from './TypeLocator';
import { createMemProgram } from './testUtils';
import ApiDocGenerator from './ApiDocGenerator';

describe('ApiDocGenerator', () => {
  it('should generate empty API doc', () => {
    const program = createMemProgram(
      `
      import MyApi from './type';

      type MyApiType = {};

      export const myApi = new MyApi<MyApiType>({
        id: 'my-id',
        description: 'my-description',
      });
    `,
      {
        '/mem/type.ts': `export default class MyApi<T> {
          constructor(private readonly info: { id: string, description: string }) {}
        }`,
      },
    );

    const typeLocator = TypeLocator.fromProgram(program, '/');

    const { apiInstances } = typeLocator.findExportedInstances({
      apiInstances: typeLocator.getExportedType('/mem/type.ts'),
    });

    expect(apiInstances.length).toBe(1);
    const [apiInstance] = apiInstances;

    const docGenerator = ApiDocGenerator.fromProgram(program, '/');
    const doc = docGenerator.toDoc(apiInstance);

    expect(doc.id).toBe('my-id');
    expect(doc.description).toBe('my-description');
    expect(doc.name).toBe('myApi');
    expect(doc.file).toBe('mem/index.ts');
    expect(doc.lineInFile).toBe(6);
    expect(doc.interfaceInfos).toEqual([
      {
        dependentTypes: [],
        docs: [],
        file: 'mem/index.ts',
        lineInFile: 4,
        members: [],
        name: 'MyApiType',
      },
    ]);
  });

  it('should generate API docs', () => {
    const program = createMemProgram(
      `
      import MyApi from './type';

      /** MySubSubType Docs */
      type MySubSubType = { n: number; };

      /** MySubType Docs */
      type MySubType = {
        /** Field a docs */
        a: boolean;
        // Field b docs
        b: MySubSubType;
      }

      /** MySecondSubType Docs */

      /** With multiple comments */
      export type MySecondSubType = { s: string };

      // MyThirdSubType Docs that shouldn't show up
      type MyThirdSubType = { b: boolean };

      /** MyApiType Docs */
      type MyApiType = {
        /** Docs for x */
        x: string;
        // Line comments shouldn't show up
        y: MySubType;
        /** Multiple */
        /** JsDoc */
        /** Comments */
        z(a: Promise<readonly [{k: MySecondSubType}[]]>): Array<MyThirdSubType>;
      };

      /** Should not show up */
      export const myApi = new MyApi<MyApiType>({
        id: 'my-id',
        description: 'my-description',
      });
    `,
      {
        '/mem/type.ts': `export default class MyApi<T> {
          constructor(private readonly info: { id: string, description: string }) {}
        }`,
      },
    );

    const source = program.getSourceFile('/mem/index.ts');

    // Figure out type IDs so we can make sure they match later
    const checker = program.getTypeChecker();
    const symbols = checker.getSymbolsInScope(
      source!.getChildren().slice(-1)[0],
      ts.SymbolFlags.TypeAlias,
    );
    const Ids = [
      'MySubType',
      'MySubSubType',
      'MySecondSubType',
      'MyThirdSubType',
    ].reduce((ids, name) => {
      const symbol = symbols.find(s => s.escapedName === name)!;
      const type = checker.getTypeAtLocation(symbol.declarations[0]);
      ids[name] = (type.aliasSymbol as any).id;
      return ids;
    }, {} as { [key in string]: number });

    const typeLocator = TypeLocator.fromProgram(program, '/mem');

    const { apiInstances } = typeLocator.findExportedInstances({
      apiInstances: typeLocator.getExportedType('/mem/type.ts'),
    });

    expect(apiInstances.length).toBe(1);
    const [apiInstance] = apiInstances;

    const docGenerator = ApiDocGenerator.fromProgram(program, '/mem');
    const doc = docGenerator.toDoc(apiInstance);

    expect(doc.id).toBe('my-id');
    expect(doc.description).toBe('my-description');
    expect(doc.name).toBe('myApi');
    expect(doc.file).toBe('index.ts');
    expect(doc.interfaceInfos.length).toBe(1);
    expect(doc.interfaceInfos[0].docs).toEqual(['MyApiType Docs']);
    expect(doc.interfaceInfos[0].file).toBe('index.ts');
    expect(doc.interfaceInfos[0].lineInFile).toBe(24);
    expect(doc.interfaceInfos[0].name).toBe('MyApiType');
    expect(doc.interfaceInfos[0].members).toEqual([
      {
        type: 'prop',
        name: 'x',
        path: 'MyApiType.x',
        text: 'x: string',
        docs: ['Docs for x'],
        links: [],
      },
      {
        type: 'prop',
        name: 'y',
        path: 'MyApiType.y',
        text: 'y: MySubType',
        docs: [],
        links: [
          {
            id: Ids.MySubType,
            name: 'MySubType',
            path: 'index.ts/MySubType',
            location: [3, 12],
          },
        ],
      },
      {
        type: 'method',
        name: 'z',
        path: 'MyApiType.z',
        text:
          'z(a: Promise<readonly [{k: MySecondSubType}[]]>): Array<MyThirdSubType>',
        docs: ['Multiple', 'JsDoc', 'Comments'],
        links: [
          {
            id: Ids.MySecondSubType,
            name: 'MySecondSubType',
            path: 'index.ts/MySecondSubType',
            location: [27, 42],
          },
          {
            id: Ids.MyThirdSubType,
            name: 'MyThirdSubType',
            path: 'index.ts/MyThirdSubType',
            location: [56, 70],
          },
        ],
      },
    ]);
    expect(doc.interfaceInfos[0].dependentTypes).toEqual([
      {
        id: Ids.MySubType,
        name: 'MySubType',
        path: 'index.ts/MySubType',
        file: 'index.ts',
        lineInFile: 8,
        text: `type MySubType = {
        /** Field a docs */
        a: boolean;
        // Field b docs
        b: MySubSubType;
      }`,
        docs: ['MySubType Docs'],
        links: [
          {
            id: Ids.MySubSubType,
            name: 'MySubSubType',
            path: 'index.ts/MySubSubType',
            location: [102, 114],
          },
        ],
        children: [],
      },
      {
        id: Ids.MySubSubType,
        name: 'MySubSubType',
        path: 'index.ts/MySubSubType',
        file: 'index.ts',
        lineInFile: 5,
        text: 'type MySubSubType = { n: number; }',
        docs: ['MySubSubType Docs'],
        links: [],
        children: [],
      },
      {
        id: Ids.MySecondSubType,
        name: 'MySecondSubType',
        path: 'index.ts/MySecondSubType',
        file: 'index.ts',
        lineInFile: 18,
        text: 'export type MySecondSubType = { s: string }',
        docs: ['MySecondSubType Docs', 'With multiple comments'],
        links: [],
        children: [],
      },
      {
        id: Ids.MyThirdSubType,
        name: 'MyThirdSubType',
        path: 'index.ts/MyThirdSubType',
        file: 'index.ts',
        lineInFile: 21,
        text: 'type MyThirdSubType = { b: boolean }',
        docs: [],
        links: [],
        children: [],
      },
    ]);
  });
});
