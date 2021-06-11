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

import React from 'react';
import { DependencyGraph } from './DependencyGraph';
import { Direction, LabelPosition } from './types';

export default {
  title: 'Data Display/DependencyGraph',
  component: DependencyGraph,
};

const containerStyle = { width: '100%' };
const graphStyle = { border: '1px solid grey' };

const exampleNodes = [
  { id: 'source' },
  { id: 'downstream' },
  { id: 'second-downstream' },
  { id: 'third-downstream' },
];

const exampleEdges = [
  { from: 'source', to: 'downstream' },
  { from: 'downstream', to: 'second-downstream' },
  { from: 'downstream', to: 'third-downstream' },
];

export const Default = () => (
  <div style={containerStyle}>
    <DependencyGraph
      nodes={exampleNodes}
      edges={exampleEdges}
      style={graphStyle}
      paddingX={50}
      paddingY={50}
    />
  </div>
);

export const BottomToTop = () => (
  <div style={containerStyle}>
    <DependencyGraph
      nodes={exampleNodes}
      edges={exampleEdges}
      direction={Direction.BOTTOM_TOP}
      style={graphStyle}
      paddingX={50}
      paddingY={50}
    />
  </div>
);

export const LeftToRight = () => (
  <div style={containerStyle}>
    <DependencyGraph
      nodes={exampleNodes}
      edges={exampleEdges}
      direction={Direction.LEFT_RIGHT}
      style={graphStyle}
      paddingX={50}
      paddingY={50}
    />
  </div>
);

export const RightToLeft = () => (
  <div style={containerStyle}>
    <DependencyGraph
      nodes={exampleNodes}
      edges={exampleEdges}
      direction={Direction.RIGHT_LEFT}
      style={graphStyle}
      paddingX={50}
      paddingY={50}
    />
  </div>
);

export const WithLabels = () => {
  const edges = exampleEdges.map(edge => ({ ...edge, label: 'label' }));
  return (
    <div style={containerStyle}>
      <DependencyGraph
        nodes={exampleNodes}
        edges={edges}
        direction={Direction.LEFT_RIGHT}
        style={graphStyle}
        paddingX={50}
        paddingY={50}
      />
    </div>
  );
};

export const CustomNodes = () => {
  const colors = ['pink', 'coral', 'yellowgreen', 'aquamarine'];
  const nodes = exampleNodes.map((node, index) => ({
    ...node,
    description: 'Description text',
    color: colors[index],
  }));
  return (
    <div style={containerStyle}>
      <DependencyGraph
        nodes={nodes}
        edges={exampleEdges}
        style={graphStyle}
        paddingX={50}
        paddingY={50}
        renderNode={props => (
          <g>
            <rect width={200} height={100} rx={20} fill={props.node.color} />
            <text
              x={100}
              y={45}
              textAnchor="middle"
              alignmentBaseline="baseline"
              style={{ fontWeight: 'bold' }}
            >
              {props.node.id}
            </text>
            <text
              x={100}
              y={55}
              textAnchor="middle"
              alignmentBaseline="hanging"
            >
              {props.node.description}
            </text>
          </g>
        )}
      />
    </div>
  );
};

export const CustomLabels = () => {
  const colors = ['pink', 'coral', 'aqua'];
  const edges = exampleEdges.map((edge, index) => ({
    ...edge,
    label: colors[index],
    color: colors[index],
  }));
  return (
    <div style={containerStyle}>
      <DependencyGraph
        nodes={exampleNodes}
        edges={edges}
        labelPosition={LabelPosition.CENTER}
        style={graphStyle}
        paddingX={50}
        paddingY={50}
        renderLabel={props => (
          <g>
            <circle r={25} fill={props.edge.color} />
            <text x={0} y={0} textAnchor="middle" alignmentBaseline="middle">
              {props.edge.label}
            </text>
          </g>
        )}
      />
    </div>
  );
};
