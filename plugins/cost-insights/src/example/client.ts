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
/* eslint-disable no-restricted-imports */

import { DateTime } from 'luxon';
import { CostInsightsApi, ProductInsightsOptions } from '../api';
import {
  Alert,
  Cost,
  DEFAULT_DATE_FORMAT,
  Entity,
  Group,
  MetricData,
  Project,
  ProjectGrowthData,
  UnlabeledDataflowData,
} from '../types';
import { KubernetesMigrationAlert } from './alerts';
import { ProjectGrowthAlert, UnlabeledDataflowAlert } from '../alerts';
import {
  aggregationFor,
  changeOf,
  entityOf,
  getGroupedProducts,
  getGroupedProjects,
  trendlineOf,
} from '../testUtils';

export class ExampleCostInsightsClient implements CostInsightsApi {
  private request(_: any, res: any): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, 0, res));
  }

  getLastCompleteBillingDate(): Promise<string> {
    return Promise.resolve(
      DateTime.now().minus({ days: 1 }).toFormat(DEFAULT_DATE_FORMAT),
    );
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const groups: Group[] = await this.request({ userId }, [
      { id: 'pied-piper' },
    ]);

    return groups;
  }

  async getGroupProjects(group: string): Promise<Project[]> {
    const projects: Project[] = await this.request({ group }, [
      { id: 'project-a' },
      { id: 'project-b' },
      { id: 'project-c' },
    ]);

    return projects;
  }

  async getDailyMetricData(
    metric: string,
    intervals: string,
  ): Promise<MetricData> {
    const aggregation = aggregationFor(intervals, 100_000).map(entry => ({
      ...entry,
      amount: Math.round(entry.amount),
    }));

    const cost: MetricData = await this.request(
      { metric, intervals },
      {
        format: 'number',
        aggregation: aggregation,
        change: changeOf(aggregation),
        trendline: trendlineOf(aggregation),
      },
    );

    return cost;
  }

  async getGroupDailyCost(group: string, intervals: string): Promise<Cost> {
    const aggregation = aggregationFor(intervals, 8_000);
    const groupDailyCost: Cost = await this.request(
      { group, intervals },
      {
        aggregation: aggregation,
        change: changeOf(aggregation),
        trendline: trendlineOf(aggregation),
        // Optional field providing cost groupings / breakdowns keyed by the type. In this example,
        // daily cost grouped by cloud product OR by project / billing account.
        groupedCosts: {
          product: getGroupedProducts(intervals),
          project: getGroupedProjects(intervals),
        },
      },
    );

    return groupDailyCost;
  }

  async getProjectDailyCost(project: string, intervals: string): Promise<Cost> {
    const aggregation = aggregationFor(intervals, 1_500);
    const projectDailyCost: Cost = await this.request(
      { project, intervals },
      {
        id: 'project-a',
        aggregation: aggregation,
        change: changeOf(aggregation),
        trendline: trendlineOf(aggregation),
        // Optional field providing cost groupings / breakdowns keyed by the type. In this example,
        // daily project cost grouped by cloud product.
        groupedCosts: {
          product: getGroupedProducts(intervals),
        },
      },
    );

    return projectDailyCost;
  }

  async getProductInsights(options: ProductInsightsOptions): Promise<Entity> {
    const productInsights: Entity = await this.request(
      options,
      entityOf(options.product),
    );

    return productInsights;
  }

  async getAlerts(group: string): Promise<Alert[]> {
    const projectGrowthData: ProjectGrowthData = {
      project: 'example-project',
      periodStart: '2020-Q2',
      periodEnd: '2020-Q3',
      aggregation: [60_000, 120_000],
      change: {
        ratio: 1,
        amount: 60_000,
      },
      products: [
        { id: 'Compute Engine', aggregation: [58_000, 118_000] },
        { id: 'Cloud Dataflow', aggregation: [1200, 1500] },
        { id: 'Cloud Storage', aggregation: [800, 500] },
      ],
    };

    const unlabeledDataflowData: UnlabeledDataflowData = {
      periodStart: '2020-09-01',
      periodEnd: '2020-09-30',
      labeledCost: 6_200,
      unlabeledCost: 7_000,
      projects: [
        {
          id: 'example-project-1',
          unlabeledCost: 5_000,
          labeledCost: 3_000,
        },
        {
          id: 'example-project-2',
          unlabeledCost: 2_000,
          labeledCost: 3_200,
        },
      ],
    };

    const today = DateTime.now();
    const alerts: Alert[] = await this.request({ group }, [
      new ProjectGrowthAlert(projectGrowthData),
      new UnlabeledDataflowAlert(unlabeledDataflowData),
      new KubernetesMigrationAlert(this, {
        startDate: today.minus({ days: 30 }).toFormat(DEFAULT_DATE_FORMAT),
        endDate: today.toFormat(DEFAULT_DATE_FORMAT),
        change: {
          ratio: 0,
          amount: 0,
        },
        services: [
          {
            id: 'service-a',
            aggregation: [20_000, 10_000],
            change: {
              ratio: -0.5,
              amount: -10_000,
            },
            entities: {},
          },
          {
            id: 'service-b',
            aggregation: [30_000, 15_000],
            change: {
              ratio: -0.5,
              amount: -15_000,
            },
            entities: {},
          },
        ],
      }),
    ]);

    return alerts;
  }
}
