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
import { render } from '@testing-library/react';
import { DependencyGraph } from './DependencyGraph';
import { RenderLabelProps, RenderNodeProps } from './types';
import { EDGE_TEST_ID, LABEL_TEST_ID, NODE_TEST_ID } from './constants';

describe('<DependencyGraph />', () => {
  beforeAll(() => {
    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
      value: () => ({ width: 100, height: 100 }),
      configurable: true,
    });
  });

  const nodes = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const edges = [
    { from: nodes[0].id, to: nodes[1].id },
    { from: nodes[1].id, to: nodes[2].id },
  ];

  const CUSTOM_TEST_ID = 'custom-test-id';

  it('renders each node and edge supplied', async () => {
    const { getByText, queryAllByTestId, findAllByTestId } = render(
      <DependencyGraph nodes={nodes} edges={edges} />,
    );
    const renderedNodes = await findAllByTestId(NODE_TEST_ID);
    expect(renderedNodes).toHaveLength(3);
    expect(getByText(nodes[0].id)).toBeInTheDocument();
    expect(getByText(nodes[1].id)).toBeInTheDocument();
    expect(getByText(nodes[2].id)).toBeInTheDocument();
    expect(queryAllByTestId(EDGE_TEST_ID)).toHaveLength(2);
    expect(queryAllByTestId(LABEL_TEST_ID)).toHaveLength(0);
  });

  it('renders edge labels if present', async () => {
    const labeledEdges = [
      { ...edges[0], label: 'first' },
      { ...edges[1], label: 'second' },
    ];
    const { getByText, getAllByTestId, findAllByTestId } = render(
      <DependencyGraph nodes={nodes} edges={labeledEdges} />,
    );
    const renderedEdges = await findAllByTestId(EDGE_TEST_ID);
    expect(renderedEdges).toHaveLength(2);
    expect(getAllByTestId(LABEL_TEST_ID)).toHaveLength(2);
    expect(getByText(labeledEdges[0].label)).toBeInTheDocument();
    expect(getByText(labeledEdges[1].label)).toBeInTheDocument();
  });

  it('renders nodes according to renderNode prop', async () => {
    const singleNode = [nodes[0]];

    const renderNode = (props: RenderNodeProps) => (
      <g>
        <text>{props.node.id}</text>
        <circle data-testid={CUSTOM_TEST_ID} r={100} />
      </g>
    );
    const { getByText, findByTestId, container } = render(
      <DependencyGraph nodes={singleNode} edges={[]} renderNode={renderNode} />,
    );
    const node = await findByTestId(CUSTOM_TEST_ID);
    expect(node).toBeInTheDocument();
    expect(container.querySelector('circle')).toBeInTheDocument();
    expect(getByText(singleNode[0].id)).toBeInTheDocument();
  });

  it('renders labels according to renderLabel prop', async () => {
    const labeledEdge = [{ ...edges[0], label: 'label' }];

    const renderLabel = (props: RenderLabelProps) => (
      <g>
        <text>{props.edge.label}</text>
        <circle data-testid={CUSTOM_TEST_ID} r={100} />
      </g>
    );
    const { getByText, findByTestId, container } = render(
      <DependencyGraph
        nodes={nodes}
        edges={labeledEdge}
        renderLabel={renderLabel}
      />,
    );
    const node = await findByTestId(CUSTOM_TEST_ID);
    expect(node).toBeInTheDocument();
    expect(container.querySelector('circle')).toBeInTheDocument();
    expect(getByText(labeledEdge[0].label)).toBeInTheDocument();
  });
});
