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

import { EntityName, EntityRef } from '../types';
import { ENTITY_DEFAULT_NAMESPACE } from './constants';
import { Entity } from './Entity';

function parseRefString(
  ref: string,
): {
  kind?: string;
  namespace?: string;
  name: string;
} {
  const match = /^([^:/]+:)?([^:/]+\/)?([^:/]+)$/.exec(ref.trim());
  if (!match) {
    throw new TypeError(
      `Entity reference "${ref}" was not on the form [<kind>:][<namespace>/]<name>`,
    );
  }

  return {
    kind: match[1]?.slice(0, -1),
    namespace: match[2]?.slice(0, -1),
    name: match[3],
  };
}

/**
 * Extracts the kind, namespace and name that form the name triplet of the
 * given entity.
 *
 * @param entity An entity
 * @returns The complete entity name
 */
export function getEntityName(entity: Entity): EntityName {
  return {
    kind: entity.kind,
    namespace: entity.metadata.namespace || ENTITY_DEFAULT_NAMESPACE,
    name: entity.metadata.name,
  };
}

/**
 * The context of defaults that entity reference parsing happens within.
 */
type EntityRefContext = {
  /** The default kind, if none is given in the reference */
  defaultKind?: string;
  /** The default namespace, if none is given in the reference */
  defaultNamespace?: string;
};

/**
 * Parses an entity reference, either on string or compound form, and always
 * returns a complete entity name including kind, namespace and name.
 *
 * This function automatically assumes the default namespace "default" unless
 * otherwise specified as part of the options, and will throw an error if no
 * kind was specified in the input reference and no default kind was given.
 *
 * @param ref The reference to parse
 * @param context The context of defaults that the parsing happens within
 * @returns A complete entity name
 */
export function parseEntityName(
  ref: EntityRef,
  context: EntityRefContext = {},
): EntityName {
  const { kind, namespace, name } = parseEntityRef(ref, {
    defaultNamespace: ENTITY_DEFAULT_NAMESPACE,
    ...context,
  });

  if (!kind) {
    throw new Error(
      `Entity reference ${namespace}/${name} did not contain a kind`,
    );
  }

  return { kind, namespace, name };
}

/**
 * Parses an entity reference, either on string or compound form, and returns
 * a structure with a name, and optional kind and namespace.
 *
 * The options object can contain default values for the kind and namespace,
 * that will be used if the input reference did not specify any.
 *
 * @param ref The reference to parse
 * @param context The context of defaults that the parsing happens within
 * @returns The compound form of the reference
 */
export function parseEntityRef(
  ref: EntityRef,
  context?: { defaultKind: string; defaultNamespace: string },
): {
  kind: string;
  namespace: string;
  name: string;
};
export function parseEntityRef(
  ref: EntityRef,
  context?: { defaultKind: string },
): {
  kind: string;
  namespace?: string;
  name: string;
};
export function parseEntityRef(
  ref: EntityRef,
  context?: { defaultNamespace: string },
): {
  kind?: string;
  namespace: string;
  name: string;
};
export function parseEntityRef(
  ref: EntityRef,
  context: EntityRefContext = {},
): {
  kind?: string;
  namespace?: string;
  name: string;
} {
  if (!ref) {
    throw new Error(`Entity reference must not be empty`);
  }

  if (typeof ref === 'string') {
    const parsed = parseRefString(ref);
    return {
      kind: parsed.kind ?? context.defaultKind,
      namespace: parsed.namespace ?? context.defaultNamespace,
      name: parsed.name,
    };
  }

  const { kind, namespace, name } = ref;
  if (kind === '') {
    throw new Error('Entity reference kinds must not be empty');
  } else if (namespace === '') {
    throw new Error('Entity reference namespaces must not be empty');
  } else if (!name) {
    throw new Error('Entity references must contain a name');
  }

  return {
    kind: kind ?? context.defaultKind,
    namespace: namespace ?? context.defaultNamespace,
    name,
  };
}

/**
 * Takes an entity reference or name, and outputs an entity reference on the
 * most compact form possible. I.e. if the parts do not contain any
 * special/reserved characters, it outputs the string form, otherwise it
 * outputs the compound form.
 *
 * @deprecated Use `stringifyEntityRef` instead
 * @param ref The reference to serialize
 * @returns The same reference on either string or compound form
 */
export function serializeEntityRef(
  ref:
    | Entity
    | {
        kind?: string;
        namespace?: string;
        name: string;
      },
): EntityRef {
  let kind;
  let namespace;
  let name;

  if ('metadata' in ref) {
    kind = ref.kind;
    namespace = ref.metadata.namespace;
    name = ref.metadata.name;
  } else {
    kind = ref.kind;
    namespace = ref.namespace;
    name = ref.name;
  }

  if (
    kind?.includes(':') ||
    kind?.includes('/') ||
    namespace?.includes(':') ||
    namespace?.includes('/') ||
    name.includes(':') ||
    name.includes('/')
  ) {
    return { kind, namespace, name };
  }

  return `${kind ? `${kind}:` : ''}${namespace ? `${namespace}/` : ''}${name}`;
}

/**
 * Takes an entity or entity name/reference, and returns the string form of an
 * entity ref.
 *
 * This function creates a canonical and unique reference to the entity, converting
 * all parts of the name to lowercase and inserts the default namespace if needed.
 * It is typically not the best way to represent the entity reference to the user.
 *
 * @param ref The reference to serialize
 * @returns The same reference on either string or compound form
 */
export function stringifyEntityRef(
  ref: Entity | { kind: string; namespace?: string; name: string },
): string {
  let kind;
  let namespace;
  let name;

  if ('metadata' in ref) {
    kind = ref.kind;
    namespace = ref.metadata.namespace ?? ENTITY_DEFAULT_NAMESPACE;
    name = ref.metadata.name;
  } else {
    kind = ref.kind;
    namespace = ref.namespace ?? ENTITY_DEFAULT_NAMESPACE;
    name = ref.name;
  }

  return `${kind.toLowerCase()}:${namespace.toLowerCase()}/${name.toLowerCase()}`;
}

/**
 * Compares an entity to either a string reference or a compound reference.
 *
 * The comparison is case insensitive, and all of kind, namespace, and name
 * must match (after applying the optional context to the ref).
 *
 * @param entity The entity to match
 * @param ref A string or compound entity ref
 * @param context An optional context of default kind and namespace, that apply
 *                to the ref if given
 * @returns True if matching, false otherwise
 */
export function compareEntityToRef(
  entity: Entity,
  ref: EntityRef | EntityName,
  context?: EntityRefContext,
): boolean {
  const entityKind = entity.kind;
  const entityNamespace = entity.metadata.namespace || ENTITY_DEFAULT_NAMESPACE;
  const entityName = entity.metadata.name;

  let refKind: string | undefined;
  let refNamespace: string | undefined;
  let refName: string;
  if (typeof ref === 'string') {
    const parsed = parseRefString(ref);
    refKind = parsed.kind || context?.defaultKind;
    refNamespace =
      parsed.namespace || context?.defaultNamespace || ENTITY_DEFAULT_NAMESPACE;
    refName = parsed.name;
  } else {
    refKind = ref.kind || context?.defaultKind;
    refNamespace =
      ref.namespace || context?.defaultNamespace || ENTITY_DEFAULT_NAMESPACE;
    refName = ref.name;
  }

  if (!refKind || !refNamespace) {
    throw new Error(
      `Entity reference or context did not contain kind and namespace`,
    );
  }

  return (
    entityKind.toLowerCase() === refKind.toLowerCase() &&
    entityNamespace.toLowerCase() === refNamespace.toLowerCase() &&
    entityName.toLowerCase() === refName.toLowerCase()
  );
}
