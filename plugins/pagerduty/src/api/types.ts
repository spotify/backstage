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

import { Incident, OnCall, Service } from '../components/types';
import { DiscoveryApi } from '@backstage/core-plugin-api';

export type TriggerAlarmRequest = {
  integrationKey: string;
  source: string;
  description: string;
  userName: string;
};

export interface PagerDutyApi {
  /**
   * Fetches a list of services, filtered by the provided integration key.
   *
   */
  getServiceByIntegrationKey(integrationKey: string): Promise<Service[]>;

  /**
   * Fetches a list of incidents a provided service has.
   *
   */
  getIncidentsByServiceId(serviceId: string): Promise<Incident[]>;

  /**
   * Fetches the list of users in an escalation policy.
   *
   */
  getOnCallByPolicyId(policyId: string): Promise<OnCall[]>;

  /**
   * Triggers an incident to whoever is on-call.
   */
  triggerAlarm(request: TriggerAlarmRequest): Promise<Response>;
}

export type ServicesResponse = {
  services: Service[];
};

export type IncidentsResponse = {
  incidents: Incident[];
};

export type OnCallsResponse = {
  oncalls: OnCall[];
};

export type ClientApiConfig = {
  eventsBaseUrl?: string;
  discoveryApi: DiscoveryApi;
};

export type RequestOptions = {
  method: string;
  headers: HeadersInit;
  body?: BodyInit;
};
