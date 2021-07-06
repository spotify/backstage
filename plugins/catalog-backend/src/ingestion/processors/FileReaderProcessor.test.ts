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

import { FileReaderProcessor } from './FileReaderProcessor';
import {
  CatalogProcessorEntityResult,
  CatalogProcessorErrorResult,
  CatalogProcessorResult,
} from './types';
import path from 'path';

describe('FileReaderProcessor', () => {
  const fixturesRoot = path.join(
    'src',
    'ingestion',
    'processors',
    '__fixtures__',
    'fileReaderProcessor',
  );

  it('should load from file', async () => {
    const processor = new FileReaderProcessor();
    const spec = {
      type: 'file',
      target: `${path.join(fixturesRoot, 'component.yaml')}`,
    };

    const generated = (await new Promise<CatalogProcessorResult>(emit =>
      processor.readLocation(spec, false, emit),
    )) as CatalogProcessorEntityResult;

    expect(generated.type).toBe('entity');
    expect(generated.location).toEqual(spec);
    expect(generated.entity).toEqual({ kind: 'Component' });
  });

  it('should fail load from file with error', async () => {
    const processor = new FileReaderProcessor();
    const spec = {
      type: 'file',
      target: `${path.join(fixturesRoot, 'missing.yaml')}`,
    };

    const generated = (await new Promise<CatalogProcessorResult>(emit =>
      processor.readLocation(spec, false, emit),
    )) as CatalogProcessorErrorResult;

    expect(generated.type).toBe('error');
    expect(generated.location).toBe(spec);
    expect(generated.error.name).toBe('NotFoundError');
    expect(generated.error.message).toBe(
      `file ${path.join(fixturesRoot, 'missing.yaml')} does not exist`,
    );
  });

  it('should support globs', async () => {
    const processor = new FileReaderProcessor();

    const emit = jest.fn();

    await processor.readLocation(
      { type: 'file', target: `${path.join(fixturesRoot, '**', '*.yaml')}` },
      false,
      emit,
    );

    expect(emit).toBeCalledTimes(2);
    expect(emit.mock.calls[0][0].entity).toEqual({ kind: 'Component' });
    expect(emit.mock.calls[0][0].location).toEqual({
      type: 'file',
      target: expect.stringMatching(/^[^*]*$/),
    });
    expect(emit.mock.calls[1][0].entity).toEqual({ kind: 'API' });
    expect(emit.mock.calls[1][0].location).toEqual({
      type: 'file',
      target: expect.stringMatching(/^[^*]*$/),
    });
  });
});
