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
import { Entity, EntityRelation } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { chunk, groupBy } from 'lodash';
import { useAsync } from 'react-use';
import { catalogApiRef } from '../api';

const BATCH_SIZE = 20;

export function useRelatedEntities(
  entity: Entity,
  { type, kind }: { type?: string; kind?: string },
): {
  entities: Entity[] | undefined;
  loading: boolean;
  error: Error | undefined;
} {
  const catalogApi = useApi(catalogApiRef);
  const { loading, value: entities, error } = useAsync(async () => {
    const relations =
      entity.relations &&
      entity.relations.filter(
        r =>
          (!type || r.type.toLowerCase() === type.toLowerCase()) &&
          (!kind || r.target.kind.toLowerCase() === kind.toLowerCase()),
      );

    if (!relations) {
      return [];
    }

    // Group the relations by kind and namespace to reduce the size of the request query string.
    // Without this grouping, the kind and namespace would need to be specified for each relation, e.g.
    // `filter=kind=component,namespace=default,name=example1&filter=kind=component,namespace=default,name=example2`
    // with grouping, we can generate a query a string like
    // `filter=kind=component,namespace=default,name=example1,example2`
    const relationsByKindAndNamespace: EntityRelation[][] = Object.values(
      groupBy(relations, ({ target }) => {
        return `${target.kind}:${target.namespace}`.toLowerCase();
      }),
    );

    // Split the names within each group into batches to further reduce the query string length.
    const batchedRelationsByKindAndNamespace: {
      kind: string;
      namespace: string;
      nameBatches: string[][];
    }[] = [];
    for (const rs of relationsByKindAndNamespace) {
      batchedRelationsByKindAndNamespace.push({
        // All relations in a group have the same kind and namespace, so its arbitrary which we pick
        kind: rs[0].target.kind,
        namespace: rs[0].target.namespace,
        nameBatches: chunk(
          rs.map(r => r.target.name),
          BATCH_SIZE,
        ),
      });
    }

    const results = await Promise.all(
      batchedRelationsByKindAndNamespace.flatMap(rs => {
        return rs.nameBatches.map(names => {
          return catalogApi.getEntities({
            filter: {
              kind: rs.kind,
              'metadata.namespace': rs.namespace,
              'metadata.name': names,
            },
          });
        });
      }),
    );

    return results.flatMap(r => r.items);
  }, [entity, type]);

  return {
    entities,
    loading,
    error,
  };
}
