/*
 * Copyright 2021 The Backstage Authors
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
  AlertSource,
  Incident,
  User,
  IncidentStatus,
  UptimeMonitor,
  EscalationPolicy,
  Schedule,
  IncidentResponder,
  IncidentAction,
  OnCall,
} from '../types';
import { DiscoveryApi } from '@backstage/core-plugin-api';

export type TableState = {
  page: number;
  pageSize: number;
};

export type GetIncidentsOpts = {
  maxResults?: number;
  startIndex?: number;
  states?: IncidentStatus[];
  alertSources?: number[];
};

export type GetIncidentsCountOpts = {
  states?: IncidentStatus[];
};

export type EventRequest = {
  integrationKey: string;
  summary: string;
  details: string;
  userName: string;
  source: string;
};

export interface ILertApi {
  fetchIncidents(opts?: GetIncidentsOpts): Promise<Incident[]>;
  fetchIncidentsCount(opts?: GetIncidentsCountOpts): Promise<number>;
  fetchIncident(id: number): Promise<Incident>;
  fetchIncidentResponders(incident: Incident): Promise<IncidentResponder[]>;
  fetchIncidentActions(incident: Incident): Promise<IncidentAction[]>;
  acceptIncident(incident: Incident, userName: string): Promise<Incident>;
  resolveIncident(incident: Incident, userName: string): Promise<Incident>;
  assignIncident(
    incident: Incident,
    responder: IncidentResponder,
  ): Promise<Incident>;
  createIncident(eventRequest: EventRequest): Promise<boolean>;
  triggerIncidentAction(
    incident: Incident,
    action: IncidentAction,
  ): Promise<void>;

  fetchUptimeMonitors(): Promise<UptimeMonitor[]>;
  pauseUptimeMonitor(uptimeMonitor: UptimeMonitor): Promise<UptimeMonitor>;
  resumeUptimeMonitor(uptimeMonitor: UptimeMonitor): Promise<UptimeMonitor>;
  fetchUptimeMonitor(id: number): Promise<UptimeMonitor>;

  fetchAlertSources(): Promise<AlertSource[]>;
  fetchAlertSource(idOrIntegrationKey: number | string): Promise<AlertSource>;
  fetchAlertSourceOnCalls(alertSource: AlertSource): Promise<OnCall[]>;
  enableAlertSource(alertSource: AlertSource): Promise<AlertSource>;
  disableAlertSource(alertSource: AlertSource): Promise<AlertSource>;

  addImmediateMaintenance(
    alertSourceId: number,
    minutes: number,
  ): Promise<void>;

  fetchOnCallSchedules(): Promise<Schedule[]>;
  fetchUsers(): Promise<User[]>;

  overrideShift(
    scheduleId: number,
    userId: number,
    start: string,
    end: string,
  ): Promise<Schedule>;

  getIncidentDetailsURL(incident: Incident): string;
  getAlertSourceDetailsURL(alertSource: AlertSource | null): string;
  getEscalationPolicyDetailsURL(escalationPolicy: EscalationPolicy): string;
  getUptimeMonitorDetailsURL(uptimeMonitor: UptimeMonitor): string;
  getScheduleDetailsURL(schedule: Schedule): string;
  getUserPhoneNumber(user: User | null): string;
  getUserInitials(user: User | null): string;
}

export type Options = {
  discoveryApi: DiscoveryApi;

  /**
   * URL used by users to access iLert web UI.
   * Example: https://my-org.ilert.com/
   */
  baseUrl: string;

  /**
   * Path to use for requests via the proxy, defaults to /ilert/api
   */
  proxyPath: string;
};
