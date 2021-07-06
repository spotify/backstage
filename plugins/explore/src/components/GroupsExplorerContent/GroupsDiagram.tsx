/*
 * Copyright 2021 The Backstage Authors
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
  RELATION_CHILD_OF,
  stringifyEntityRef,
  parseEntityRef,
  GroupEntity,
} from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityRouteRef,
  getEntityRelations,
  formatEntityRefTitle,
} from '@backstage/plugin-catalog-react';
import { makeStyles, Typography } from '@material-ui/core';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
import React from 'react';
import { useAsync } from 'react-use';
import { BackstageTheme } from '@backstage/theme';

import {
  DependencyGraph,
  DependencyGraphTypes,
  Progress,
  ResponseErrorPanel,
  Link,
} from '@backstage/core-components';
import { useApi, useRouteRef, configApiRef } from '@backstage/core-plugin-api';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  organizationNode: {
    fill: 'coral',
    stroke: theme.palette.border,
  },
  groupNode: {
    fill: 'yellowgreen',
    stroke: theme.palette.border,
  },
}));

function RenderNode(props: DependencyGraphTypes.RenderNodeProps<any>) {
  const classes = useStyles();
  const catalogEntityRoute = useRouteRef(entityRouteRef);

  if (props.node.id === 'root') {
    return (
      <g>
        <rect
          width={180}
          height={80}
          rx={20}
          className={classes.organizationNode}
        />
        <text
          x={90}
          y={45}
          textAnchor="middle"
          alignmentBaseline="baseline"
          style={{ fontWeight: 'bold' }}
        >
          {props.node.name}
        </text>
      </g>
    );
  }

  const ref = parseEntityRef(props.node.id);

  return (
    <g>
      <rect width={180} height={80} rx={20} className={classes.groupNode} />
      <Link
        to={catalogEntityRoute({
          kind: ref.kind,
          namespace: ref.namespace,
          name: ref.name,
        })}
      >
        <text
          x={90}
          y={45}
          textAnchor="middle"
          alignmentBaseline="baseline"
          style={{ fontWeight: 'bold' }}
        >
          {props.node.name}
        </text>
      </Link>
    </g>
  );
}

/**
 * Dynamically generates a diagram of groups registered in the catalog.
 */
export function GroupsDiagram() {
  const nodes = new Array<{
    id: string;
    kind: string;
    name: string;
  }>();
  const edges = new Array<{ from: string; to: string; label: string }>();

  const configApi = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);
  const organizationName =
    configApi.getOptionalString('organization.name') ?? 'Backstage';
  const { loading, error, value: catalogResponse } = useAsync(() => {
    return catalogApi.getEntities({
      filter: {
        kind: ['Group'],
      },
    });
  }, [catalogApi]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  // the root of this diagram is the organization
  nodes.push({
    id: 'root',
    kind: 'Organization',
    name: organizationName,
  });

  for (const catalogItem of catalogResponse?.items || []) {
    const currentItemId = stringifyEntityRef(catalogItem);

    nodes.push({
      id: stringifyEntityRef(catalogItem),
      kind: catalogItem.kind,
      name:
        (catalogItem as GroupEntity).spec?.profile?.displayName ||
        formatEntityRefTitle(catalogItem, { defaultKind: 'Group' }),
    });

    // Edge to parent
    const catalogItemRelations_childOf = getEntityRelations(
      catalogItem,
      RELATION_CHILD_OF,
    );

    // if no parent is found, link the node to the root
    if (catalogItemRelations_childOf.length === 0) {
      edges.push({
        from: currentItemId,
        to: 'root',
        label: '',
      });
    }

    catalogItemRelations_childOf.forEach(relation => {
      edges.push({
        from: currentItemId,
        to: stringifyEntityRef(relation),
        label: '',
      });
    });
  }

  return (
    <>
      <DependencyGraph
        nodes={nodes}
        edges={edges}
        nodeMargin={10}
        direction={DependencyGraphTypes.Direction.RIGHT_LEFT}
        renderNode={RenderNode}
      />
      <Typography
        variant="caption"
        style={{ display: 'block', textAlign: 'right' }}
      >
        <ZoomOutMap style={{ verticalAlign: 'bottom' }} /> Use pinch &amp; zoom
        to move around the diagram.
      </Typography>
    </>
  );
}
