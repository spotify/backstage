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
export { MicrosoftGraphClient } from './client';
export { readMicrosoftGraphConfig } from './config';
export type { MicrosoftGraphProviderConfig } from './config';
export {
  MICROSOFT_GRAPH_GROUP_ID_ANNOTATION,
  MICROSOFT_GRAPH_TENANT_ID_ANNOTATION,
  MICROSOFT_GRAPH_USER_ID_ANNOTATION,
} from './constants';
export { normalizeEntityName } from './helper';
export {
  defaultGroupTransformer,
  defaultOrganizationTransformer,
  defaultUserTransformer,
  readMicrosoftGraphOrg,
} from './read';
export type {
  GroupTransformer,
  OrganizationTransformer,
  UserTransformer,
} from './types';
