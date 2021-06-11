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
import dagre from 'dagre';
import { render } from '@testing-library/react';
import { Node } from './Node';
import { RenderNodeProps } from './types';

const node = { id: 'abc' };
const setNode = jest.fn(() => new dagre.graphlib.Graph());
const renderElement = jest.fn((props: RenderNodeProps) => (
  <text>{props.node.id}</text>
));

const minProps = {
  id: node.id,
  node,
  setNode,
  render: renderElement,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

describe('<Node />', () => {
  beforeEach(() => {
    // jsdom does not support SVG elements so we have to fall back to HTMLUnknownElement
    Object.defineProperty(window.HTMLUnknownElement.prototype, 'getBBox', {
      value: () => ({ width: 100, height: 100 }),
      configurable: true,
    });
  });

  afterEach(jest.clearAllMocks);

  it('renders the supplied element', () => {
    const { getByText } = render(<Node {...minProps} />);
    expect(getByText(minProps.id)).toBeInTheDocument();
  });

  it('passes down node properties to the render method', () => {
    const nodeWithRandomProp = { ...node, randomProp: true };
    render(<Node {...minProps} node={nodeWithRandomProp} />);

    expect(renderElement).toHaveBeenCalledWith({ node: nodeWithRandomProp });
  });

  it('calls setNode with node ID and actual size after rendering', () => {
    const { getByText } = render(<Node {...minProps} />);
    expect(getByText(minProps.id)).toBeInTheDocument();

    // Updates the node in the graph
    expect(setNode).toHaveBeenCalledWith(node.id, {
      height: 100,
      width: 100,
      ...node,
    });

    // Does not pass down width/height to node
    expect(renderElement).not.toHaveBeenCalledWith(
      expect.objectContaining({ height: 100, width: 100 }),
    );
  });
});
