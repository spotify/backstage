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

import GraphiQLIconComponent from './assets/graphiql.icon.svg';
import { IconComponent } from '@backstage/core-plugin-api';

export {
  graphiqlPlugin,
  graphiqlPlugin as plugin,
  GraphiQLPage,
} from './plugin';
export { GraphiQLPage as Router } from './components';
export * from './lib/api';
export * from './route-refs';
export const GraphiQLIcon: IconComponent = GraphiQLIconComponent as IconComponent;
