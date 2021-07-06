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
  Alert,
  Cost,
  Entity,
  Group,
  Project,
  Maybe,
  MetricData,
} from '../types';
import { createApiRef } from '@backstage/core-plugin-api';

export type ProductInsightsOptions = {
  /**
   * The product from the cost-insights configuration in app-config.yaml
   */
  product: string;

  /**
   * The group id from getUserGroups or query parameters
   */
  group: string;

  /**
   * An ISO 8601 repeating interval string, such as R2/P3M/2020-09-01
   */
  intervals: string;

  /**
   * (optional) The project id from getGroupProjects or query parameters
   */
  project: Maybe<string>;
};

export type CostInsightsApi = {
  /**
   * Get the most current date for which billing data is complete, in YYYY-MM-DD format. This helps
   * define the intervals used in other API methods to avoid showing incomplete cost. The costs for
   * today, for example, will not be complete. This ideally comes from the cloud provider.
   */
  getLastCompleteBillingDate(): Promise<string>;

  /**
   * Get a list of groups the given user belongs to. These may be LDAP groups or similar
   * organizational groups. Cost Insights is designed to show costs based on group membership;
   * if a user has multiple groups, they are able to switch between groups to see costs for each.
   *
   * This method should be removed once the Backstage identity plugin provides the same concept.
   *
   * @param userId The login id for the current user
   */
  getUserGroups(userId: string): Promise<Group[]>;

  /**
   * Get a list of cloud billing entities that belong to this group (projects in GCP, AWS has a
   * similar concept in billing accounts). These act as filters for the displayed costs, users can
   * choose whether they see all costs for a group, or those from a particular owned project.
   *
   * @param group The group id from getUserGroups or query parameters
   */
  getGroupProjects(group: string): Promise<Project[]>;

  /**
   * Get daily cost aggregations for a given group and interval time frame.
   *
   * The return type includes an array of daily cost aggregations as well as statistics about the
   * change in cost over the intervals. Calculating these statistics requires us to bucket costs
   * into two or more time periods, hence a repeating interval format rather than just a start and
   * end date.
   *
   * The rate of change in this comparison allows teams to reason about their cost growth (or
   * reduction) and compare it to metrics important to the business.
   *
   * @param group The group id from getUserGroups or query parameters
   * @param intervals An ISO 8601 repeating interval string, such as R2/P30D/2020-09-01
   *   https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
   */
  getGroupDailyCost(group: string, intervals: string): Promise<Cost>;

  /**
   * Get daily cost aggregations for a given billing entity (project in GCP, AWS has a similar
   * concept in billing accounts) and interval time frame.
   *
   * The return type includes an array of daily cost aggregations as well as statistics about the
   * change in cost over the intervals. Calculating these statistics requires us to bucket costs
   * into two or more time periods, hence a repeating interval format rather than just a start and
   * end date.
   *
   * The rate of change in this comparison allows teams to reason about the project's cost growth
   * (or reduction) and compare it to metrics important to the business.
   *
   * @param project The project id from getGroupProjects or query parameters
   * @param intervals An ISO 8601 repeating interval string, such as R2/P30D/2020-09-01
   *   https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
   */
  getProjectDailyCost(project: string, intervals: string): Promise<Cost>;

  /**
   * Get aggregations for a particular metric and interval time frame. Teams
   * can see metrics important to their business in comparison to the growth
   * (or reduction) of a project or group's daily costs.
   *
   * @param metric A metric from the cost-insights configuration in app-config.yaml.
   * @param intervals An ISO 8601 repeating interval string, such as R2/P30D/2020-09-01
   *   https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
   */
  getDailyMetricData(metric: string, intervals: string): Promise<MetricData>;

  /**
   * Get cost aggregations for a particular cloud product and interval time frame. This includes
   * total cost for the product, as well as a breakdown of particular entities that incurred cost
   * in this product. The type of entity depends on the product - it may be deployed services,
   * storage buckets, managed database instances, etc.
   *
   * If project is supplied, this should only return product costs for the given billing entity
   * (project in GCP).
   *
   * The time period is supplied as a Duration rather than intervals, since this is always expected
   * to return data for two bucketed time period (e.g. month vs month, or quarter vs quarter).
   *
   * @param options Options to use when fetching insights for a particular cloud product and
   *                interval time frame.
   */
  getProductInsights(options: ProductInsightsOptions): Promise<Entity>;

  /**
   * Get current cost alerts for a given group. These show up as Action Items for the group on the
   * Cost Insights page. Alerts may include cost-saving recommendations, such as infrastructure
   * migrations, or cost-related warnings, such as an unexpected billing anomaly.
   */
  getAlerts(group: string): Promise<Alert[]>;
};

export const costInsightsApiRef = createApiRef<CostInsightsApi>({
  id: 'plugin.costinsights.service',
  description: 'Provides cost data and alerts for the cost-insights plugin',
});
