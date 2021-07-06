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

import dagre from 'dagre';

type CustomType = { [customKey: string]: any };

/* Edges */
export type DependencyEdge<T = CustomType> = T & {
  from: string;
  to: string;
  label?: string;
};

export type GraphEdge<T = CustomType> = DependencyEdge<T> &
  dagre.GraphEdge &
  EdgeProperties;

export type RenderLabelProps<T = CustomType> = { edge: DependencyEdge<T> };

export type RenderLabelFunction = (
  props: RenderLabelProps<any>,
) => React.ReactNode;

/* Nodes */
export type DependencyNode<T = CustomType> = T & {
  id: string;
};

export type GraphNode<T = CustomType> = dagre.Node<DependencyNode<T>>;

export type RenderNodeProps<T = CustomType> = { node: DependencyNode<T> };

export type RenderNodeFunction = (
  props: RenderNodeProps<any>,
) => React.ReactNode;

/* Based on: https://github.com/dagrejs/dagre/wiki#configuring-the-layout  */

export type EdgeProperties = {
  label?: string;
  width?: number;
  height?: number;
  labeloffset?: number;
  labelpos?: LabelPosition;
  minlen?: number;
  weight?: number;
  [customKey: string]: any;
};

export enum Direction {
  TOP_BOTTOM = 'TB',
  BOTTOM_TOP = 'BT',
  LEFT_RIGHT = 'LR',
  RIGHT_LEFT = 'RL',
}

export enum Alignment {
  UP_LEFT = 'UL',
  UP_RIGHT = 'UR',
  DOWN_LEFT = 'DL',
  DOWN_RIGHT = 'DR',
}

export enum Ranker {
  NETWORK_SIMPLEX = 'network-simplex',
  TIGHT_TREE = 'tight-tree',
  LONGEST_PATH = 'longest-path',
}

export enum LabelPosition {
  LEFT = 'l',
  RIGHT = 'r',
  CENTER = 'c',
}
