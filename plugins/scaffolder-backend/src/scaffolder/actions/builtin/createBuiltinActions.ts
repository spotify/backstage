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

import { UrlReader } from '@backstage/backend-common';
import { CatalogApi } from '@backstage/catalog-client';
import { ScmIntegrations } from '@backstage/integration';
import { TemplaterBuilder } from '../../stages';
import { createCatalogRegisterAction } from './catalog';
import { createFetchCookiecutterAction, createFetchPlainAction } from './fetch';
import {
  createPublishAzureAction,
  createPublishBitbucketAction,
  createPublishGithubAction,
  createPublishGithubPullRequestAction,
  createPublishGitlabAction,
} from './publish';

export const createBuiltinActions = (options: {
  reader: UrlReader;
  integrations: ScmIntegrations;
  catalogClient: CatalogApi;
  templaters: TemplaterBuilder;
}) => {
  const { reader, integrations, templaters, catalogClient } = options;

  return [
    createFetchPlainAction({
      reader,
      integrations,
    }),
    createFetchCookiecutterAction({
      reader,
      integrations,
      templaters,
    }),
    createPublishGithubAction({
      integrations,
    }),
    createPublishGithubPullRequestAction({
      integrations,
    }),
    createPublishGitlabAction({
      integrations,
    }),
    createPublishBitbucketAction({
      integrations,
    }),
    createPublishAzureAction({
      integrations,
    }),
    createCatalogRegisterAction({ catalogClient, integrations }),
  ];
};
