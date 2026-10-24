/*
 * Copyright 2025 The Backstage Authors
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
  AuthService,
  BackstageCredentials,
  DiscoveryService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { ResponseError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import {
  ActionsService,
  ActionsServiceAction,
} from '@backstage/backend-plugin-api/alpha';
import { Minimatch } from 'minimatch';
import { Config } from '@backstage/config';

export class DefaultActionsService implements ActionsService {
  private readonly discovery: DiscoveryService;
  private readonly config: RootConfigService;
  private readonly logger: LoggerService;
  private readonly auth: AuthService;

  private constructor(
    discovery: DiscoveryService,
    config: RootConfigService,
    logger: LoggerService,
    auth: AuthService,
  ) {
    this.discovery = discovery;
    this.config = config;
    this.logger = logger;
    this.auth = auth;
  }

  static create({
    discovery,
    config,
    logger,
    auth,
  }: {
    discovery: DiscoveryService;
    config: RootConfigService;
    logger: LoggerService;
    auth: AuthService;
  }) {
    return new DefaultActionsService(discovery, config, logger, auth);
  }

  async list({ credentials }: { credentials: BackstageCredentials }) {
    const pluginSources =
      this.config.getOptionalStringArray('backend.actions.pluginSources') ?? [];

    const remoteActionsList = await Promise.all(
      pluginSources.map(async source => {
        try {
          const response = await this.makeRequest({
            path: `/.backstage/actions/v1/actions`,
            pluginId: source,
            credentials,
          });
          if (!response.ok) {
            throw await ResponseError.fromResponse(response);
          }
          const { actions } = (await response.json()) as {
            actions: ActionsServiceAction;
          };

          return actions;
        } catch (error) {
          this.logger.warn(`Failed to fetch actions from ${source}`, error);
          return [];
        }
      }),
    );

    return { actions: this.applyFilters(remoteActionsList.flat()) };
  }

  async invoke(opts: {
    id: string;
    input?: JsonObject;
    secrets?: JsonObject;
    credentials: BackstageCredentials;
    signal?: AbortSignal;
  }) {
    const pluginId = this.pluginIdFromActionId(opts.id);
    // Deprecated: remove v1 fallback once all registries support v2
    const version = opts.secrets ? 'v2' : 'v1';
    const body =
      version === 'v2'
        ? JSON.stringify({ input: opts.input, secrets: opts.secrets })
        : JSON.stringify(opts.input);

    const response = await this.makeRequest({
      path: `/.backstage/actions/${version}/actions/${encodeURIComponent(
        opts.id,
      )}/invoke`,
      pluginId,
      credentials: opts.credentials,
      options: {
        method: 'POST',
        body,
        signal: opts.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const { output } = await response.json();
    return { output };
  }

  async readUi(opts: { id: string; credentials: BackstageCredentials }) {
    const response = await this.makeRequest({
      path: `/.backstage/actions/v1/actions/${encodeURIComponent(opts.id)}/ui`,
      pluginId: this.pluginIdFromActionId(opts.id),
      credentials: opts.credentials,
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    const result = await response.json();
    if (!result || typeof result !== 'object' || !('html' in result)) {
      throw new Error(`Action ${opts.id} returned an invalid UI`);
    }
    const { html, csp, permissions } = result as {
      html: unknown;
      csp?: unknown;
      permissions?: unknown;
    };
    if (typeof html !== 'string') {
      throw new Error(`Action ${opts.id} returned an invalid UI`);
    }
    return { html, csp, permissions } as Awaited<
      ReturnType<NonNullable<ActionsService['readUi']>>
    >;
  }

  private async makeRequest(opts: {
    path: string;
    pluginId: string;
    options?: RequestInit;
    credentials: BackstageCredentials;
  }) {
    const { path, pluginId, credentials, options } = opts;
    const baseUrl = await this.discovery.getBaseUrl(pluginId);

    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: credentials,
      targetPluginId: opts.pluginId,
    });

    return fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private pluginIdFromActionId(id: string): string {
    const colonIndex = id.indexOf(':');
    if (colonIndex === -1) {
      throw new Error(`Invalid action id: ${id}`);
    }
    return id.substring(0, colonIndex);
  }

  private applyFilters(
    actions: ActionsServiceAction[],
  ): ActionsServiceAction[] {
    const filterConfig = this.config.getOptionalConfig(
      'backend.actions.filter',
    );

    if (!filterConfig) {
      return actions;
    }

    const includeRules = this.parseFilterRules(
      filterConfig.getOptionalConfigArray('include') ?? [],
    );
    const excludeRules = this.parseFilterRules(
      filterConfig.getOptionalConfigArray('exclude') ?? [],
    );

    return actions.filter(action => {
      const excluded = excludeRules.some(rule =>
        this.matchesRule(action, rule),
      );

      if (excluded) {
        return false;
      }

      // If no include rules, include by default
      if (includeRules.length === 0) {
        return true;
      }

      // Must match at least one include rule
      return includeRules.some(rule => this.matchesRule(action, rule));
    });
  }

  private parseFilterRules(configArray: Array<Config>): Array<{
    idMatcher?: Minimatch;
    attributes?: Partial<
      Record<'destructive' | 'readOnly' | 'idempotent', boolean>
    >;
  }> {
    return configArray.map(ruleConfig => {
      const idPattern = ruleConfig.getOptionalString('id');
      const attributesConfig = ruleConfig.getOptionalConfig('attributes');

      const rule: {
        idMatcher?: Minimatch;
        attributes?: Partial<
          Record<'destructive' | 'readOnly' | 'idempotent', boolean>
        >;
      } = {};

      if (idPattern) {
        rule.idMatcher = new Minimatch(idPattern);
      }

      if (attributesConfig) {
        rule.attributes = {};
        for (const key of ['destructive', 'readOnly', 'idempotent'] as const) {
          const value = attributesConfig.getOptionalBoolean(key);
          if (value !== undefined) {
            rule.attributes[key] = value;
          }
        }
      }

      return rule;
    });
  }

  private matchesRule(
    action: ActionsServiceAction,
    rule: {
      idMatcher?: Minimatch;
      attributes?: Partial<
        Record<'destructive' | 'readOnly' | 'idempotent', boolean>
      >;
    },
  ): boolean {
    // If id pattern is specified, it must match
    if (rule.idMatcher && !rule.idMatcher.match(action.id)) {
      return false;
    }

    // If attributes are specified, all must match
    if (rule.attributes) {
      for (const [key, value] of Object.entries(rule.attributes)) {
        if (
          action.attributes[
            key as 'destructive' | 'readOnly' | 'idempotent'
          ] !== value
        ) {
          return false;
        }
      }
    }

    return true;
  }
}
