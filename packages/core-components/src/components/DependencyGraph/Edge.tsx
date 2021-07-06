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

import React from 'react';
import * as d3Shape from 'd3-shape';
import isFinite from 'lodash/isFinite';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { BackstageTheme } from '@backstage/theme';
import {
  GraphEdge,
  RenderLabelProps,
  RenderLabelFunction,
  DependencyEdge,
} from './types';
import { ARROW_MARKER_ID, EDGE_TEST_ID, LABEL_TEST_ID } from './constants';
import { DefaultLabel } from './DefaultLabel';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  path: {
    strokeWidth: 2,
    stroke: theme.palette.textSubtle,
    fill: 'none',
    transition: `${theme.transitions.duration.shortest}ms`,
  },
  label: {
    transition: `${theme.transitions.duration.shortest}ms`,
  },
}));

type EdgePoint = dagre.GraphEdge['points'][0];

export type EdgeComponentProps<T = any> = {
  id: dagre.Edge;
  edge: GraphEdge<T>;
  render?: RenderLabelFunction;
  setEdge: (id: dagre.Edge, edge: DependencyEdge) => dagre.graphlib.Graph<{}>;
};

const renderDefault = (props: RenderLabelProps) => <DefaultLabel {...props} />;

const createPath = d3Shape
  .line<EdgePoint>()
  .x(d => d.x)
  .y(d => d.y)
  .curve(d3Shape.curveMonotoneX);

export function Edge({
  render = renderDefault,
  setEdge,
  id,
  edge,
}: EdgeComponentProps) {
  const { x = 0, y = 0, width, height, points, ...labelProps } = edge;
  const classes = useStyles();

  const labelRef = React.useRef<SVGGElement>(null);

  React.useLayoutEffect(() => {
    // set the label width to the actual rendered width to properly layout graph
    if (labelRef.current) {
      let {
        height: renderedHeight,
        width: renderedWidth,
      } = labelRef.current.getBBox();
      renderedHeight = Math.round(renderedHeight);
      renderedWidth = Math.round(renderedWidth);

      if (renderedHeight !== height || renderedWidth !== width) {
        setEdge(id, {
          ...edge,
          height: renderedHeight,
          width: renderedWidth,
        });
      }
    }
  }, [edge, height, width, setEdge, id]);

  let path: string = '';

  if (points) {
    const finitePoints = points.filter(
      (point: EdgePoint) => isFinite(point.x) && isFinite(point.y),
    );
    path = createPath(finitePoints) || '';
  }

  return (
    <>
      {path && (
        <path
          data-testid={EDGE_TEST_ID}
          className={classes.path}
          markerEnd={`url(#${ARROW_MARKER_ID})`}
          d={path}
        />
      )}
      {labelProps.label ? (
        <g
          ref={labelRef}
          data-testid={LABEL_TEST_ID}
          className={classes.label}
          transform={`translate(${x},${y})`}
        >
          {render({ edge: labelProps })}
        </g>
      ) : null}
    </>
  );
}
