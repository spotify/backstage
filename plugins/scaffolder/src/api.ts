/*
 * Copyright 2020 Spotify AB
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

import { EntityName } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/config';
import {
  createApiRef,
  DiscoveryApi,
  IdentityApi,
  Observable,
} from '@backstage/core';
import { ScmIntegrationRegistry } from '@backstage/integration';
import ObservableImpl from 'zen-observable';
import { ListActionsResponse, ScaffolderTask, Status } from './types';

export const scaffolderApiRef = createApiRef<ScaffolderApi>({
  id: 'plugin.scaffolder.service',
  description: 'Used to make requests towards the scaffolder backend',
});

type TemplateParameterSchema = {
  title: string;
  steps: Array<{
    title: string;
    schema: JsonObject;
  }>;
};

export type LogEvent = {
  type: 'log' | 'completion';
  body: {
    message: string;
    stepId?: string;
    status?: Status;
  };
  createdAt: string;
  id: string;
  taskId: string;
};

export interface ScaffolderApi {
  getTemplateParameterSchema(
    templateName: EntityName,
  ): Promise<TemplateParameterSchema>;

  /**
   * Executes the scaffolding of a component, given a template and its
   * parameter values.
   *
   * @param templateName Name of the Template entity for the scaffolder to use. New project is going to be created out of this template.
   * @param values Parameters for the template, e.g. name, description
   */
  scaffold(templateName: string, values: Record<string, any>): Promise<string>;

  getTask(taskId: string): Promise<ScaffolderTask>;

  getIntegrationsList(options: {
    allowedHosts: string[];
  }): Promise<{ type: string; title: string; host: string }[]>;

  // Returns a list of all installed actions.
  listActions(): Promise<ListActionsResponse>;

  streamLogs({
    taskId,
    after,
  }: {
    taskId: string;
    after?: number;
  }): Observable<LogEvent>;
}

export class ScaffolderClient implements ScaffolderApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly scmIntegrationsApi: ScmIntegrationRegistry;

  constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    scmIntegrationsApi: ScmIntegrationRegistry;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
    this.scmIntegrationsApi = options.scmIntegrationsApi;
  }

  async getIntegrationsList(options: { allowedHosts: string[] }) {
    return [
      ...this.scmIntegrationsApi.azure.list(),
      ...this.scmIntegrationsApi.bitbucket.list(),
      ...this.scmIntegrationsApi.github.list(),
      ...this.scmIntegrationsApi.gitlab.list(),
    ]
      .map(c => ({ type: c.type, title: c.title, host: c.config.host }))
      .filter(c => options.allowedHosts.includes(c.host));
  }

  async getTemplateParameterSchema(
    templateName: EntityName,
  ): Promise<TemplateParameterSchema> {
    const { namespace, kind, name } = templateName;

    const token = await this.identityApi.getIdToken();
    const baseUrl = await this.discoveryApi.getBaseUrl('scaffolder');
    const templatePath = [namespace, kind, name]
      .map(s => encodeURIComponent(s))
      .join('/');
    const url = `${baseUrl}/v2/templates/${templatePath}/parameter-schema`;

    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch template parameter schema, ${await response.text()}`,
      );
    }

    const schema: TemplateParameterSchema = await response.json();
    return schema;
  }

  /**
   * Executes the scaffolding of a component, given a template and its
   * parameter values.
   *
   * @param templateName Template name for the scaffolder to use. New project is going to be created out of this template.
   * @param values Parameters for the template, e.g. name, description
   */
  async scaffold(
    templateName: string,
    values: Record<string, any>,
  ): Promise<string> {
    const token = await this.identityApi.getIdToken();
    const url = `${await this.discoveryApi.getBaseUrl('scaffolder')}/v2/tasks`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ templateName, values: { ...values } }),
    });

    if (response.status !== 201) {
      const status = `${response.status} ${response.statusText}`;
      const body = await response.text();
      throw new Error(`Backend request failed, ${status} ${body.trim()}`);
    }

    const { id } = (await response.json()) as { id: string };
    return id;
  }

  async getTask(taskId: string) {
    const token = await this.identityApi.getIdToken();
    const baseUrl = await this.discoveryApi.getBaseUrl('scaffolder');
    const url = `${baseUrl}/v2/tasks/${encodeURIComponent(taskId)}`;
    return fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then(x => x.json());
  }

  streamLogs({
    taskId,
    after,
  }: {
    taskId: string;
    after?: number;
  }): Observable<LogEvent> {
    return new ObservableImpl(subscriber => {
      const params = new URLSearchParams();
      if (after !== undefined) {
        params.set('after', String(Number(after)));
      }

      this.discoveryApi.getBaseUrl('scaffolder').then(
        baseUrl => {
          const url = `${baseUrl}/v2/tasks/${encodeURIComponent(
            taskId,
          )}/eventstream`;
          const eventSource = new EventSource(url, { withCredentials: true });
          eventSource.addEventListener('log', (event: any) => {
            if (event.data) {
              try {
                subscriber.next(JSON.parse(event.data));
              } catch (ex) {
                subscriber.error(ex);
              }
            }
          });
          eventSource.addEventListener('completion', (event: any) => {
            if (event.data) {
              try {
                subscriber.next(JSON.parse(event.data));
              } catch (ex) {
                subscriber.error(ex);
              }
            }
            subscriber.complete();
          });
          eventSource.addEventListener('error', event => {
            subscriber.error(event);
          });
        },
        error => {
          subscriber.error(error);
        },
      );
    });
  }

  /**
   * @returns ListActionsResponse containing all registered actions.
   */
  async listActions(): Promise<ListActionsResponse> {
    const baseUrl = await this.discoveryApi.getBaseUrl('scaffolder');
    const response = await fetch(`${baseUrl}/v2/actions`);
    return await response.json();
  }
}
