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

export * from './api';
export { EntityPageRollbar } from './components/EntityPageRollbar/EntityPageRollbar';
export {
  isPluginApplicableToEntity,
  isPluginApplicableToEntity as isRollbarAvailable,
  Router,
} from './components/Router';
export { ROLLBAR_ANNOTATION } from './constants';
export {
  EntityRollbarContent,
  rollbarPlugin as plugin,
  rollbarPlugin,
} from './plugin';
