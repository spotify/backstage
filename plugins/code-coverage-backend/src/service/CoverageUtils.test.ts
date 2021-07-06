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
import fs from 'fs';
import { Readable } from 'stream';
import {
  calculatePercentage,
  aggregateCoverage,
  CoverageUtils,
} from './CoverageUtils';
import { Entity } from '@backstage/catalog-model';
import { parseString } from 'xml2js';

describe('calculatePercentage', () => {
  [
    [100, 25, 25],
    [100, 100, 100],
    [133, 13, 9.77],
    [0, 0, 0],
  ].forEach(([a, c, e]) => {
    it(`${c}/${a} === ${e}`, () => {
      expect(calculatePercentage(a, c)).toEqual(e);
    });
  });
});

/* eslint-disable no-restricted-syntax */

describe('aggregateCoverage', () => {
  [
    {
      file: 'jacoco-jsoncoverage-files-1.json',
      expected: {
        branch: {
          available: 68,
          covered: 48,
          missed: 20,
          percentage: 70.59,
        },
        line: {
          available: 162,
          covered: 105,
          missed: 57,
          percentage: 64.81,
        },
        timestamp: 1234567890,
      },
    },
    {
      file: 'cobertura-jsoncoverage-files-1.json',
      expected: {
        branch: {
          available: 0,
          covered: 0,
          missed: 0,
          percentage: 0,
        },
        line: {
          available: 146,
          covered: 145,
          missed: 1,
          percentage: 99.32,
        },
        timestamp: 1234567890,
      },
    },
    {
      file: 'cobertura-jsoncoverage-files-2.json',
      expected: {
        branch: {
          available: 466,
          covered: 380,
          missed: 86,
          percentage: 81.55,
        },
        line: {
          available: 2632,
          covered: 2079,
          missed: 553,
          percentage: 78.99,
        },
        timestamp: 1234567890,
      },
    },
    {
      file: 'cobertura-jsoncoverage-files-3.json',
      expected: {
        branch: {
          available: 73,
          covered: 49,
          missed: 24,
          percentage: 67.12,
        },
        line: {
          available: 110,
          covered: 91,
          missed: 19,
          percentage: 82.73,
        },
        timestamp: 1234567890,
      },
    },
    {
      file: 'cobertura-jsoncoverage-files-4.json',
      expected: {
        branch: {
          available: 0,
          covered: 0,
          missed: 0,
          percentage: 0,
        },
        line: {
          available: 325,
          covered: 0,
          missed: 325,
          percentage: 0,
        },
        timestamp: 1234567890,
      },
    },
    {
      file: 'cobertura-jsoncoverage-files-5.json',
      expected: {
        branch: {
          available: 38,
          covered: 21,
          missed: 17,
          percentage: 55.26,
        },
        line: {
          available: 175,
          covered: 124,
          missed: 51,
          percentage: 70.86,
        },
        timestamp: 1234567890,
      },
    },
  ].forEach(td => {
    it(`processes ${td.file}`, () => {
      const json = JSON.parse(
        fs.readFileSync(`${__dirname}/__fixtures__/${td.file}`).toString(),
      );
      const aggregate = aggregateCoverage({
        metadata: {
          generationTime: 1234567890,
          vcs: {
            location: 'foo',
            type: 'foo',
          },
        },
        entity: {
          kind: 'foo',
          name: 'foo',
          namespace: 'default',
        },
        files: json,
      });

      expect(aggregate).toEqual(td.expected);
    });
  });
});

describe('CodeCoverageUtils', () => {
  const scmFilesFixture = fs
    .readFileSync(`${__dirname}/__fixtures__/cobertura-sourcefiles-1.txt`)
    .toString()
    .split('\n')
    .map(f => {
      return { path: f };
    });
  const scmIntegraions = {
    byUrl: jest.fn().mockReturnValue({
      type: 'local',
      title: 'local',
    }),
  };
  const scmTree = {
    files: jest
      .fn()
      .mockReturnValue(new Promise((r, _e) => r(scmFilesFixture))),
  };
  const urlReader = {
    readTree: jest.fn().mockReturnValue(new Promise((r, _e) => r(scmTree))),
  };
  const utils = new CoverageUtils(scmIntegraions, urlReader);

  describe('validateRequestBody', () => {
    it('rejects missing content type', () => {
      let err: Error | null = null;
      try {
        const mockRequest: Partial<Request> = {
          // @ts-ignore
          headers: {},
        };
        // @ts-ignore
        utils.validateRequestBody(mockRequest as Request);
      } catch (error) {
        err = error;
      }
      expect(err?.message).toEqual('Content-Type missing');
    });

    it('rejects unsupported content type', () => {
      let err: Error | null = null;
      try {
        const mockRequest: Partial<Request> = {
          headers: {
            // @ts-ignore
            'content-type': 'application/json',
          },
        };

        // @ts-ignore
        utils.validateRequestBody(mockRequest as Request);
      } catch (error) {
        err = error;
      }
      expect(err?.message).toEqual('Illegal Content-Type');
    });

    it('parses the body', () => {
      const mockRequest: Partial<Request> = {
        headers: {
          // @ts-ignore
          'content-type': 'text/xml',
        },
        // @ts-ignore
        body: Readable.from(
          '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><report name="example"></report>',
        ),
      };

      // @ts-ignore
      const data: Readable = utils.validateRequestBody(mockRequest as Request);

      expect(data.read()).toContain('<?xml');
    });
  });

  describe('processCoveragePayload', () => {
    const mockRequest: Partial<Request> = {
      headers: {
        // @ts-ignore
        'content-type': 'text/xml',
      },
      // @ts-ignore
      body: Readable.from(
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><report name="example"></report>',
      ),
    };

    it('ignores scm if annotation is not set', async () => {
      const entity: Entity = {
        kind: 'Component',
        metadata: {
          name: 'test-entity',
          namespace: 'test',
        },
        apiVersion: 'backstage.io/v1alpha1',
      };

      const {
        scmFiles,
        sourceLocation,
        vcs,
        body, // @ts-ignore
      } = await utils.processCoveragePayload(entity, mockRequest);
      let data;
      // in normal flow the express app will already have done this through the middleware
      parseString((body as Readable).read(), (_e, r) => {
        data = r;
      });

      expect(scmFiles.length).toBe(0);
      expect(vcs).toBeUndefined();
      expect(sourceLocation).toBeUndefined();
      expect(data).toEqual({
        report: {
          $: {
            name: 'example',
          },
        },
      });
    });

    it('populates scm data if annotation  is set', async () => {
      const entity: Entity = {
        kind: 'Component',
        metadata: {
          name: 'test-entity',
          namespace: 'test',
          annotations: {
            'backstage.io/code-coverage': 'scm-only',
            'backstage.io/source-location':
              'url:https://github.com/example/test/',
          },
        },
        apiVersion: 'backstage.io/v1alpha1',
      };

      const {
        scmFiles,
        sourceLocation,
        vcs, // @ts-ignore
      } = await utils.processCoveragePayload(entity, mockRequest);

      expect(scmFiles.length).toBe(scmFiles.length);
      expect(vcs).not.toBeUndefined();
      expect(sourceLocation).not.toBeUndefined();
    });
  });
});
