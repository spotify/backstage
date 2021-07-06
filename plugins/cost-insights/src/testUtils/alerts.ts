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

import {
  ProjectGrowthData,
  UnlabeledDataflowAlertProject,
  UnlabeledDataflowData,
} from '../types';

type mockAlertRenderer<T> = (alert: T) => T;
type mockEntityRenderer<T> = (entity: T) => T;

export const createMockUnlabeledDataflowData = (
  callback?: mockAlertRenderer<UnlabeledDataflowData>,
): UnlabeledDataflowData => {
  const data: UnlabeledDataflowData = {
    periodStart: '2020-05-01',
    periodEnd: '2020-06-1',
    projects: [],
    unlabeledCost: 0,
    labeledCost: 0,
  };

  if (typeof callback === 'function') {
    return callback({ ...data });
  }

  return { ...data };
};

export const createMockUnlabeledDataflowAlertProject = (
  callback?: mockEntityRenderer<UnlabeledDataflowAlertProject>,
): UnlabeledDataflowAlertProject => {
  const defaultProject: UnlabeledDataflowAlertProject = {
    id: 'test-alert-project',
    unlabeledCost: 2000.0,
    labeledCost: 3200.0,
  };
  if (typeof callback === 'function') {
    return callback({ ...defaultProject });
  }
  return { ...defaultProject };
};

export const createMockProjectGrowthData = (
  callback?: mockAlertRenderer<ProjectGrowthData>,
): ProjectGrowthData => {
  const data: ProjectGrowthData = {
    project: 'test-project-growth-alert',
    periodStart: '2019-Q4',
    periodEnd: '2020-Q1',
    aggregation: [670532.1, 970502.8],
    change: {
      ratio: 0.5,
      amount: 180000,
    },
    products: [],
  };

  if (typeof callback === 'function') {
    return callback({ ...data });
  }

  return { ...data };
};
