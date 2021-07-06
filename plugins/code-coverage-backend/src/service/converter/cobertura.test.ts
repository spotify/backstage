/*
 * Copyright 2021 The Backstage Authors
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
import { parseString } from 'xml2js';
import fs from 'fs';
import path from 'path';
import { Cobertura } from './cobertura';
import { CoberturaXML } from './types';
import { getVoidLogger } from '@backstage/backend-common';

/* eslint-disable no-restricted-syntax */

describe('convert cobertura', () => {
  const converter = new Cobertura(getVoidLogger());
  [1, 2, 3, 4, 5].forEach(idx => {
    let fixture: CoberturaXML;
    parseString(
      fs.readFileSync(
        path.resolve(
          __dirname,
          '..',
          '__fixtures__',
          `cobertura-testdata-${idx}.xml`,
        ),
      ),
      (_e, r) => {
        fixture = r;
      },
    );
    const expected = JSON.parse(
      fs
        .readFileSync(
          path.resolve(
            __dirname,
            '..',
            '__fixtures__',
            `cobertura-jsoncoverage-files-${idx}.json`,
          ),
        )
        .toString(),
    );
    const scmFiles = fs
      .readFileSync(
        path.resolve(
          __dirname,
          '..',
          '__fixtures__',
          `cobertura-sourcefiles-${idx}.txt`,
        ),
      )
      .toString()
      .split('\n');

    it(`${idx} converts a cobertura report`, () => {
      const files = converter.convert(fixture, scmFiles);

      expect(files).toEqual(expected);
    });
  });
});
