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
import { getVoidLogger } from '@backstage/backend-common';
import fs from 'fs-extra';
import mockFs from 'mock-fs';
import os from 'os';
import path, { resolve as resolvePath } from 'path';
import { ParsedLocationAnnotation } from '../../helpers';
import { RemoteProtocol } from '../prepare/types';
import {
  addBuildTimestampMetadata,
  getGeneratorKey,
  getRepoUrlFromLocationAnnotation,
  isValidRepoUrlForMkdocs,
  patchMkdocsYmlPreBuild,
  storeEtagMetadata,
  validateMkdocsYaml,
} from './helpers';

const mockEntity = {
  apiVersion: 'version',
  kind: 'TestKind',
  metadata: {
    name: 'testName',
  },
};

const mkdocsYml = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs.yml'),
);
const mkdocsYmlWithExtensions = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_with_extensions.yml'),
);
const mkdocsYmlWithRepoUrl = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_with_repo_url.yml'),
);
const mkdocsYmlWithInvalidDocDir = fs.readFileSync(
  resolvePath(__filename, '../__fixtures__/mkdocs_invalid_doc_dir.yml'),
);
const mockLogger = getVoidLogger();
const rootDir = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

describe('helpers', () => {
  describe('getGeneratorKey', () => {
    it('should return techdocs as the only generator key', () => {
      const key = getGeneratorKey(mockEntity);
      expect(key).toBe('techdocs');
    });
  });

  describe('isValidRepoUrlForMkdocs', () => {
    it('should return true for valid repo_url values for mkdocs', () => {
      const validRepoUrls = [
        'https://github.com/org/repo',
        'https://github.com/backstage/backstage/',
        'https://github.com/org123/repo1-2-3/',
        'http://github.com/insecureOrg/insecureRepo',
        'https://gitlab.com/org/repo',
        'https://gitlab.com/backstage/backstage/',
        'https://gitlab.com/org123/repo1-2-3/',
        'http://gitlab.com/insecureOrg/insecureRepo',
      ];

      const validRemoteProtocols = ['github', 'gitlab'];

      validRepoUrls.forEach(url => {
        validRemoteProtocols.forEach(targetType => {
          expect(
            isValidRepoUrlForMkdocs(url, targetType as RemoteProtocol),
          ).toBe(true);
        });
      });
    });

    it('should return false for invalid repo_urls values for mkdocs', () => {
      const invalidRepoUrls = [
        'git@github.com:org/repo',
        'https://github.com/backstage/backstage/tree/master/plugins/techdocs-backend',
      ];

      invalidRepoUrls.forEach(url => {
        expect(isValidRepoUrlForMkdocs(url, 'github')).toBe(false);
      });
    });

    it('should return false for unsupported remote protocols', () => {
      const validRepoUrl = 'https://github.com/backstage/backstage';

      const unsupportedRemoteProtocols = ['dir', 'file', 'url'];

      unsupportedRemoteProtocols.forEach(targetType => {
        expect(
          isValidRepoUrlForMkdocs(validRepoUrl, targetType as RemoteProtocol),
        ).toBe(false);
      });
    });
  });

  describe('getRepoUrlFromLocationAnnotation', () => {
    it('should return undefined for unsupported location type', () => {
      const parsedLocationAnnotation1: ParsedLocationAnnotation = {
        type: 'dir',
        target: '/home/user/workspace/docs-repository',
      };

      const parsedLocationAnnotation2: ParsedLocationAnnotation = {
        type: 'file',
        target: '/home/user/workspace/docs-repository/catalog-info.yaml',
      };

      const parsedLocationAnnotation3: ParsedLocationAnnotation = {
        type: 'url',
        target: 'https://my-website.com/storage/this/docs/repository',
      };

      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation1)).toBe(
        undefined,
      );
      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation2)).toBe(
        undefined,
      );

      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation3)).toBe(
        undefined,
      );
    });

    it('should return correct target url for supported hosts', () => {
      const parsedLocationAnnotation1: ParsedLocationAnnotation = {
        type: 'github',
        target: 'https://github.com/backstage/backstage.git',
      };

      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation1)).toBe(
        'https://github.com/backstage/backstage',
      );

      const parsedLocationAnnotation2: ParsedLocationAnnotation = {
        type: 'github',
        target: 'https://github.com/org/repo',
      };

      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation2)).toBe(
        'https://github.com/org/repo',
      );

      const parsedLocationAnnotation3: ParsedLocationAnnotation = {
        type: 'gitlab',
        target: 'https://gitlab.com/org/repo',
      };

      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation3)).toBe(
        'https://gitlab.com/org/repo',
      );

      const parsedLocationAnnotation4: ParsedLocationAnnotation = {
        type: 'github',
        target:
          'github.com/backstage/backstage/blob/master/plugins/techdocs-backend/examples/documented-component',
      };

      expect(getRepoUrlFromLocationAnnotation(parsedLocationAnnotation4)).toBe(
        'github.com/backstage/backstage/blob/master/plugins/techdocs-backend/examples/documented-component',
      );
    });
  });

  describe('patchMkdocsYmlPreBuild', () => {
    beforeEach(() => {
      mockFs({
        '/mkdocs.yml': mkdocsYml,
        '/mkdocs_with_repo_url.yml': mkdocsYmlWithRepoUrl,
        '/mkdocs_with_extensions.yml': mkdocsYmlWithExtensions,
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should add repo_url to mkdocs.yml', async () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'github',
        target: 'https://github.com/backstage/backstage',
      };

      await patchMkdocsYmlPreBuild(
        '/mkdocs.yml',
        mockLogger,
        parsedLocationAnnotation,
      );

      const updatedMkdocsYml = await fs.readFile('/mkdocs.yml');

      expect(updatedMkdocsYml.toString()).toContain(
        'repo_url: https://github.com/backstage/backstage',
      );
    });

    it('should add repo_url to mkdocs.yml that contains custom yaml tags', async () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'github',
        target: 'https://github.com/backstage/backstage',
      };

      await patchMkdocsYmlPreBuild(
        '/mkdocs_with_extensions.yml',
        mockLogger,
        parsedLocationAnnotation,
      );

      const updatedMkdocsYml = await fs.readFile('/mkdocs_with_extensions.yml');

      expect(updatedMkdocsYml.toString()).toContain(
        'repo_url: https://github.com/backstage/backstage',
      );
      expect(updatedMkdocsYml.toString()).toContain(
        "emoji_index: !!python/name:materialx.emoji.twemoji ''",
      );
    });

    it('should not override existing repo_url in mkdocs.yml', async () => {
      const parsedLocationAnnotation: ParsedLocationAnnotation = {
        type: 'github',
        target: 'https://github.com/neworg/newrepo',
      };

      await patchMkdocsYmlPreBuild(
        '/mkdocs_with_repo_url.yml',
        mockLogger,
        parsedLocationAnnotation,
      );

      const updatedMkdocsYml = await fs.readFile('/mkdocs_with_repo_url.yml');

      expect(updatedMkdocsYml.toString()).toContain(
        'repo_url: https://github.com/backstage/backstage',
      );
      expect(updatedMkdocsYml.toString()).not.toContain(
        'repo_url: https://github.com/neworg/newrepo',
      );
    });
  });

  describe('addBuildTimestampMetadata', () => {
    beforeEach(() => {
      mockFs.restore();
      mockFs({
        [rootDir]: {
          'invalid_techdocs_metadata.json': 'dsds',
          'techdocs_metadata.json': '{"site_name": "Tech Docs"}',
        },
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should create the file if it does not exist', async () => {
      const filePath = path.join(rootDir, 'wrong_techdocs_metadata.json');
      await addBuildTimestampMetadata(filePath, mockLogger);

      // Check if the file exists
      await expect(
        fs.access(filePath, fs.constants.F_OK),
      ).resolves.not.toThrowError();
    });

    it('should throw error when the JSON is invalid', async () => {
      const filePath = path.join(rootDir, 'invalid_techdocs_metadata.json');

      await expect(
        addBuildTimestampMetadata(filePath, mockLogger),
      ).rejects.toThrowError('Unexpected token d in JSON at position 0');
    });

    it('should add build timestamp to the metadata json', async () => {
      const filePath = path.join(rootDir, 'techdocs_metadata.json');

      await addBuildTimestampMetadata(filePath, mockLogger);

      const json = await fs.readJson(filePath);
      expect(json.build_timestamp).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('storeEtagMetadata', () => {
    beforeEach(() => {
      mockFs.restore();
      mockFs({
        [rootDir]: {
          'invalid_techdocs_metadata.json': 'dsds',
          'techdocs_metadata.json': '{"site_name": "Tech Docs"}',
        },
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should throw error when the JSON is invalid', async () => {
      const filePath = path.join(rootDir, 'invalid_techdocs_metadata.json');

      await expect(
        storeEtagMetadata(filePath, 'etag123abc'),
      ).rejects.toThrowError('Unexpected token d in JSON at position 0');
    });

    it('should add etag to the metadata json', async () => {
      const filePath = path.join(rootDir, 'techdocs_metadata.json');

      await storeEtagMetadata(filePath, 'etag123abc');

      const json = await fs.readJson(filePath);
      expect(json.etag).toBe('etag123abc');
    });
  });

  describe('validateMkdocsYaml', () => {
    beforeEach(() => {
      mockFs({
        '/mkdocs.yml': mkdocsYml,
        '/mkdocs_with_extensions.yml': mkdocsYmlWithExtensions,
        '/mkdocs_invalid_doc_dir.yml': mkdocsYmlWithInvalidDocDir,
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    const inputDir = resolvePath(__filename, '../__fixtures__/');
    it('should return true on when no docs_dir present', async () => {
      await expect(
        validateMkdocsYaml(inputDir, '/mkdocs.yml'),
      ).resolves.toBeUndefined();
    });

    it('should return false on absolute doc_dir path', async () => {
      await expect(
        validateMkdocsYaml(inputDir, '/mkdocs_invalid_doc_dir.yml'),
      ).rejects.toThrow();
    });

    it('should return false on doc_dir path that traverses directory structure backwards', async () => {
      await expect(
        validateMkdocsYaml(inputDir, '/mkdocs_invalid_doc_dir2.yml'),
      ).rejects.toThrow();
    });

    it('should validate files with custom yaml tags', async () => {
      await expect(
        validateMkdocsYaml(inputDir, '/mkdocs_with_extensions.yml'),
      ).resolves.toBeUndefined();
    });
  });
});
