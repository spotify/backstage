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

import { UrlReader } from '@backstage/backend-common';
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
  parseLocationReference,
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
  stringifyLocationReference,
  SystemEntity,
  systemEntityV1alpha1Validator,
  TemplateEntity,
  templateEntityV1alpha1Validator,
  templateEntityV1beta2Validator,
  UserEntity,
  userEntityV1alpha1Validator,
} from '@backstage/catalog-model';
import fetch from 'cross-fetch';
import * as result from './results';
import { CatalogProcessor, CatalogProcessorEmit } from './types';

export class BuiltinKindsEntityProcessor implements CatalogProcessor {
  private readonly reader: UrlReader;
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

  constructor({ reader }: { reader: UrlReader }) {
    this.reader = reader;
  }

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
     * Emit relations and attachments for the API kind
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

      // TODO: Move to catalog model
      const ATTACHMENT_API_DEFINITION = 'backstage.io/api-definition';
      // TODO: Actually a hard question, depends either on the use case or data,
      // but for api definitions plain should be a fine choice.
      const contentType = 'text/plain';

      if (api.spec.definition) {
        const data = Buffer.from(api.spec.definition!, 'utf8');

        emit(
          result.attachment(ATTACHMENT_API_DEFINITION, { data, contentType }),
        );

        // TODO: How to migrate from "definition" to "definition?", it's a breaking change?
        delete api.spec.definition;
        api.spec.definitionLocation = stringifyLocationReference({
          type: 'attachment',
          target: ATTACHMENT_API_DEFINITION,
        });
      } else if (api.spec.definitionLocation) {
        const { type, target } = parseLocationReference(
          api.spec.definitionLocation,
        );

        if (type === 'url') {
          const data = await this.reader.read(target);

          emit(
            result.attachment(ATTACHMENT_API_DEFINITION, { data, contentType }),
          );

          api.spec.definitionLocation = stringifyLocationReference({
            type: 'attachment',
            target: ATTACHMENT_API_DEFINITION,
          });
        } else {
          throw new Error(`Unsupported location type ${type}`);
        }
      }
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

      // TODO: Create an attachment for the photo by downloading the URL.

      // TODO: Property name could be better... like pictureLocation...

      if (user.spec.profile?.picture) {
        // TODO: This should use UrlReader instead, but UrlReader provides no
        // access to the content type of the response.
        const response = await fetch(user.spec.profile?.picture);
        const buffer = await response.arrayBuffer();
        const data = Buffer.from(buffer);
        const contentType =
          response.headers.get('content-type') ?? 'text/plain';
        // TODO: Move to catalog model
        const ATTACHMENT_PROFILE_PICTURE = 'backstage.io/profile-picture';

        emit(
          result.attachment(ATTACHMENT_PROFILE_PICTURE, { data, contentType }),
        );

        user.spec.profile.picture = stringifyLocationReference({
          type: 'attachment',
          target: ATTACHMENT_PROFILE_PICTURE,
        });
      }
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

      // TODO: Create an attachment for the photo by downloading the URL.
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
