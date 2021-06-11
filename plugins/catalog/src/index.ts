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

export { AboutCard } from './components/AboutCard';
export { EntityLayout } from './components/EntityLayout';
export { EntityPageLayout } from './components/EntityPageLayout';
export { CatalogTable } from './components/CatalogTable';
export * from './components/EntitySwitch';
export { Router } from './components/Router';
export {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
  catalogPlugin as plugin,
  EntityAboutCard,
  EntityDependsOnComponentsCard,
  EntityDependsOnResourcesCard,
  EntityHasComponentsCard,
  EntityHasResourcesCard,
  EntityHasSubcomponentsCard,
  EntityHasSystemsCard,
  EntityLinksCard,
  EntitySystemDiagramCard,
} from './plugin';
export * from './components/EntityOrphanWarning';
