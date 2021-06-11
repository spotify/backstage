/*
 * Copyright 2021 Spotify AB
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

import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { CatalogApi } from '@backstage/catalog-client';
import { getEntityName } from '@backstage/catalog-model';
import { createTemplateAction } from '../../createTemplateAction';

export function createCatalogRegisterAction(options: {
  catalogClient: CatalogApi;
  integrations: ScmIntegrations;
}) {
  const { catalogClient, integrations } = options;

  return createTemplateAction<
    | { catalogInfoUrl: string }
    | { repoContentsUrl: string; catalogInfoPath?: string }
  >({
    id: 'catalog:register',
    description:
      'Registers entities from a catalog descriptor file in the workspace into the software catalog.',
    schema: {
      input: {
        oneOf: [
          {
            type: 'object',
            required: ['catalogInfoUrl'],
            properties: {
              catalogInfoUrl: {
                title: 'Catalog Info URL',
                description:
                  'An absolute URL pointing to the catalog info file location',
                type: 'string',
              },
            },
          },
          {
            type: 'object',
            required: ['repoContentsUrl'],
            properties: {
              repoContentsUrl: {
                title: 'Repository Contents URL',
                description:
                  'An absolute URL pointing to the root of a repository directory tree',
                type: 'string',
              },
              catalogInfoPath: {
                title: 'Fetch URL',
                description:
                  'A relative path from the repo root pointing to the catalog info file, defaults to /catalog-info.yaml',
                type: 'string',
              },
            },
          },
        ],
      },
    },
    async handler(ctx) {
      const { input } = ctx;

      let catalogInfoUrl;
      if ('catalogInfoUrl' in input) {
        catalogInfoUrl = input.catalogInfoUrl;
      } else {
        const {
          repoContentsUrl,
          catalogInfoPath = '/catalog-info.yaml',
        } = input;
        const integration = integrations.byUrl(repoContentsUrl);
        if (!integration) {
          throw new InputError(
            `No integration found for host ${repoContentsUrl}`,
          );
        }

        catalogInfoUrl = integration.resolveUrl({
          base: repoContentsUrl,
          url: catalogInfoPath,
        });
      }

      ctx.logger.info(`Registering ${catalogInfoUrl} in the catalog`);

      const result = await catalogClient.addLocation(
        {
          type: 'url',
          target: catalogInfoUrl,
        },
        ctx.token ? { token: ctx.token } : {},
      );
      if (result.entities.length >= 1) {
        const { kind, name, namespace } = getEntityName(result.entities[0]);
        ctx.output('entityRef', `${kind}:${namespace}/${name}`);
        ctx.output('catalogInfoUrl', catalogInfoUrl);
      }
    },
  });
}
