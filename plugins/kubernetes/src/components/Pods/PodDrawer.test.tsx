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
import * as pod from './__fixtures__/pod.json';
import * as crashingPod from './__fixtures__/crashing-pod.json';
import { wrapInTestApp } from '@backstage/test-utils';
import { PodDrawer } from './PodDrawer';

describe('PodDrawer', () => {
  it('should render pod', async () => {
    const { getByText, getAllByText } = render(
      wrapInTestApp(<PodDrawer pod={pod as any} expanded />),
    );

    expect(getAllByText('dice-roller-6c8646bfd-2m5hv')).toHaveLength(2);
    expect(getByText('Pod')).toBeInTheDocument();
    expect(getByText('YAML')).toBeInTheDocument();
    expect(getByText('Images')).toBeInTheDocument();
    expect(getByText('nginx=nginx:1.14.2')).toBeInTheDocument();
    expect(getByText('Phase')).toBeInTheDocument();
    expect(getByText('Running')).toBeInTheDocument();
    expect(getAllByText('Containers Ready')).toHaveLength(2);
    expect(getByText('1/1')).toBeInTheDocument();
    expect(getByText('Total Restarts')).toBeInTheDocument();
    expect(getByText('0')).toBeInTheDocument();
    expect(getByText('Container Statuses')).toBeInTheDocument();
    expect(getByText('OK')).toBeInTheDocument();
    expect(getByText('Initialized')).toBeInTheDocument();
    expect(getByText('Ready')).toBeInTheDocument();
    expect(getByText('Pod Scheduled')).toBeInTheDocument();
    expect(getAllByText('True')).toHaveLength(4);
    expect(getByText('Exposed Ports')).toBeInTheDocument();
    expect(getByText('Nginx:')).toBeInTheDocument();
    expect(getByText('Container Port: 80')).toBeInTheDocument();
    expect(getByText('Protocol: TCP')).toBeInTheDocument();
  });
  it('should render crashing pod', async () => {
    const { getByText, getAllByText } = render(
      wrapInTestApp(<PodDrawer pod={crashingPod as any} expanded />),
    );

    expect(getAllByText('dice-roller-canary-7d64cd756c-55rfq')).toHaveLength(2);
    expect(getByText('Pod')).toBeInTheDocument();
    expect(getByText('YAML')).toBeInTheDocument();
    expect(getByText('Images')).toBeInTheDocument();
    expect(getByText('nginx=nginx:1.14.2')).toBeInTheDocument();
    expect(getByText('other-side-car=nginx:1.14.2')).toBeInTheDocument();
    expect(getByText('side-car=nginx:1.14.2')).toBeInTheDocument();
    expect(getByText('Phase')).toBeInTheDocument();
    expect(getByText('Running')).toBeInTheDocument();
    expect(getAllByText('Containers Ready')).toHaveLength(2);
    expect(getByText('1/3')).toBeInTheDocument();
    expect(getByText('Total Restarts')).toBeInTheDocument();
    expect(getByText('76')).toBeInTheDocument();
    expect(getByText('Container Statuses')).toBeInTheDocument();
    expect(getByText('Container: side-car')).toBeInTheDocument();
    expect(getByText('Container: other-side-car')).toBeInTheDocument();
    expect(getAllByText('CrashLoopBackOff')).toHaveLength(2);
    expect(getByText('Initialized')).toBeInTheDocument();
    expect(getByText('Ready')).toBeInTheDocument();
    expect(getByText('Pod Scheduled')).toBeInTheDocument();
    expect(getAllByText('True')).toHaveLength(2);
    expect(getAllByText('False')).toHaveLength(2);
    expect(
      getAllByText('containers with unready status: [side-car other-side-car]'),
    ).toHaveLength(2);
    expect(getByText('Exposed Ports')).toBeInTheDocument();
    expect(getAllByText('Protocol: TCP')).toHaveLength(3);
    expect(getByText('Nginx:')).toBeInTheDocument();
    expect(getByText('Container Port: 80')).toBeInTheDocument();
    expect(getByText('Side Car:')).toBeInTheDocument();
    expect(getByText('Container Port: 81')).toBeInTheDocument();
    expect(getByText('Other Side Car:')).toBeInTheDocument();
    expect(getByText('Container Port: 82')).toBeInTheDocument();
  });
});
