/*
 * Copyright 2021 Spotify AB
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
  Entity,
  RELATION_DEPENDS_ON,
  RELATION_PROVIDES_API,
  RELATION_PART_OF,
  stringifyEntityRef,
  ENTITY_DEFAULT_NAMESPACE,
  parseEntityRef,
} from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityRouteRef,
  getEntityRelations,
  useEntity,
} from '@backstage/plugin-catalog-react';
import {
  DependencyGraph,
  DependencyGraphTypes,
  InfoCard,
  Progress,
  useApi,
  ResponseErrorPanel,
  Link,
  useRouteRef,
} from '@backstage/core';
import { Box, makeStyles, Typography } from '@material-ui/core';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
import React from 'react';
import { useAsync } from 'react-use';
import { BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  domainNode: {
    fill: theme.palette.primary.main,
    stroke: theme.palette.border,
  },
  systemNode: {
    fill: 'coral',
    stroke: theme.palette.border,
  },
  componentNode: {
    fill: 'yellowgreen',
    stroke: theme.palette.border,
  },
  apiNode: {
    fill: theme.palette.gold,
    stroke: theme.palette.border,
  },
  resourceNode: {
    fill: 'grey',
    stroke: theme.palette.border,
  },
}));

// Simplifies the diagram output by hiding the default namespace and kind
function readableEntityName(
  ref:
    | Entity
    | {
        kind: string;
        namespace?: string;
        name: string;
      },
): string {
  return stringifyEntityRef(ref)
    .toLocaleLowerCase('en-US')
    .replace(`:${ENTITY_DEFAULT_NAMESPACE}/`, ':')
    .split(':')[1];
}

function RenderNode(props: DependencyGraphTypes.RenderNodeProps<any>) {
  const classes = useStyles();
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const kind = props.node.kind || 'Component';
  const ref = parseEntityRef(props.node.id);
  let nodeClass = classes.componentNode;

  switch (kind) {
    case 'Domain':
      nodeClass = classes.domainNode;
      break;
    case 'System':
      nodeClass = classes.systemNode;
      break;
    case 'Component':
      nodeClass = classes.componentNode;
      break;
    case 'API':
      nodeClass = classes.apiNode;
      break;
    case 'Resource':
      nodeClass = classes.resourceNode;
      break;
    default:
      nodeClass = classes.componentNode;
  }

  return (
    <g>
      <rect width={200} height={100} rx={20} className={nodeClass} />
      <Link
        to={catalogEntityRoute({
          kind: kind,
          namespace: ref.namespace,
          name: ref.name,
        })}
      >
        <text
          x={100}
          y={45}
          textAnchor="middle"
          alignmentBaseline="baseline"
          style={{ fontWeight: 'bold' }}
        >
          {props.node.name}
        </text>
      </Link>

      <text x={100} y={65} textAnchor="middle" alignmentBaseline="hanging">
        {props.node.kind}
      </text>
    </g>
  );
}

/**
 * Dynamically generates a diagram of a system, its assigned entities,
 * and relationships of those entities.
 */
export function SystemDiagramCard() {
  const { entity } = useEntity();
  const currentSystemName = entity.metadata.name;
  const currentSystemNode = stringifyEntityRef(entity);
  const systemNodes = new Array<{ id: string; kind: string; name: string }>();
  const systemEdges = new Array<{ from: string; to: string; label: string }>();

  const catalogApi = useApi(catalogApiRef);
  const { loading, error, value: catalogResponse } = useAsync(() => {
    return catalogApi.getEntities({
      filter: {
        kind: ['Component', 'API', 'Resource', 'System', 'Domain'],
        'spec.system': [
          currentSystemName,
          `${ENTITY_DEFAULT_NAMESPACE}/${currentSystemName}`,
        ],
      },
    });
  }, [catalogApi, currentSystemName]);

  // pick out the system itself
  systemNodes.push({
    id: currentSystemNode,
    kind: 'System',
    name: readableEntityName(entity),
  });

  // check if the system has an assigned domain
  // even if the domain object doesn't exist in the catalog, display it in the map
  const catalogItemDomain = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'Domain',
  });
  catalogItemDomain.forEach(foundDomain =>
    systemNodes.push({
      id: stringifyEntityRef(foundDomain),
      kind: foundDomain.kind,
      name: readableEntityName(foundDomain),
    }),
  );
  catalogItemDomain.forEach(foundDomain =>
    systemEdges.push({
      from: currentSystemNode,
      to: stringifyEntityRef(foundDomain),
      label: 'part of',
    }),
  );

  if (catalogResponse && catalogResponse.items) {
    for (const catalogItem of catalogResponse.items) {
      systemNodes.push({
        id: stringifyEntityRef(catalogItem),
        kind: catalogItem.kind,
        name: readableEntityName(catalogItem),
      });

      // Check relations of the entity assigned to this system to see
      // if it relates to other entities.
      // Note those relations may, or may not, be explicitly
      // assigned to the system.
      const catalogItemRelations_partOf = getEntityRelations(
        catalogItem,
        RELATION_PART_OF,
      );
      catalogItemRelations_partOf.forEach(foundRelation =>
        systemEdges.push({
          from: stringifyEntityRef(catalogItem),
          to: stringifyEntityRef(foundRelation),
          label: 'part of',
        }),
      );

      const catalogItemRelations_providesApi = getEntityRelations(
        catalogItem,
        RELATION_PROVIDES_API,
      );
      catalogItemRelations_providesApi.forEach(foundRelation =>
        systemEdges.push({
          from: stringifyEntityRef(catalogItem),
          to: stringifyEntityRef(foundRelation),
          label: 'provides',
        }),
      );

      const catalogItemRelations_dependsOn = getEntityRelations(
        catalogItem,
        RELATION_DEPENDS_ON,
      );
      catalogItemRelations_dependsOn.forEach(foundRelation =>
        systemEdges.push({
          from: stringifyEntityRef(catalogItem),
          to: stringifyEntityRef(foundRelation),
          label: 'depends on',
        }),
      );
    }
  }

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <InfoCard title="System Diagram">
      <DependencyGraph
        nodes={systemNodes}
        edges={systemEdges}
        nodeMargin={10}
        direction={DependencyGraphTypes.Direction.BOTTOM_TOP}
        renderNode={RenderNode}
      />
      <Box m={1} />
      <Typography
        variant="caption"
        style={{ display: 'block', textAlign: 'right' }}
      >
        <ZoomOutMap style={{ verticalAlign: 'bottom' }} /> Use pinch &amp; zoom
        to move around the diagram.
      </Typography>
    </InfoCard>
  );
}
