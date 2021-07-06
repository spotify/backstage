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

/*
  This is a copy-pastable client template to get up and running quickly.
  API Reference:
  https://github.com/backstage/backstage/blob/master/plugins/cost-insights/src/api/CostInsightsApi.ts
*/

// IMPORTANT: Remove the lines below to enable type checking and linting
// @ts-nocheck
/* eslint-disable import/no-extraneous-dependencies */

import {
  CostInsightsApi,
  ProductInsightsOptions,
  Alert,
  Cost,
  Entity,
  Group,
  MetricData,
  Project,
} from '@backstage/plugin-cost-insights';

export class CostInsightsClient implements CostInsightsApi {

  async getLastCompleteBillingDate(): Promise<string> {
    return '2021-01-01'; // YYYY-MM-DD
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    return [];
  }

  async getGroupProjects(group: string): Promise<Project[]> {
    return [];
  }

  async getAlerts(group: string): Promise<Alert[]> {
    return [];
  }

  async getDailyMetricData(metric: string, intervals: string): Promise<MetricData> {
    return {
      id: 'remove-me',
      format: 'number',
      aggregation: [],
      change: {
        ratio: 0,
        amount: 0
      }
    }
  }

  async getGroupDailyCost(group: string, intervals: string): Promise<Cost> {
    return {
      id: 'remove-me',
      aggregation: [],
      change: {
        ratio: 0,
        amount: 0
      }
    }
  }

  async getProjectDailyCost(project: string, intervals: string): Promise<Cost> {
    return {
      id: 'remove-me',
      aggregation: [],
      change: {
        ratio: 0,
        amount: 0
      }
    }
  }

  async getProductInsights(options: ProductInsightsOptions): Promise<Entity> {
    return {
      id: 'remove-me',
      aggregation: [0, 0],
      change: {
        ratio: 0,
        amount: 0
      },
      entities: {}
    }
  }
}
