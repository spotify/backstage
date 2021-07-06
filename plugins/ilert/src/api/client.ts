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
import { AuthenticationError, ResponseError } from '@backstage/errors';
import {
  AlertSource,
  EscalationPolicy,
  Incident,
  IncidentAction,
  IncidentResponder,
  OnCall,
  Schedule,
  UptimeMonitor,
  User,
} from '../types';
import {
  ILertApi,
  GetIncidentsOpts,
  GetIncidentsCountOpts,
  Options,
  EventRequest,
} from './types';
import { DateTime as dt } from 'luxon';
import {
  ConfigApi,
  createApiRef,
  DiscoveryApi,
} from '@backstage/core-plugin-api';

export const ilertApiRef = createApiRef<ILertApi>({
  id: 'plugin.ilert.service',
  description: 'Used to make requests towards iLert API',
});

const DEFAULT_PROXY_PATH = '/ilert';
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export class ILertClient implements ILertApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly proxyPath: string;
  private readonly baseUrl: string;

  static fromConfig(configApi: ConfigApi, discoveryApi: DiscoveryApi) {
    const baseUrl: string =
      configApi.getOptionalString('ilert.baseUrl') ?? 'https://app.ilert.com';

    return new ILertClient({
      discoveryApi: discoveryApi,
      baseUrl,
      proxyPath:
        configApi.getOptionalString('ilert.proxyPath') ?? DEFAULT_PROXY_PATH,
    });
  }

  constructor(opts: Options) {
    this.discoveryApi = opts.discoveryApi;
    this.baseUrl = opts.baseUrl;
    this.proxyPath = opts.proxyPath;
  }

  private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
    const apiUrl = await this.apiUrl();

    const response = await fetch(`${apiUrl}${input}`, init);
    if (response.status === 401) {
      throw new AuthenticationError(
        'This request requires HTTP authentication.',
      );
    }
    if (!response.ok || response.status >= 400) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  async fetchIncidents(opts?: GetIncidentsOpts): Promise<Incident[]> {
    const init = {
      headers: JSON_HEADERS,
    };
    const query = new URLSearchParams();
    if (opts?.maxResults !== undefined) {
      query.append('max-results', String(opts.maxResults));
    }
    if (opts?.startIndex !== undefined) {
      query.append('start-index', String(opts.startIndex));
    }
    if (opts?.alertSources !== undefined && Array.isArray(opts.alertSources)) {
      opts.alertSources.forEach((a: number) => {
        if (a) {
          query.append('alert-source', String(a));
        }
      });
    }

    if (opts?.states !== undefined && Array.isArray(opts.states)) {
      opts.states.forEach(state => {
        query.append('state', state);
      });
    }
    const response = await this.fetch(
      `/api/v1/incidents?${query.toString()}`,
      init,
    );

    return response;
  }

  async fetchIncidentsCount(opts?: GetIncidentsCountOpts): Promise<number> {
    const init = {
      headers: JSON_HEADERS,
    };
    const query = new URLSearchParams();
    if (opts && opts.states && Array.isArray(opts.states)) {
      opts.states.forEach(state => {
        query.append('state', state);
      });
    }
    const response = await this.fetch(
      `/api/v1/incidents/count?${query.toString()}`,
      init,
    );

    return response && response.count ? response.count : 0;
  }

  async fetchIncident(id: number): Promise<Incident> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch(
      `/api/v1/incidents/${encodeURIComponent(id)}`,
      init,
    );

    return response;
  }

  async fetchIncidentResponders(
    incident: Incident,
  ): Promise<IncidentResponder[]> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch(
      `/api/v1/incidents/${encodeURIComponent(incident.id)}/responders`,
      init,
    );

    return response;
  }

  async fetchIncidentActions(incident: Incident): Promise<IncidentAction[]> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch(
      `/api/v1/incidents/${encodeURIComponent(incident.id)}/actions`,
      init,
    );

    return response;
  }

  async acceptIncident(
    incident: Incident,
    userName: string,
  ): Promise<Incident> {
    const init = {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({
        apiKey: incident.alertSource?.integrationKey || '',
        incidentKey: incident.incidentKey,
        summary: `from ${userName} via Backstage plugin`,
        eventType: 'ACCEPT',
      }),
    };

    await this.fetch('/api/v1/events', init);
    return this.fetchIncident(incident.id);
  }

  async resolveIncident(
    incident: Incident,
    userName: string,
  ): Promise<Incident> {
    const init = {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({
        apiKey: incident.alertSource?.integrationKey || '',
        incidentKey: incident.incidentKey,
        summary: `from ${userName} via Backstage plugin`,
        eventType: 'RESOLVE',
      }),
    };

    await this.fetch('/api/v1/events', init);
    return this.fetchIncident(incident.id);
  }

  async assignIncident(
    incident: Incident,
    responder: IncidentResponder,
  ): Promise<Incident> {
    const init = {
      method: 'PUT',
      headers: JSON_HEADERS,
    };

    const query = new URLSearchParams();
    switch (responder.group) {
      case 'ESCALATION_POLICY':
        query.append('policy-id', String(responder.id));
        break;
      case 'ON_CALL_SCHEDULE':
        query.append('schedule-id', String(responder.id));
        break;
      default:
        query.append('user-id', String(responder.id));
        break;
    }

    const response = await this.fetch(
      `/api/v1/incidents/${encodeURIComponent(
        incident.id,
      )}/assign?${query.toString()}`,
      init,
    );

    return response;
  }

  async triggerIncidentAction(
    incident: Incident,
    action: IncidentAction,
  ): Promise<void> {
    const init = {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({
        webhookId: action.webhookId,
        extensionId: action.extensionId,
        type: action.type,
        name: action.name,
      }),
    };

    await this.fetch(
      `/api/v1/incidents/${encodeURIComponent(incident.id)}/actions`,
      init,
    );
  }

  async createIncident(eventRequest: EventRequest): Promise<boolean> {
    const init = {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({
        apiKey: eventRequest.integrationKey,
        summary: eventRequest.summary,
        details: eventRequest.details,
        eventType: 'ALERT',
        links: [
          {
            href: eventRequest.source,
            text: 'Backstage Url',
          },
        ],
        customDetails: {
          userName: eventRequest.userName,
        },
      }),
    };

    const response = await this.fetch('/api/v1/events', init);
    return response;
  }

  async fetchUptimeMonitors(): Promise<UptimeMonitor[]> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch('/api/v1/uptime-monitors', init);

    return response;
  }

  async fetchUptimeMonitor(id: number): Promise<UptimeMonitor> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response: UptimeMonitor = await this.fetch(
      `/api/v1/uptime-monitors/${encodeURIComponent(id)}`,
      init,
    );

    return response;
  }

  async pauseUptimeMonitor(
    uptimeMonitor: UptimeMonitor,
  ): Promise<UptimeMonitor> {
    const init = {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...uptimeMonitor, paused: true }),
    };

    const response = await this.fetch(
      `/api/v1/uptime-monitors/${encodeURIComponent(uptimeMonitor.id)}`,
      init,
    );

    return response;
  }

  async resumeUptimeMonitor(
    uptimeMonitor: UptimeMonitor,
  ): Promise<UptimeMonitor> {
    const init = {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...uptimeMonitor, paused: false }),
    };

    const response = await this.fetch(
      `/api/v1/uptime-monitors/${encodeURIComponent(uptimeMonitor.id)}`,
      init,
    );

    return response;
  }

  async fetchAlertSources(): Promise<AlertSource[]> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch('/api/v1/alert-sources', init);

    return response;
  }

  async fetchAlertSource(
    idOrIntegrationKey: number | string,
  ): Promise<AlertSource> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch(
      `/api/v1/alert-sources/${encodeURIComponent(idOrIntegrationKey)}`,
      init,
    );

    return response;
  }

  async fetchAlertSourceOnCalls(alertSource: AlertSource): Promise<OnCall[]> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch(
      `/api/v1/on-calls?policies=${encodeURIComponent(
        alertSource.escalationPolicy.id,
      )}&expand=user&expand=escalationPolicy&timezone=${dt.local().zoneName}`,
      init,
    );

    return response;
  }

  async enableAlertSource(alertSource: AlertSource): Promise<AlertSource> {
    const init = {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...alertSource, active: true }),
    };

    const response = await this.fetch(
      `/api/v1/alert-sources/${encodeURIComponent(alertSource.id)}`,
      init,
    );

    return response;
  }

  async disableAlertSource(alertSource: AlertSource): Promise<AlertSource> {
    const init = {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...alertSource, active: false }),
    };

    const response = await this.fetch(
      `/api/v1/alert-sources/${encodeURIComponent(alertSource.id)}`,
      init,
    );

    return response;
  }

  async addImmediateMaintenance(
    alertSourceId: number,
    minutes: number,
  ): Promise<void> {
    const init = {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({
        start: dt.utc().toISO(),
        end: dt.utc().plus({ minutes }).toISO(),
        description: `Immediate maintenance window for ${minutes} minutes. Backstage — iLert plugin.`,
        createdBy: 'Backstage',
        timezone: dt.local().zoneName,
        alertSources: [{ id: alertSourceId }],
      }),
    };

    const response = await this.fetch('/api/v1/maintenance-windows', init);

    return response;
  }

  async fetchOnCallSchedules(): Promise<Schedule[]> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch('/api/v1/schedules', init);

    return response;
  }

  async fetchUsers(): Promise<User[]> {
    const init = {
      headers: JSON_HEADERS,
    };

    const response = await this.fetch('/api/v1/users', init);

    return response;
  }

  async overrideShift(
    scheduleId: number,
    userId: number,
    start: string,
    end: string,
  ): Promise<Schedule> {
    const init = {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify({ user: { id: userId }, start, end }),
    };

    const response = await this.fetch(
      `/api/v1/schedules/${encodeURIComponent(scheduleId)}/overrides`,
      init,
    );

    return response;
  }

  getIncidentDetailsURL(incident: Incident): string {
    return `${this.baseUrl}/incident/view.jsf?id=${encodeURIComponent(
      incident.id,
    )}`;
  }

  getAlertSourceDetailsURL(alertSource: AlertSource | null): string {
    if (!alertSource) {
      return '';
    }
    return `${this.baseUrl}/source/view.jsf?id=${encodeURIComponent(
      alertSource.id,
    )}`;
  }

  getEscalationPolicyDetailsURL(escalationPolicy: EscalationPolicy): string {
    return `${this.baseUrl}/policy/view.jsf?id=${encodeURIComponent(
      escalationPolicy.id,
    )}`;
  }

  getUptimeMonitorDetailsURL(uptimeMonitor: UptimeMonitor): string {
    return `${this.baseUrl}/uptime/view.jsf?id=${encodeURIComponent(
      uptimeMonitor.id,
    )}`;
  }

  getScheduleDetailsURL(schedule: Schedule): string {
    return `${this.baseUrl}/schedule/view.jsf?id=${encodeURIComponent(
      schedule.id,
    )}`;
  }

  getUserPhoneNumber(user: User | null) {
    return user?.mobile?.number || user?.landline?.number || '';
  }

  getUserInitials(user: User | null) {
    if (!user) {
      return '';
    }
    if (!user.firstName && !user.lastName) {
      return user.username;
    }
    return `${user.firstName} ${user.lastName} (${user.username})`;
  }

  private async apiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return proxyUrl + this.proxyPath;
  }
}
