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
import { makeStyles, Theme } from '@material-ui/core';
import type { Ring } from '../../utils/types';

export type Props = {
  radius: number;
  rings: Ring[];
};

const useStyles = makeStyles<Theme>(() => ({
  ring: {
    fill: 'none',
    stroke: '#bbb',
    strokeWidth: '1px',
  },
  axis: {
    fill: 'none',
    stroke: '#bbb',
    strokeWidth: '1px',
  },
  text: {
    pointerEvents: 'none',
    userSelect: 'none',
    fill: '#e5e5e5',
    fontSize: '25px',
    fontWeight: 800,
  },
}));

// A component for the background grid of the radar, with axes, rings etc.  It will render around the origin, i.e.
// assume that (0, 0) is in the middle of the drawing.
const RadarGrid = (props: Props) => {
  const { radius, rings } = props;
  const classes = useStyles(props);

  const makeRingNode = (ringIndex: number, ringRadius?: number) => [
    <circle
      key={`c${ringIndex}`}
      cx={0}
      cy={0}
      r={ringRadius}
      className={classes.ring}
    />,
    <text
      key={`t${ringIndex}`}
      y={ringRadius !== undefined ? -ringRadius + 42 : undefined}
      textAnchor="middle"
      className={classes.text}
    >
      {rings[ringIndex].name}
    </text>,
  ];

  const axisNodes = [
    // X axis
    <line
      key="x"
      x1={0}
      y1={-radius}
      x2={0}
      y2={radius}
      className={classes.axis}
      data-testid="radar-grid-x-line"
    />,
    // Y axis
    <line
      key="y"
      x1={-radius}
      y1={0}
      x2={radius}
      y2={0}
      className={classes.axis}
      data-testid="radar-grid-y-line"
    />,
  ];

  const ringNodes = rings
    .map(r => r.outerRadius)
    .map((ringRadius, ringIndex) => makeRingNode(ringIndex, ringRadius));

  return <>{axisNodes.concat(...ringNodes)}</>;
};

export default RadarGrid;
