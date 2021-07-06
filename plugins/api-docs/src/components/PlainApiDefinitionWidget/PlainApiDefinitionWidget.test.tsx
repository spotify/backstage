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

import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { PlainApiDefinitionWidget } from './PlainApiDefinitionWidget';

describe('<PlainApiDefinitionWidget />', () => {
  it('renders plain text', async () => {
    const { getByText } = await renderInTestApp(
      <PlainApiDefinitionWidget definition="Hello World" language="yaml" />,
    );
    expect(getByText(/Hello World/i)).toBeInTheDocument();
  });
});
