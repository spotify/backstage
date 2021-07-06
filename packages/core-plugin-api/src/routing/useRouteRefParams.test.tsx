/*
 * Copyright 2021 The Backstage Authors
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

import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useRouteRefParams } from './useRouteRefParams';
import { createRouteRef } from './RouteRef';

describe('useRouteRefParams', () => {
  it('should provide types params', () => {
    const routeRef = createRouteRef({
      id: 'ref1',
      params: ['a', 'b'],
    });

    const Page = () => {
      const params: { a: string; b: string } = useRouteRefParams(routeRef);

      return (
        <div>
          <span>{params.a}</span>
          <span>{params.b}</span>
        </div>
      );
    };

    const { getByText } = render(
      <MemoryRouter initialEntries={['/foo/bar']}>
        <Routes>
          <Route path="/:a/:b">
            <Page />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(getByText('foo')).toBeInTheDocument();
    expect(getByText('bar')).toBeInTheDocument();
  });
});
