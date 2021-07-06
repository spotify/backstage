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

/*
Naming rules for relations in priority order:

1. Use at most two words. One main verb and a specifier, e.g. "ownerOf"
2. Reading out "<source-kind> <type> <target-kind>" should make sense in English.
3. Maintain symmetry between pairs, e.g. "ownedBy" and "ownerOf" rather than "owns".
*/

/**
 * An ownership relation where the owner is usually an organizational
 * entity (user or group), and the other entity can be anything.
 */
export const RELATION_OWNED_BY = 'ownedBy';
export const RELATION_OWNER_OF = 'ownerOf';

/**
 * A relation with an API entity, typically from a component
 */
export const RELATION_CONSUMES_API = 'consumesApi';
export const RELATION_API_CONSUMED_BY = 'apiConsumedBy';
export const RELATION_PROVIDES_API = 'providesApi';
export const RELATION_API_PROVIDED_BY = 'apiProvidedBy';

/**
 * A relation denoting a dependency on another entity.
 */
export const RELATION_DEPENDS_ON = 'dependsOn';
export const RELATION_DEPENDENCY_OF = 'dependencyOf';

/**
 * A parent/child relation to build up a tree, used for example to describe
 * the organizational structure between groups.
 */
export const RELATION_PARENT_OF = 'parentOf';
export const RELATION_CHILD_OF = 'childOf';

/**
 * A membership relation, typically for users in a group.
 */
export const RELATION_MEMBER_OF = 'memberOf';
export const RELATION_HAS_MEMBER = 'hasMember';

/**
 * A part/whole relation, typically for components in a system and systems
 * in a domain.
 */
export const RELATION_PART_OF = 'partOf';
export const RELATION_HAS_PART = 'hasPart';
