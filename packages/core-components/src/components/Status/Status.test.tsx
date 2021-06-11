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
import { renderInTestApp } from '@backstage/test-utils';

import {
  StatusOK,
  StatusWarning,
  StatusError,
  StatusPending,
  StatusRunning,
  StatusAborted,
} from './Status';

describe('<StatusOK />', () => {
  it('renders without exploding', async () => {
    const { getByLabelText } = await renderInTestApp(<StatusOK />);
    expect(getByLabelText('Status ok')).toBeInTheDocument();
  });
});

describe('<StatusWarning />', () => {
  it('renders without exploding', async () => {
    const { getByLabelText } = await renderInTestApp(<StatusWarning />);
    expect(getByLabelText('Status warning')).toBeInTheDocument();
  });
});

describe('<StatusError />', () => {
  it('renders without exploding', async () => {
    const { getByLabelText } = await renderInTestApp(<StatusError />);
    expect(getByLabelText('Status error')).toBeInTheDocument();
  });
});

describe('<StatusPending />', () => {
  it('renders without exploding', async () => {
    const { getByLabelText } = await renderInTestApp(<StatusPending />);
    expect(getByLabelText('Status pending')).toBeInTheDocument();
  });
});

describe('<StatusRunning />', () => {
  it('renders without exploding', async () => {
    const { getByLabelText } = await renderInTestApp(<StatusRunning />);
    expect(getByLabelText('Status running')).toBeInTheDocument();
  });
});

describe('<StatusAborted />', () => {
  it('renders without exploding', async () => {
    const { getByLabelText } = await renderInTestApp(<StatusAborted />);
    expect(getByLabelText('Status aborted')).toBeInTheDocument();
  });
});
