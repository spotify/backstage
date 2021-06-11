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
import { act, fireEvent } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { FeatureCalloutCircular } from './FeatureCalloutCircular';

const INITIAL_BOUNDING_RECT: DOMRect = {
  width: 100,
  height: 100,
  x: 0,
  y: 0,
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  toJSON: () => {},
};

const UPDATED_BOUNDING_RECT: DOMRect = {
  width: 200,
  height: 200,
  x: 50,
  y: 50,
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  toJSON: () => {},
};

beforeEach(() => {
  Element.prototype.getBoundingClientRect = jest.fn(
    () => INITIAL_BOUNDING_RECT,
  );
});

describe('<FeatureCalloutCircular />', () => {
  it('renders without exploding', async () => {
    const rendered = await renderInTestApp(
      <FeatureCalloutCircular
        featureId="feature-id"
        title="title"
        description="description"
      />,
    );
    rendered.getByText('description');
    rendered.getByText('title');
  });

  it('renders with correct style', async () => {
    const { getByTestId } = await renderInTestApp(
      <FeatureCalloutCircular
        featureId="feature-id"
        title="title"
        description="description"
      />,
    );
    const dot = await getByTestId('dot');
    const text = await getByTestId('text');

    expect(dot).toBeInTheDocument();
    expect(text).toBeInTheDocument();

    // Dot style
    expect(dot.style.left).toBe('-800px');
    expect(dot.style.top).toBe('-800px');
    expect(dot.style.width).toBe('1700px');
    expect(dot.style.height).toBe('1700px');

    // Text style
    expect(text.style.left).toBe('-400px');
    expect(text.style.top).toBe('120px');
    expect(text.style.width).toBe('450px');
  });

  it('update when the user scrolls', async () => {
    const { getByTestId } = await renderInTestApp(
      <FeatureCalloutCircular
        featureId="feature-id"
        title="title"
        description="description"
      />,
    );
    const dot = await getByTestId('dot');
    const text = await getByTestId('text');

    act(() => {
      Element.prototype.getBoundingClientRect = jest.fn(
        () => UPDATED_BOUNDING_RECT,
      );

      // Trigger the window resize event.
      fireEvent(window, new Event('resize'));
    });

    // Dot style
    expect(dot.style.left).toBe('-750px');
    expect(dot.style.top).toBe('-750px');
    expect(dot.style.width).toBe('1800px');
    expect(dot.style.height).toBe('1800px');

    // Text style
    expect(text.style.left).toBe('-300px');
    expect(text.style.top).toBe('270px');
    expect(text.style.width).toBe('450px');
  });

  it('update when the user resizes the window', async () => {
    const { getByTestId } = await renderInTestApp(
      <FeatureCalloutCircular
        featureId="feature-id"
        title="title"
        description="description"
      />,
    );
    const dot = await getByTestId('dot');
    const text = await getByTestId('text');

    act(() => {
      Element.prototype.getBoundingClientRect = jest.fn(
        () => UPDATED_BOUNDING_RECT,
      );

      // Trigger the window scroll event.
      fireEvent(window, new Event('scroll'));
    });

    // Dot style
    expect(dot.style.left).toBe('-750px');
    expect(dot.style.top).toBe('-750px');
    expect(dot.style.width).toBe('1800px');
    expect(dot.style.height).toBe('1800px');

    // Text style
    expect(text.style.left).toBe('-300px');
    expect(text.style.top).toBe('270px');
    expect(text.style.width).toBe('450px');
  });
});
