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

import { Config } from '@backstage/config';
import {
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import { ApiRef, createApiRef } from '@backstage/core-plugin-api';

export class ScmIntegrationsApi {
  static fromConfig(config: Config): ScmIntegrationRegistry {
    return ScmIntegrations.fromConfig(config);
  }
}

export const scmIntegrationsApiRef: ApiRef<ScmIntegrationRegistry> = createApiRef(
  {
    id: 'integration.scmintegrations',
    description: 'All of the registered SCM integrations of your config',
  },
);
