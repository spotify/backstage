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

describe('TypeLocator', () => {
  it('should find a default export', () => {
    const program = createMemProgram('export default class MyApi<T> {}');

    const typeLocator = TypeLocator.fromProgram(program, '/mem');

    const apiType = typeLocator.getExportedType('/mem/index.ts');
    expect(apiType.symbol.name).toBe('default');
    const [declaration] = apiType.symbol.declarations;
    expect(declaration.kind).toBe(ts.SyntaxKind.ClassDeclaration);
    expect((declaration as ts.ClassDeclaration).name).toBeDefined();
    expect((declaration as ts.ClassDeclaration).name!.text).toBe('MyApi');
  }, 10000);

  it('should find api instance export', () => {
    const program = createMemProgram(
      `
      import MyApi from './type';

      type MyApiType = {};

      export const myApi = new MyApi<MyApiType>();
    `,
      {
        '/mem/type.ts': 'export default class MyApi<T> {}',
      },
    );

    const typeLocator = TypeLocator.fromProgram(program, '/mem');

    const { apiInstances } = typeLocator.findExportedInstances({
      apiInstances: typeLocator.getExportedType('/mem/type.ts'),
    });

    expect(apiInstances.length).toBe(1);
    const [apiInstance] = apiInstances;
    expect(apiInstance.name).toBe('myApi');
    expect(apiInstance.source.fileName).toBe('/mem/index.ts');
    expect(apiInstance.args).toEqual([]);

    expect(apiInstance.typeArgs.length).toBe(1);
    const [typeArg] = apiInstance.typeArgs;
    expect(typeArg.kind).toBe(ts.SyntaxKind.TypeReference);
    expect((typeArg as ts.TypeReferenceNode).typeName.getText()).toBe(
      'MyApiType',
    );
  });
});
