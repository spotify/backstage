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

export interface Incident {
  id: number;
  summary: string;
  details: string;
  reportTime: string;
  resolvedOn: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  incidentKey: string;
  alertSource: AlertSource | null;
  assignedTo: User | null;
  logEntries: LogEntry[];
  links: Link[];
  images: Image[];
  subscribers: Subscriber[];
  commentText: string;
  commentPublishToSubscribers: boolean;
}

export const PENDING = 'PENDING';
export const ACCEPTED = 'ACCEPTED';
export const RESOLVED = 'RESOLVED';
export type IncidentStatus = typeof PENDING | typeof ACCEPTED | typeof RESOLVED;
export type IncidentPriority = 'HIGH' | 'LOW';

export interface Link {
  href: string;
  text: string;
}

export interface Image {
  src: string;
  href: string;
  alt: string;
}

export type SubscriberType = 'TEAM' | 'USER';

export interface Subscriber {
  id: number;
  name: string;
  type: SubscriberType;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  logEntryType: string;
  text: string;
  incidentId?: number;
  iconName?: string;
  iconClass?: string;
  filterTypes?: string[];
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: Phone;
  landline: Phone;
  timezone?: string;
  language?: Language;
  role?: UserRole;
  notificationPreferences?: any[];
  position: string;
  department: string;
}

export type UserRole =
  | 'USER'
  | 'ADMIN'
  | 'STAKEHOLDER'
  | 'ACCOUNT_OWNER'
  | 'RESPONDER';
export type Language = 'de' | 'en';
export interface Phone {
  regionCode: string;
  number: string;
}

export interface AlertSource {
  id: number;
  name: string;
  status: AlertSourceStatus;
  escalationPolicy: EscalationPolicy;
  integrationType: AlertSourceIntegrationType;
  integrationKey?: string;
  iconUrl?: string;
  lightIconUrl?: string;
  darkIconUrl?: string;
  incidentCreation?: AlertSourceIncidentCreation;
  incidentPriorityRule?: AlertSourceIncidentPriorityRule;
  emailFiltered?: boolean;
  emailResolveFiltered?: boolean;
  active?: boolean;
  emailPredicates?: AlertSourceEmailPredicate[];
  emailResolvePredicates?: AlertSourceEmailPredicate[];
  filterOperator?: AlertSourceFilterOperator;
  resolveFilterOperator?: AlertSourceFilterOperator;
  supportHours?: AlertSourceSupportHours;
  heartbeat?: AlertSourceHeartbeat;
  autotaskMetadata?: AlertSourceAutotaskMetadata;
  autoResolutionTimeout?: string;
  teams: TeamShort[];
}

export interface TeamShort {
  id: number;
  name: string;
}

export interface TeamMember {
  user: User;
  role: 'STAKEHOLDER' | 'RESPONDER' | 'USER' | 'ADMIN';
}

export type AlertSourceStatus =
  | 'PENDING'
  | 'ALL_ACCEPTED'
  | 'ALL_RESOLVED'
  | 'IN_MAINTENANCE'
  | 'DISABLED';
export type AlertSourceIntegrationType =
  | 'NAGIOS'
  | 'ICINGA'
  | 'EMAIL'
  | 'SMS'
  | 'API'
  | 'CRN'
  | 'HEARTBEAT'
  | 'PRTG'
  | 'PINGDOM'
  | 'CLOUDWATCH'
  | 'AWSPHD'
  | 'STACKDRIVER'
  | 'INSTANA'
  | 'ZABBIX'
  | 'SOLARWINDS'
  | 'PROMETHEUS'
  | 'NEWRELIC'
  | 'GRAFANA'
  | 'GITHUB'
  | 'DATADOG'
  | 'UPTIMEROBOT'
  | 'APPDYNAMICS'
  | 'DYNATRACE'
  | 'TOPDESK'
  | 'STATUSCAKE'
  | 'MONITOR'
  | 'TOOL'
  | 'CHECKMK'
  | 'AUTOTASK'
  | 'AWSBUDGET'
  | 'KENTIXAM'
  | 'CONSUL'
  | 'ZAMMAD'
  | 'SIGNALFX'
  | 'SPLUNK'
  | 'KUBERNETES'
  | 'SEMATEXT'
  | 'SENTRY'
  | 'SUMOLOGIC'
  | 'RAYGUN'
  | 'MXTOOLBOX'
  | 'ESWATCHER'
  | 'AMAZONSNS'
  | 'KAPACITOR'
  | 'CORTEXXSOAR'
  | string;
export type AlertSourceIncidentCreation =
  | 'ONE_INCIDENT_PER_EMAIL'
  | 'ONE_INCIDENT_PER_EMAIL_SUBJECT'
  | 'ONE_PENDING_INCIDENT_ALLOWED'
  | 'ONE_OPEN_INCIDENT_ALLOWED'
  | 'OPEN_RESOLVE_ON_EXTRACTION';
export type AlertSourceFilterOperator = 'AND' | 'OR';
export type AlertSourceIncidentPriorityRule =
  | 'HIGH'
  | 'LOW'
  | 'HIGH_DURING_SUPPORT_HOURS'
  | 'LOW_DURING_SUPPORT_HOURS';
export interface AlertSourceEmailPredicate {
  field: 'EMAIL_FROM' | 'EMAIL_SUBJECT' | 'EMAIL_BODY';
  criteria:
    | 'CONTAINS_ANY_WORDS'
    | 'CONTAINS_NOT_WORDS'
    | 'CONTAINS_STRING'
    | 'CONTAINS_NOT_STRING'
    | 'IS_STRING'
    | 'IS_NOT_STRING'
    | 'MATCHES_REGEX'
    | 'MATCHES_NOT_REGEX';
  value: string;
}
export type AlertSourceTimeZone =
  | 'Europe/Berlin'
  | 'America/New_York'
  | 'America/Los_Angeles'
  | 'Asia/Istanbul';
export interface AlertSourceSupportDay {
  start: string;
  end: string;
}
export interface AlertSourceSupportHours {
  timezone: AlertSourceTimeZone;
  autoRaiseIncidents: boolean;
  supportDays: {
    MONDAY: AlertSourceSupportDay;
    TUESDAY: AlertSourceSupportDay;
    WEDNESDAY: AlertSourceSupportDay;
    THURSDAY: AlertSourceSupportDay;
    FRIDAY: AlertSourceSupportDay;
    SATURDAY: AlertSourceSupportDay;
    SUNDAY: AlertSourceSupportDay;
  };
}
export interface AlertSourceHeartbeat {
  summary: string;
  intervalSec: number;
  status: 'OVERDUE' | 'ON_TIME' | 'NEVER_RECEIVED';
}

export interface AlertSourceAutotaskMetadata {
  userName: string;
  secret: string;
  apiIntegrationCode: string;
  webServer: string;
}

export interface EscalationPolicy {
  id: number;
  name: string;
  escalationRules: EscalationRule[];
  newEscalationRule: EscalationRule;
  repeating?: boolean;
  frequency?: number;
  teams: TeamShort[];
}

export interface EscalationRule {
  user: User | null;
  schedule: Schedule | null;
  escalationTimeout: number;
}

export interface Schedule {
  id: number;
  name: string;
  timezone: string;
  startsOn: string;
  currentShift: Shift;
  nextShift: Shift;
  shifts: Shift[];
  overrides: Shift[];
  teams: TeamShort[];
}

export interface Shift {
  user: User;
  start: string;
  end: string;
}

export interface UptimeMonitor {
  id: number;
  name: string;
  region: 'EU' | 'US';
  checkType: 'http' | 'tcp' | 'udp' | 'ping';
  checkParams: UptimeMonitorCheckParams;
  intervalSec: number;
  timeoutMs: number;
  createIncidentAfterFailedChecks: number;
  paused: boolean;
  embedUrl: string;
  shareUrl: string;
  status: string;
  lastStatusChange: string;
  escalationPolicy: EscalationPolicy;
  teams: TeamShort[];
}

export interface UptimeMonitorCheckParams {
  host?: string;
  port?: number;
  url?: string;
}

export interface IncidentResponder {
  group: 'SUGGESTED' | 'USER' | 'ESCALATION_POLICY' | 'ON_CALL_SCHEDULE';
  id: number;
  name: string;
  disabled: boolean;
}

export interface IncidentAction {
  name: string;
  type: string;
  webhookId: string;
  extensionId?: string;
  history?: IncidentActionHistory[];
}

export interface IncidentActionHistory {
  id: string;
  webhookId: string;
  incidentId: number;
  actor: User;
  success: boolean;
}

export interface OnCall {
  user: User;
  escalationPolicy: EscalationPolicy;
  schedule?: Schedule;
  start: string;
  end: string;
  escalationLevel: number;
}
