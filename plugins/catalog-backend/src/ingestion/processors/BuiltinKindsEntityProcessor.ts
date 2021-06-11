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

import {
  ApiEntity,
  apiEntityV1alpha1Validator,
  ComponentEntity,
  componentEntityV1alpha1Validator,
  DomainEntity,
  domainEntityV1alpha1Validator,
  Entity,
  getEntityName,
  GroupEntity,
  groupEntityV1alpha1Validator,
  locationEntityV1alpha1Validator,
  LocationSpec,
  parseEntityRef,
  RELATION_API_CONSUMED_BY,
  RELATION_API_PROVIDED_BY,
  RELATION_CHILD_OF,
  RELATION_CONSUMES_API,
  RELATION_DEPENDENCY_OF,
  RELATION_DEPENDS_ON,
  RELATION_HAS_MEMBER,
  RELATION_HAS_PART,
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PARENT_OF,
  RELATION_PART_OF,
  RELATION_PROVIDES_API,
  ResourceEntity,
  resourceEntityV1alpha1Validator,
  SystemEntity,
  systemEntityV1alpha1Validator,
  TemplateEntity,
  templateEntityV1alpha1Validator,
  templateEntityV1beta2Validator,
  UserEntity,
  userEntityV1alpha1Validator,
} from '@backstage/catalog-model';
import * as result from './results';
import { CatalogProcessor, CatalogProcessorEmit } from './types';

export class BuiltinKindsEntityProcessor implements CatalogProcessor {
  private readonly validators = [
    apiEntityV1alpha1Validator,
    componentEntityV1alpha1Validator,
    resourceEntityV1alpha1Validator,
    groupEntityV1alpha1Validator,
    locationEntityV1alpha1Validator,
    templateEntityV1alpha1Validator,
    templateEntityV1beta2Validator,
    userEntityV1alpha1Validator,
    systemEntityV1alpha1Validator,
    domainEntityV1alpha1Validator,
  ];

  async validateEntityKind(entity: Entity): Promise<boolean> {
    for (const validator of this.validators) {
      const results = await validator.check(entity);
      if (results) {
        return true;
      }
    }

    return false;
  }

  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    const selfRef = getEntityName(entity);

    /*
     * Utilities
     */

    function doEmit(
      targets: string | string[] | undefined,
      context: { defaultKind?: string; defaultNamespace: string },
      outgoingRelation: string,
      incomingRelation: string,
    ): void {
      if (!targets) {
        return;
      }
      for (const target of [targets].flat()) {
        const targetRef = parseEntityRef(target, context);
        if (targetRef.kind === undefined) {
          throw new Error(
            `Entity reference "${target}" did not specify a kind (e.g. starting with "Component:"), and has no default`,
          );
        }
        emit(
          result.relation({
            source: selfRef,
            type: outgoingRelation,
            target: {
              kind: targetRef.kind,
              namespace: targetRef.namespace,
              name: targetRef.name,
            },
          }),
        );
        emit(
          result.relation({
            source: {
              kind: targetRef.kind,
              namespace: targetRef.namespace,
              name: targetRef.name,
            },
            type: incomingRelation,
            target: selfRef,
          }),
        );
      }
    }

    /*
     * Emit relations for the Template kind
     */
    if (entity.kind === 'Template') {
      const template = entity as TemplateEntity;
      doEmit(
        template.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
    }

    /*
     * Emit relations for the Component kind
     */

    if (entity.kind === 'Component') {
      const component = entity as ComponentEntity;
      doEmit(
        component.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
      doEmit(
        component.spec.subcomponentOf,
        { defaultKind: 'Component', defaultNamespace: selfRef.namespace },
        RELATION_PART_OF,
        RELATION_HAS_PART,
      );
      doEmit(
        component.spec.providesApis,
        { defaultKind: 'API', defaultNamespace: selfRef.namespace },
        RELATION_PROVIDES_API,
        RELATION_API_PROVIDED_BY,
      );
      doEmit(
        component.spec.consumesApis,
        { defaultKind: 'API', defaultNamespace: selfRef.namespace },
        RELATION_CONSUMES_API,
        RELATION_API_CONSUMED_BY,
      );
      doEmit(
        component.spec.dependsOn,
        { defaultNamespace: selfRef.namespace },
        RELATION_DEPENDS_ON,
        RELATION_DEPENDENCY_OF,
      );
      doEmit(
        component.spec.system,
        { defaultKind: 'System', defaultNamespace: selfRef.namespace },
        RELATION_PART_OF,
        RELATION_HAS_PART,
      );
    }

    /*
     * Emit relations for the API kind
     */

    if (entity.kind === 'API') {
      const api = entity as ApiEntity;
      doEmit(
        api.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
      doEmit(
        api.spec.system,
        { defaultKind: 'System', defaultNamespace: selfRef.namespace },
        RELATION_PART_OF,
        RELATION_HAS_PART,
      );
    }

    /*
     * Emit relations for the Resource kind
     */

    if (entity.kind === 'Resource') {
      const resource = entity as ResourceEntity;
      doEmit(
        resource.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
      doEmit(
        resource.spec.dependsOn,
        { defaultNamespace: selfRef.namespace },
        RELATION_DEPENDS_ON,
        RELATION_DEPENDENCY_OF,
      );
      doEmit(
        resource.spec.system,
        { defaultKind: 'System', defaultNamespace: selfRef.namespace },
        RELATION_PART_OF,
        RELATION_HAS_PART,
      );
    }

    /*
     * Emit relations for the User kind
     */

    if (entity.kind === 'User') {
      const user = entity as UserEntity;
      doEmit(
        user.spec.memberOf,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_MEMBER_OF,
        RELATION_HAS_MEMBER,
      );
    }

    /*
     * Emit relations for the Group kind
     */

    if (entity.kind === 'Group') {
      const group = entity as GroupEntity;
      doEmit(
        group.spec.parent,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_CHILD_OF,
        RELATION_PARENT_OF,
      );
      doEmit(
        group.spec.children,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_PARENT_OF,
        RELATION_CHILD_OF,
      );
      doEmit(
        group.spec.members,
        { defaultKind: 'User', defaultNamespace: selfRef.namespace },
        RELATION_HAS_MEMBER,
        RELATION_MEMBER_OF,
      );
    }

    /*
     * Emit relations for the System kind
     */

    if (entity.kind === 'System') {
      const system = entity as SystemEntity;
      doEmit(
        system.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
      doEmit(
        system.spec.domain,
        { defaultKind: 'Domain', defaultNamespace: selfRef.namespace },
        RELATION_PART_OF,
        RELATION_HAS_PART,
      );
    }

    /*
     * Emit relations for the Domain kind
     */

    if (entity.kind === 'Domain') {
      const domain = entity as DomainEntity;
      doEmit(
        domain.spec.owner,
        { defaultKind: 'Group', defaultNamespace: selfRef.namespace },
        RELATION_OWNED_BY,
        RELATION_OWNER_OF,
      );
    }

    return entity;
  }
}
