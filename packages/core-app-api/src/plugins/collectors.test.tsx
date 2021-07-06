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

import React, { PropsWithChildren } from 'react';
import {
  createPlugin,
  createRouteRef,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import {
  traverseElementTree,
  childDiscoverer,
  routeElementDiscoverer,
} from '../extensions/traversal';
import { pluginCollector } from './collectors';

const mockConfig = () => ({ id: 'foo' });
const MockComponent = ({ children }: PropsWithChildren<{ path?: string }>) => (
  <>{children}</>
);

const pluginA = createPlugin({ id: 'my-plugin-a' });
const pluginB = createPlugin({ id: 'my-plugin-b' });
const pluginC = createPlugin({ id: 'my-plugin-c' });

const ref1 = createRouteRef(mockConfig());
const ref2 = createRouteRef(mockConfig());

const Extension1 = pluginA.provide(
  createRoutableExtension({
    component: () => Promise.resolve(MockComponent),
    mountPoint: ref1,
  }),
);
const Extension2 = pluginB.provide(
  createRoutableExtension({
    component: () => Promise.resolve(MockComponent),
    mountPoint: ref2,
  }),
);
const Extension3 = pluginA.provide(
  createComponentExtension({ component: { sync: MockComponent } }),
);
const Extension4 = pluginB.provide(
  createComponentExtension({ component: { sync: MockComponent } }),
);
const Extension5 = pluginC.provide(
  createComponentExtension({ component: { sync: MockComponent } }),
);

describe('collection', () => {
  it('should collect the plugins', () => {
    const root = (
      <MemoryRouter>
        <Routes>
          <Extension1 path="/foo">
            <div>
              <Extension2 path="/bar/:id">
                <div>
                  <div />
                  {[<Extension4 key={0} />]}
                  Some text here shouldn't be a problem
                  <div />
                  {null}
                  <div />
                  <Extension3 />
                </div>
              </Extension2>
              {false}
              {true}
              {0}
            </div>
          </Extension1>
          <div>
            <Route path="/divsoup" element={<Extension5 />} />
          </div>
        </Routes>
      </MemoryRouter>
    );

    const { plugins } = traverseElementTree({
      root,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        plugins: pluginCollector,
      },
    });

    expect(plugins).toEqual(new Set([pluginA, pluginB, pluginC]));
  });
});
