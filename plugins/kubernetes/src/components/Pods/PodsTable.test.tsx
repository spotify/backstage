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
import { PodsTable } from './PodsTable';

describe('PodsTable', () => {
  it('should render pod', async () => {
    const { getByText } = render(
      wrapInTestApp(<PodsTable pods={[pod as any]} />),
    );

    // titles
    expect(getByText('name')).toBeInTheDocument();
    expect(getByText('phase')).toBeInTheDocument();
    expect(getByText('containers ready')).toBeInTheDocument();
    expect(getByText('total restarts')).toBeInTheDocument();
    expect(getByText('status')).toBeInTheDocument();

    // values
    expect(getByText('dice-roller-6c8646bfd-2m5hv')).toBeInTheDocument();
    expect(getByText('Running')).toBeInTheDocument();
    expect(getByText('1/1')).toBeInTheDocument();
    expect(getByText('0')).toBeInTheDocument();
    expect(getByText('OK')).toBeInTheDocument();
  });
  it('should render crashing pod', async () => {
    const { getByText, getAllByText } = render(
      wrapInTestApp(<PodsTable pods={[crashingPod as any]} />),
    );

    // titles
    expect(getByText('name')).toBeInTheDocument();
    expect(getByText('phase')).toBeInTheDocument();
    expect(getByText('containers ready')).toBeInTheDocument();
    expect(getByText('total restarts')).toBeInTheDocument();
    expect(getByText('status')).toBeInTheDocument();

    // values
    expect(
      getByText('dice-roller-canary-7d64cd756c-55rfq'),
    ).toBeInTheDocument();
    expect(getByText('Running')).toBeInTheDocument();
    expect(getByText('1/3')).toBeInTheDocument();
    expect(getByText('76')).toBeInTheDocument();
    expect(getByText('Container: side-car')).toBeInTheDocument();
    expect(getByText('Container: other-side-car')).toBeInTheDocument();
    expect(getAllByText('CrashLoopBackOff')).toHaveLength(2);
  });
});
