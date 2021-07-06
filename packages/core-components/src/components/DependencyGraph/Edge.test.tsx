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
import { render } from '@testing-library/react';
import { Edge } from './Edge';
import { RenderLabelProps } from './types';

const fromNode = 'node';
const toNode = 'other-node';

const edge = {
  from: fromNode,
  to: toNode,
};

const id = {
  v: fromNode,
  w: toNode,
};

const setEdge = jest.fn();
const renderElement = jest.fn((props: RenderLabelProps) => (
  <text>{props.edge.label}</text>
));

const minProps = {
  points: [
    { x: 10, y: 20 },
    { x: 20, y: 20 },
  ],
  id,
  setEdge,
  renderElement,
  edge,
};

const label = 'label';
const edgeWithLabel = { ...edge, label };

describe('<Edge />', () => {
  beforeEach(() => {
    // jsdom does not support SVG elements so we have to fall back to HTMLUnknownElement
    Object.defineProperty(window.HTMLUnknownElement.prototype, 'getBBox', {
      value: () => ({ width: 100, height: 100 }),
      configurable: true,
    });
  });

  afterEach(jest.clearAllMocks);

  it('does not render the supplied label element if label is missing', () => {
    const { container } = render(<Edge {...minProps} />);
    expect(container.getElementsByTagName('g')).toHaveLength(0);
  });

  it('renders the supplied label element if label is present', () => {
    const { getByText } = render(<Edge {...minProps} edge={edgeWithLabel} />);
    expect(getByText(label)).toBeInTheDocument();
  });

  it('passes down edge properties to the render method if label is present', () => {
    const edgeWithRandomProp = { ...edge, label, randomProp: true };
    render(
      <Edge {...minProps} render={renderElement} edge={edgeWithRandomProp} />,
    );

    expect(renderElement).toHaveBeenCalledWith({ edge: edgeWithRandomProp });
  });

  it('calls setEdge with edge ID and actual label size after rendering', () => {
    const { getByText } = render(<Edge {...minProps} edge={edgeWithLabel} />);
    expect(getByText(label)).toBeInTheDocument();

    // Updates the edge in the graph
    expect(setEdge).toHaveBeenCalledWith(id, {
      height: 100,
      width: 100,
      ...edgeWithLabel,
    });

    // Does not pass down width/height to label
    expect(renderElement).not.toHaveBeenCalledWith(
      expect.objectContaining({ height: 100, width: 100 }),
    );
  });
});
