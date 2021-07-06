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

import { Service, Incident, OnCall } from '../components/types';
import {
  PagerDutyApi,
  TriggerAlarmRequest,
  ServicesResponse,
  IncidentsResponse,
  OnCallsResponse,
  ClientApiConfig,
  RequestOptions,
} from './types';
import {
  createApiRef,
  DiscoveryApi,
  ConfigApi,
} from '@backstage/core-plugin-api';

export class UnauthorizedError extends Error {}

export const pagerDutyApiRef = createApiRef<PagerDutyApi>({
  id: 'plugin.pagerduty.api',
  description: 'Used to fetch data from PagerDuty API',
});

export class PagerDutyClient implements PagerDutyApi {
  static fromConfig(configApi: ConfigApi, discoveryApi: DiscoveryApi) {
    const eventsBaseUrl: string =
      configApi.getOptionalString('pagerDuty.eventsBaseUrl') ??
      'https://events.pagerduty.com/v2';
    return new PagerDutyClient({
      eventsBaseUrl,
      discoveryApi,
    });
  }
  constructor(private readonly config: ClientApiConfig) {}

  async getServiceByIntegrationKey(integrationKey: string): Promise<Service[]> {
    const params = `time_zone=UTC&include[]=integrations&include[]=escalation_policies&query=${integrationKey}`;
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/pagerduty/services?${params}`;
    const { services } = await this.getByUrl<ServicesResponse>(url);

    return services;
  }

  async getIncidentsByServiceId(serviceId: string): Promise<Incident[]> {
    const params = `time_zone=UTC&sort_by=created_at&statuses[]=triggered&statuses[]=acknowledged&service_ids[]=${serviceId}`;
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/pagerduty/incidents?${params}`;
    const { incidents } = await this.getByUrl<IncidentsResponse>(url);

    return incidents;
  }

  async getOnCallByPolicyId(policyId: string): Promise<OnCall[]> {
    const params = `time_zone=UTC&include[]=users&escalation_policy_ids[]=${policyId}`;
    const url = `${await this.config.discoveryApi.getBaseUrl(
      'proxy',
    )}/pagerduty/oncalls?${params}`;
    const { oncalls } = await this.getByUrl<OnCallsResponse>(url);

    return oncalls;
  }

  triggerAlarm({
    integrationKey,
    source,
    description,
    userName,
  }: TriggerAlarmRequest): Promise<Response> {
    const body = JSON.stringify({
      event_action: 'trigger',
      routing_key: integrationKey,
      client: 'Backstage',
      client_url: source,
      payload: {
        summary: description,
        source: source,
        severity: 'error',
        class: 'manual trigger',
        custom_details: {
          user: userName,
        },
      },
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'application/json, text/plain, */*',
      },
      body,
    };

    const url = this.config.eventsBaseUrl ?? 'https://events.pagerduty.com/v2';

    return this.request(`${url}/enqueue`, options);
  }

  private async getByUrl<T>(url: string): Promise<T> {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.pagerduty+json;version=2',
        'Content-Type': 'application/json',
      },
    };
    const response = await this.request(url, options);

    return response.json();
  }

  private async request(
    url: string,
    options: RequestOptions,
  ): Promise<Response> {
    const response = await fetch(url, options);
    if (response.status === 401) {
      throw new UnauthorizedError();
    }
    if (!response.ok) {
      const payload = await response.json();
      const errors = payload.errors.map((error: string) => error).join(' ');
      const message = `Request failed with ${response.status}, ${errors}`;
      throw new Error(message);
    }
    return response;
  }
}
