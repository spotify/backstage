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

import { EntityName } from '@backstage/catalog-model';
import { PartialEntity } from '../types';
import { createApiRef } from '@backstage/core-plugin-api';

export const catalogImportApiRef = createApiRef<CatalogImportApi>({
  id: 'plugin.catalog-import.service',
  description: 'Used by the catalog import plugin to make requests',
});

// result of the analyze state
export type AnalyzeResult =
  | {
      type: 'locations';
      locations: Array<{
        target: string;
        entities: EntityName[];
      }>;
    }
  | {
      type: 'repository';
      url: string;
      integrationType: string;
      generatedEntities: PartialEntity[];
    };

export interface CatalogImportApi {
  analyzeUrl(url: string): Promise<AnalyzeResult>;

  submitPullRequest(options: {
    repositoryUrl: string;
    fileContent: string;
    title: string;
    body: string;
  }): Promise<{ link: string; location: string }>;
}
