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
import { renderInTestApp } from '@backstage/test-utils';
import { HeaderLabel } from './HeaderLabel';

describe('<HeaderLabel />', () => {
  it('should have a label', async () => {
    const rendered = await renderInTestApp(<HeaderLabel label="Label" />);
    expect(rendered.getByText('Label')).toBeInTheDocument();
  });

  it('should say unknown', async () => {
    const rendered = await renderInTestApp(<HeaderLabel label="Label" />);
    expect(rendered.getByText('<Unknown>')).toBeInTheDocument();
  });

  it('should say unknown when passing null as value prop', async () => {
    const rendered = await renderInTestApp(
      <HeaderLabel label="Label" value={null} />,
    );
    expect(rendered.getByText('<Unknown>')).toBeInTheDocument();
  });

  it('should have value', async () => {
    const rendered = await renderInTestApp(
      <HeaderLabel label="Label" value="Value" />,
    );
    expect(rendered.getByText('Value')).toBeInTheDocument();
  });

  it('should have a link', async () => {
    const rendered = await renderInTestApp(
      <HeaderLabel label="Label" value="Value" url="/test" />,
    );
    const anchor = rendered.container.querySelector('a') as HTMLAnchorElement;
    expect(rendered.getByText('Value')).toBeInTheDocument();
    expect(anchor.href).toBe('http://localhost/test');
  });
});
