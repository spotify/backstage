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

import React, { Children, isValidElement } from 'react';
import {
  childDiscoverer,
  createCollector,
  traverseElementTree,
} from './traversal';

describe('discovery', () => {
  it('should collect element names', () => {
    const root = (
      <main>
        <div>
          <h1>Title</h1>
          <p>Text</p>
        </div>
        <hr />
        <div>
          <h2>Title</h2>
          <span>Text</span>
        </div>
      </main>
    );

    const { names } = traverseElementTree({
      root,
      discoverers: [childDiscoverer],
      collectors: {
        names: createCollector(
          () => Array<string>(),
          (acc, el) => {
            if (typeof el.type === 'string') {
              acc.push(el.type);
            }
          },
        ),
      },
    });

    expect(names).toEqual([
      'main',
      'div',
      'hr',
      'div',
      'h1',
      'p',
      'h2',
      'span',
    ]);
  });

  it('should collect element names while skipping one level of children', () => {
    const root = (
      <main>
        <div>
          <h1>Title</h1>
          <p>Text</p>
        </div>
        <hr />
        <div>
          <h2>Title</h2>
          <span>Text</span>
        </div>
      </main>
    );

    const { names } = traverseElementTree({
      root,
      discoverers: [
        el =>
          Children.toArray(el.props.children).flatMap(child =>
            isValidElement(child) ? child?.props?.children : [],
          ),
      ],
      collectors: {
        names: createCollector(
          () => Array<string>(),
          (acc, el) => {
            if (typeof el.type === 'string') {
              acc.push(el.type);
            }
          },
        ),
      },
    });

    expect(names).toEqual(['main', 'h1', 'p', 'h2', 'span']);
  });
});
