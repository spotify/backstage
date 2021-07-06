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
import * as hpas from './__fixtures__/horizontalpodautoscalers.json';
import { wrapInTestApp } from '@backstage/test-utils';
import { HorizontalPodAutoscalerDrawer } from './HorizontalPodAutoscalerDrawer';

describe('HorizontalPodAutoscalersDrawer', () => {
  it('should render hpa drawer', async () => {
    const { getByText } = render(
      wrapInTestApp(
        <HorizontalPodAutoscalerDrawer hpa={hpas[0] as any} expanded>
          <h1>CHILD</h1>
        </HorizontalPodAutoscalerDrawer>,
      ),
    );

    expect(getByText('dice-roller')).toBeInTheDocument();
    expect(getByText('CHILD')).toBeInTheDocument();
    expect(getByText('HorizontalPodAutoscaler')).toBeInTheDocument();
    expect(getByText('YAML')).toBeInTheDocument();
    expect(getByText('Target CPU Utilization Percentage')).toBeInTheDocument();
    expect(getByText('50')).toBeInTheDocument();
    expect(getByText('Current CPU Utilization Percentage')).toBeInTheDocument();
    expect(getByText('30')).toBeInTheDocument();
    expect(getByText('Min Replicas')).toBeInTheDocument();
    expect(getByText('10')).toBeInTheDocument();
    expect(getByText('Max Replicas')).toBeInTheDocument();
    expect(getByText('15')).toBeInTheDocument();
    expect(getByText('Current Replicas')).toBeInTheDocument();
    expect(getByText('13')).toBeInTheDocument();
    expect(getByText('Desired Replicas')).toBeInTheDocument();
    expect(getByText('14')).toBeInTheDocument();
  });
});
