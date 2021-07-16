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

import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import { IndexableDocument, DocumentCollator } from '@backstage/search-common';
import fetch from 'cross-fetch';
import unescape from 'lodash/unescape';
import { Logger } from 'winston';
import pLimit from 'p-limit';
import { CatalogApi, CatalogClient } from '@backstage/catalog-client';

interface MkSearchIndexDoc {
  title: string;
  text: string;
  location: string;
}

export interface TechDocsDocument extends IndexableDocument {
  kind: string;
  namespace: string;
  name: string;
  lifecycle: string;
  owner: string;
}

export class DefaultTechDocsCollator implements DocumentCollator {
  protected discovery: PluginEndpointDiscovery;
  protected locationTemplate: string;
  private readonly logger: Logger;
  private readonly catalogClient: CatalogApi;
  private readonly parallelismLimit: number;
  public readonly type: string = 'techdocs';

  constructor({
    discovery,
    locationTemplate,
    logger,
    catalogClient,
    parallelismLimit = 10,
  }: {
    discovery: PluginEndpointDiscovery;
    logger: Logger;
    locationTemplate?: string;
    catalogClient?: CatalogApi;
    parallelismLimit?: number;
  }) {
    this.discovery = discovery;
    this.locationTemplate =
      locationTemplate || '/docs/:namespace/:kind/:name/:path';
    this.logger = logger;
    this.catalogClient =
      catalogClient || new CatalogClient({ discoveryApi: discovery });
    this.parallelismLimit = parallelismLimit;
  }

  async execute() {
    const limit = pLimit(this.parallelismLimit);
    const techDocsBaseUrl = await this.discovery.getBaseUrl('techdocs');
    const entities = await this.catalogClient.getEntities({
      fields: [
        'kind',
        'namespace',
        'metadata.annotations',
        'metadata.name',
        'metadata.namespace',
        'spec.type',
        'spec.lifecycle',
        'relations',
      ],
    });
    const docPromises = entities.items
      .filter(it => it.metadata?.annotations?.['backstage.io/techdocs-ref'])
      .map((entity: Entity) =>
        limit(
          async (): Promise<TechDocsDocument[]> => {
            const entityInfo = {
              kind: entity.kind,
              namespace: entity.metadata.namespace || 'default',
              name: entity.metadata.name,
            };

            try {
              const searchIndexResponse = await fetch(
                DefaultTechDocsCollator.constructDocsIndexUrl(
                  techDocsBaseUrl,
                  entityInfo,
                ),
              );
              const searchIndex = await searchIndexResponse.json();

              return searchIndex.docs.map((doc: MkSearchIndexDoc) => ({
                title: unescape(doc.title),
                text: unescape(doc.text || ''),
                location: this.applyArgsToFormat(this.locationTemplate, {
                  ...entityInfo,
                  path: doc.location,
                }),
                ...entityInfo,
                componentType: entity.spec?.type?.toString() || 'other',
                lifecycle: (entity.spec?.lifecycle as string) || '',
                owner:
                  entity.relations?.find(r => r.type === RELATION_OWNED_BY)
                    ?.target?.name || '',
              }));
            } catch (e) {
              this.logger.warn(
                `Failed to retrieve tech docs search index for entity ${entityInfo.namespace}/${entityInfo.kind}/${entityInfo.name}`,
                e,
              );
              return [];
            }
          },
        ),
      );
    return (await Promise.all(docPromises)).flat();
  }

  protected applyArgsToFormat(
    format: string,
    args: Record<string, string>,
  ): string {
    let formatted = format;
    for (const [key, value] of Object.entries(args)) {
      formatted = formatted.replace(`:${key}`, value);
    }
    return formatted;
  }

  private static constructDocsIndexUrl(
    techDocsBaseUrl: string,
    entityInfo: { kind: string; namespace: string; name: string },
  ) {
    return `${techDocsBaseUrl}/static/docs/${entityInfo.namespace}/${entityInfo.kind}/${entityInfo.name}/search/search_index.json`;
  }
}
