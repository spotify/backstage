/*
 * Copyright 2020 Spotify AB
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
import {
  LOCATION_ANNOTATION,
  TemplateEntityV1alpha1,
} from '@backstage/catalog-model';
import { joinGitUrlPath, parseLocationAnnotation } from './helpers';

describe('Helpers', () => {
  describe('parseLocationAnnotation', () => {
    it('throws an exception when no annotation location', () => {
      const mockEntity: TemplateEntityV1alpha1 = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Template',
        metadata: {
          annotations: {},
          name: 'graphql-starter',
          title: 'GraphQL Service',
          description:
            'A GraphQL starter template for backstage to get you up and running\nthe best practices with GraphQL\n',
          uid: '9cf16bad-16e0-4213-b314-c4eec773c50b',
          etag: 'ZTkxMjUxMjUtYWY3Yi00MjU2LWFkYWMtZTZjNjU5ZjJhOWM2',
          generation: 1,
        },
        spec: {
          type: 'website',
          templater: 'cookiecutter',
          path: './template',
          schema: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            required: ['storePath', 'owner'],
            properties: {
              owner: {
                type: 'string',
                title: 'Owner',
                description: 'Who is going to own this component',
              },
              storePath: {
                type: 'string',
                title: 'Store path',
                description: 'GitHub store path in org/repo format',
              },
            },
          },
          owner: 'team-d@example.com',
        },
      };

      expect(() => parseLocationAnnotation(mockEntity)).toThrow(
        expect.objectContaining({
          name: 'InputError',
          message: `No location annotation provided in entity: ${mockEntity.metadata.name}`,
        }),
      );
    });

    it('should throw an error when the protocol part is not set in the location annotation', () => {
      const mockEntity: TemplateEntityV1alpha1 = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Template',
        metadata: {
          annotations: {
            [LOCATION_ANNOTATION]:
              ':https://github.com/o/r/blob/master/template.yaml',
          },
          name: 'graphql-starter',
          title: 'GraphQL Service',
          description:
            'A GraphQL starter template for backstage to get you up and running\nthe best practices with GraphQL\n',
          uid: '9cf16bad-16e0-4213-b314-c4eec773c50b',
          etag: 'ZTkxMjUxMjUtYWY3Yi00MjU2LWFkYWMtZTZjNjU5ZjJhOWM2',
          generation: 1,
        },
        spec: {
          type: 'website',
          templater: 'cookiecutter',
          path: './template',
          schema: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            required: ['storePath', 'owner'],
            properties: {
              owner: {
                type: 'string',
                title: 'Owner',
                description: 'Who is going to own this component',
              },
              storePath: {
                type: 'string',
                title: 'Store path',
                description: 'GitHub store path in org/repo format',
              },
            },
          },
          owner: 'team-b@example.com',
        },
      };

      expect(() => parseLocationAnnotation(mockEntity)).toThrow(
        expect.objectContaining({
          name: 'TypeError',
          message:
            "Unable to parse location reference ':https://github.com/o/r/blob/master/template.yaml', expected '<type>:<target>', e.g. 'url:https://host/path'",
        }),
      );
    });

    it('should throw an error when the location part is not set in the location annotation', () => {
      const mockEntity: TemplateEntityV1alpha1 = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Template',
        metadata: {
          annotations: {
            [LOCATION_ANNOTATION]: 'github:',
          },
          name: 'graphql-starter',
          title: 'GraphQL Service',
          description:
            'A GraphQL starter template for backstage to get you up and running\nthe best practices with GraphQL\n',
          uid: '9cf16bad-16e0-4213-b314-c4eec773c50b',
          etag: 'ZTkxMjUxMjUtYWY3Yi00MjU2LWFkYWMtZTZjNjU5ZjJhOWM2',
          generation: 1,
        },
        spec: {
          type: 'website',
          templater: 'cookiecutter',
          path: './template',
          schema: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            required: ['storePath', 'owner'],
            properties: {
              owner: {
                type: 'string',
                title: 'Owner',
                description: 'Who is going to own this component',
              },
              storePath: {
                type: 'string',
                title: 'Store path',
                description: 'GitHub store path in org/repo format',
              },
            },
          },
          owner: 'team-a@example.com',
        },
      };

      expect(() => parseLocationAnnotation(mockEntity)).toThrow(
        expect.objectContaining({
          name: 'TypeError',
          message: `Unable to parse location reference 'github:', expected '<type>:<target>', e.g. 'url:https://host/path'`,
        }),
      );
    });

    it('should parse the location and protocol correctly for simple locations', () => {
      const mockEntity: TemplateEntityV1alpha1 = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Template',
        metadata: {
          annotations: {
            [LOCATION_ANNOTATION]: 'file:./path',
          },
          name: 'graphql-starter',
          title: 'GraphQL Service',
          description:
            'A GraphQL starter template for backstage to get you up and running\nthe best pracices with GraphQL\n',
          uid: '9cf16bad-16e0-4213-b314-c4eec773c50b',
          etag: 'ZTkxMjUxMjUtYWY3Yi00MjU2LWFkYWMtZTZjNjU5ZjJhOWM2',
          generation: 1,
        },
        spec: {
          type: 'website',
          templater: 'cookiecutter',
          path: './template',
          schema: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            required: ['storePath', 'owner'],
            properties: {
              owner: {
                type: 'string',
                title: 'Owner',
                description: 'Who is going to own this component',
              },
              storePath: {
                type: 'string',
                title: 'Store path',
                description: 'GitHub store path in org/repo format',
              },
            },
          },
          owner: 'team-b@example.com',
        },
      };

      expect(parseLocationAnnotation(mockEntity)).toEqual({
        protocol: 'file',
        location: './path',
      });
    });

    it('should parse the location and protocol correctly for complex with unescaped locations', () => {
      const mockEntity: TemplateEntityV1alpha1 = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Template',
        metadata: {
          annotations: {
            [LOCATION_ANNOTATION]: 'github:https://lol.com/:something/shello',
          },
          name: 'graphql-starter',
          title: 'GraphQL Service',
          description:
            'A GraphQL starter template for backstage to get you up and running\nthe best practices with GraphQL\n',
          uid: '9cf16bad-16e0-4213-b314-c4eec773c50b',
          etag: 'ZTkxMjUxMjUtYWY3Yi00MjU2LWFkYWMtZTZjNjU5ZjJhOWM2',
          generation: 1,
        },
        spec: {
          type: 'website',
          templater: 'cookiecutter',
          path: './template',
          schema: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            required: ['storePath', 'owner'],
            properties: {
              owner: {
                type: 'string',
                title: 'Owner',
                description: 'Who is going to own this component',
              },
              storePath: {
                type: 'string',
                title: 'Store path',
                description: 'GitHub store path in org/repo format',
              },
            },
          },
          owner: 'team-c@example.com',
        },
      };

      expect(parseLocationAnnotation(mockEntity)).toEqual({
        protocol: 'github',
        location: 'https://lol.com/:something/shello',
      });
    });
  });

  describe('joinGitUrlPath', () => {
    it.each([
      [
        'https://github.com/o/r/blob/master/template.yaml',
        'template',
        'https://github.com/o/r/blob/master/template',
      ],
      [
        'https://dev.azure.com/o/p/_git/template-repo?path=%2Ftemplate.yaml',
        undefined,
        'https://dev.azure.com/o/p/_git/template-repo?path=%2F',
      ],
      [
        'https://dev.azure.com/o/p/_git/template-repo?path=%2Ftemplate.yaml',
        'a',
        'https://dev.azure.com/o/p/_git/template-repo?path=%2Fa',
      ],
      [
        'https://dev.azure.com/o/p/_git/template-repo?path=%2Fa%2Ftemplate.yaml',
        'b',
        'https://dev.azure.com/o/p/_git/template-repo?path=%2Fa%2Fb',
      ],
      [
        'https://github.com/o/r/blob/master/template.yaml',
        undefined,
        'https://github.com/o/r/blob/master',
      ],
      [
        'https://github.com/o/r/blob/master/template.yaml',
        'template',
        'https://github.com/o/r/blob/master/template',
      ],
      [
        'https://github.com/o/r/blob/master/templates/graphql-starter/template.yaml',
        'template',
        'https://github.com/o/r/blob/master/templates/graphql-starter/template',
      ],
      [
        'https://gitlab.com/o/r/-/blob/master/template.yaml',
        undefined,
        'https://gitlab.com/o/r/-/blob/master',
      ],
      [
        'https://gitlab.com/o/r/-/blob/master/template.yaml',
        'template',
        'https://gitlab.com/o/r/-/blob/master/template',
      ],
      [
        'https://gitlab.com/o/r/-/blob/master/a/b/c/template.yaml',
        '../../c',
        'https://gitlab.com/o/r/-/blob/master/a/c',
      ],
      [
        'https://bitbucket.org/p/r/src/master/a/b/template.yaml',
        undefined,
        'https://bitbucket.org/p/r/src/master/a/b',
      ],
      [
        'https://bitbucket.org/p/r/src/master/a/b/template.yaml',
        'c',
        'https://bitbucket.org/p/r/src/master/a/b/c',
      ],
      [
        'https://bitbucket.org/p/r/src/master/a/b/template.yaml',
        '../c',
        'https://bitbucket.org/p/r/src/master/a/c',
      ],
    ])('should join git url %s with path %s', (url, path, result) => {
      expect(joinGitUrlPath(url, path)).toBe(result);
    });
  });
});
