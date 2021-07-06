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
  EscalationPolicyInfo,
  Incident,
  OnCall,
  Team,
  User,
} from '../components/types';
import { DiscoveryApi } from '@backstage/core-plugin-api';

export type MessageType =
  | 'CRITICAL'
  | 'WARNING'
  | 'ACKNOWLEDGEMENT'
  | 'INFO'
  | 'RECOVERY';

export type TriggerAlarmRequest = {
  routingKey?: string;
  incidentType: MessageType;
  incidentId?: string;
  incidentDisplayName?: string;
  incidentMessage?: string;
  incidentStartTime?: number;
};

export interface SplunkOnCallApi {
  /**
   * Fetches a list of incidents
   */
  getIncidents(): Promise<Incident[]>;

  /**
   * Fetches the list of users in an escalation policy.
   */
  getOnCallUsers(): Promise<OnCall[]>;

  /**
   * Triggers-Resolves-Acknowledge an incident.
   */
  incidentAction(request: TriggerAlarmRequest): Promise<Response>;

  /**
   * Get a list of users for your organization.
   */
  getUsers(): Promise<User[]>;

  /**
   * Get a list of teams for your organization.
   */
  getTeams(): Promise<Team[]>;

  /**
   * Get a list of escalation policies for your organization.
   */
  getEscalationPolicies(): Promise<EscalationPolicyInfo[]>;
}

export type EscalationPolicyResponse = {
  policies: EscalationPolicyInfo[];
};

export type ListUserResponse = {
  users: User[];
  _selfUrl?: string;
};

export type IncidentsResponse = {
  incidents: Incident[];
};

export type OnCallsResponse = {
  teamsOnCall: OnCall[];
};

export type ClientApiConfig = {
  eventsRestEndpoint: string | null;
  discoveryApi: DiscoveryApi;
};

export type RequestOptions = {
  method: string;
  headers: HeadersInit;
  body?: BodyInit;
};
