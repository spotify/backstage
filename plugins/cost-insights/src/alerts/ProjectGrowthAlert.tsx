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
import { ProjectGrowthAlertCard } from '../components/ProjectGrowthAlertCard';
import { Alert, ProjectGrowthData } from '../types';

/**
 * The alert below is an example of an Alert implementation; the CostInsightsApi permits returning
 * any implementation of the Alert type, so adopters can create their own. The CostInsightsApi
 * fetches alert data from the backend, then creates Alert classes with the data.
 */

export class ProjectGrowthAlert implements Alert {
  data: ProjectGrowthData;

  constructor(data: ProjectGrowthData) {
    this.data = data;
  }

  get url() {
    return '/cost-insights/investigating-growth';
  }

  get title() {
    return `Investigate cost growth in project ${this.data.project}`;
  }

  get subtitle() {
    return 'Cost growth outpacing business growth is unsustainable long-term.';
  }

  get element() {
    return <ProjectGrowthAlertCard alert={this.data} />;
  }
}
