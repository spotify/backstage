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
  BackstageCredentials,
  LoggerService,
  AuditorService,
} from '@backstage/backend-plugin-api';
import type { Request } from 'express';
import { Server as McpServer } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
  ToolSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { JsonObject } from '@backstage/types';
import {
  ActionsService,
  ActionsServiceAction,
  MetricsServiceHistogram,
  MetricsService,
  TracingService,
} from '@backstage/backend-plugin-api/alpha';
import { version } from '@backstage/plugin-mcp-actions-backend/package.json';
import { NotFoundError, toError } from '@backstage/errors';
import { performance } from 'node:perf_hooks';

import { handleErrors } from './handleErrors';
import { bucketBoundaries, McpServerOperationAttributes } from '../metrics';
import { FilterRule, McpServerConfig } from '../config';

const actionUiMimeType = 'text/html;profile=mcp-app';
const legacyResourceUriKey = 'ui/resourceUri';
const actionIdPattern = /^[a-z0-9._-]+[:.][a-z0-9._-]+$/;

function normalizeActionId(actionId: string): string | undefined {
  const normalized = actionId.trim().toLowerCase();
  if (!actionIdPattern.test(normalized)) {
    return undefined;
  }
  if (normalized.includes(':')) {
    return normalized;
  }
  const separator = normalized.indexOf('.');
  return `${normalized.slice(0, separator)}:${normalized.slice(separator + 1)}`;
}

function getUiResourceUri(actionId: string): string | undefined {
  const normalized = normalizeActionId(actionId);
  if (!normalized) {
    return undefined;
  }
  const separator = normalized.indexOf(':');
  const plugin = normalized.slice(0, separator);
  const action = normalized.slice(separator + 1);
  return `ui://${plugin}/${action}.html`;
}

function getActionIdFromResourceUri(uri: string): string | undefined {
  const match = uri.match(/^ui:\/\/([a-z0-9._-]+)\/([a-z0-9._-]+)\.html$/);
  return match ? `${match[1]}:${match[2]}` : undefined;
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

// Baggage is propagated from untrusted callers, so we forward only an
// explicit allowlist of low-cardinality identifier keys from the OTel
// `gen_ai.*` registry.
const PROPAGATED_BAGGAGE_ATTRIBUTES: ReadonlySet<string> = new Set([
  'gen_ai.agent.id',
  'gen_ai.agent.name',
  'gen_ai.conversation.id',
  'gen_ai.provider.name',
  'gen_ai.request.model',
]);

// Cap each forwarded baggage value before it lands on a span attribute.
// Baggage values are caller-controlled strings of unbounded length;
// allowlisting keys protects against arbitrary attribute names but not
// against pathologically large values inflating exported span sizes.
const BAGGAGE_ATTRIBUTE_VALUE_MAX_LENGTH = 256;

function baggageAttributes(
  tracingService: TracingService,
): Record<string, string> {
  const baggage = tracingService.propagation.getActiveBaggage();
  if (!baggage) return {};
  const attrs: Record<string, string> = {};
  for (const [key, entry] of baggage.getAllEntries()) {
    if (PROPAGATED_BAGGAGE_ATTRIBUTES.has(key)) {
      attrs[key] = entry.value.slice(0, BAGGAGE_ATTRIBUTE_VALUE_MAX_LENGTH);
    }
  }
  return attrs;
}

export class McpService {
  private readonly actions: ActionsService;
  private readonly logger: LoggerService | undefined;
  private readonly auditor: AuditorService;
  private readonly namespacedToolNames: boolean;
  private readonly tracingService: TracingService;
  private readonly captureToolPayloads: boolean;
  private readonly operationDuration: MetricsServiceHistogram<McpServerOperationAttributes>;
  private readonly warnedSkippedActionIds = new Set<string>();

  constructor(
    actions: ActionsService,
    metrics: MetricsService,
    tracingService: TracingService,
    logger: LoggerService | undefined,
    auditor: AuditorService,
    namespacedToolNames?: boolean,
    captureToolPayloads?: boolean,
  ) {
    this.actions = actions;
    this.logger = logger;
    this.auditor = auditor;
    this.namespacedToolNames = namespacedToolNames ?? true;
    this.tracingService = tracingService;
    this.captureToolPayloads = captureToolPayloads ?? false;
    this.operationDuration =
      metrics.createHistogram<McpServerOperationAttributes>(
        'mcp.server.operation.duration',
        {
          description: 'MCP request duration as observed on the receiver',
          unit: 's',
          advice: { explicitBucketBoundaries: bucketBoundaries },
        },
      );
  }

  static async create({
    actions,
    metrics,
    tracingService,
    logger,
    auditor,
    namespacedToolNames,
    captureToolPayloads,
  }: {
    actions: ActionsService;
    metrics: MetricsService;
    tracingService: TracingService;
    logger?: LoggerService;
    auditor: AuditorService;
    namespacedToolNames?: boolean;
    captureToolPayloads?: boolean;
  }) {
    return new McpService(
      actions,
      metrics,
      tracingService,
      logger,
      auditor,
      namespacedToolNames,
      captureToolPayloads,
    );
  }

  getServer({
    credentials,
    serverConfig,
    req,
  }: {
    credentials: BackstageCredentials;
    serverConfig?: McpServerConfig;
    req?: Request;
  }) {
    const server = new McpServer(
      {
        name: serverConfig?.name ?? 'backstage',
        version,
        ...(serverConfig?.description && {
          description: serverConfig.description,
        }),
      },
      {
        capabilities: { tools: {}, resources: {} },
        ...(serverConfig?.instructions && {
          instructions: serverConfig.instructions,
        }),
      },
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => {
      const startTime = performance.now();
      let errorType: string | undefined;

      const auditorEvent = await this.auditor.createEvent({
        eventId: 'tool-discovery',
        ...(req && { request: req }),
      });

      try {
        const { actions: allActions } = await this.actions.list({
          credentials,
        });
        const actions = serverConfig
          ? this.filterActions(allActions, serverConfig)
          : allActions;

        const tools: Tool[] = [];
        for (const action of actions) {
          const resourceUri = action.ui?.hasResource
            ? getUiResourceUri(action.id)
            : undefined;
          const tool = {
            inputSchema: action.schema.input,
            name: this.getToolName(action),
            description: action.description,
            annotations: {
              title: action.title,
              destructiveHint: action.attributes.destructive,
              idempotentHint: action.attributes.idempotent,
              readOnlyHint: action.attributes.readOnly,
              openWorldHint: false,
            },
            ...(action.ui && {
              _meta: {
                ui: {
                  ...(action.ui.visibility && {
                    visibility: action.ui.visibility,
                  }),
                  ...(resourceUri && { resourceUri }),
                },
                ...(resourceUri && {
                  [legacyResourceUriKey]: resourceUri,
                }),
              },
            }),
          };

          // Validate each tool against the MCP Tool schema so that a single
          // malformed action (e.g. an inputSchema that isn't a JSON Schema
          // object at the root) doesn't poison the whole tools/list response.
          const parsed = ToolSchema.safeParse(tool);
          if (!parsed.success) {
            if (!this.warnedSkippedActionIds.has(action.id)) {
              this.warnedSkippedActionIds.add(action.id);
              this.logger?.warn(
                `Skipping MCP tool for action "${action.id}": ${parsed.error.message}`,
              );
            }
            continue;
          }

          tools.push(parsed.data);
        }

        await auditorEvent.success({ meta: { toolCount: tools.length } });

        return { tools };
      } catch (err) {
        errorType = err instanceof Error ? err.name : 'Error';
        await auditorEvent.fail({
          error: toError(err),
        });
        throw err;
      } finally {
        const durationSeconds = (performance.now() - startTime) / 1000;

        this.operationDuration.record(durationSeconds, {
          'mcp.method.name': 'tools/list',
          ...(errorType && { 'error.type': errorType }),
        });
      }
    });

    server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const { actions: allActions } = await this.actions.list({ credentials });
      const actions = serverConfig
        ? this.filterActions(allActions, serverConfig)
        : allActions;
      return {
        resources: actions.flatMap(action => {
          const uri = action.ui?.hasResource
            ? getUiResourceUri(action.id)
            : undefined;
          return uri
            ? [
                {
                  uri,
                  name: action.id,
                  title: action.title,
                  description: action.description,
                  mimeType: actionUiMimeType,
                  _meta: { ui: { prefersBorder: false } },
                },
              ]
            : [];
        }),
      };
    });

    server.setRequestHandler(ReadResourceRequestSchema, async ({ params }) => {
      const actionId = getActionIdFromResourceUri(params.uri);
      const { actions: allActions } = await this.actions.list({ credentials });
      const actions = serverConfig
        ? this.filterActions(allActions, serverConfig)
        : allActions;
      const action = actionId
        ? actions.find(
            candidate => normalizeActionId(candidate.id) === actionId,
          )
        : undefined;
      if (!action?.ui?.hasResource || !this.actions.readUi) {
        throw new NotFoundError(`Resource "${params.uri}" not found`);
      }
      const ui = await this.actions.readUi({ id: action.id, credentials });
      return {
        contents: [
          {
            uri: params.uri,
            mimeType: actionUiMimeType,
            text: ui.html,
            _meta: {
              ui: {
                prefersBorder: false,
                ...(ui.csp && { csp: ui.csp }),
                ...(ui.permissions && { permissions: ui.permissions }),
              },
            },
          },
        ],
      };
    });

    server.setRequestHandler(
      CallToolRequestSchema,
      async ({ params }, extra) => {
        const startTime = performance.now();
        let errorType: string | undefined;
        let isError = false;

        const auditorEvent = await this.auditor.createEvent({
          eventId: 'tool-execution',
          severityLevel: 'medium',
          ...(req && { request: req }),
          meta: { toolName: params.name },
        });

        try {
          return await this.tracingService.startActiveSpan(
            `tools/call ${params.name}`,
            {
              kind: 'server',
              credentials,
              attributes: {
                ...baggageAttributes(this.tracingService),
                'mcp.method.name': 'tools/call',
                'gen_ai.tool.name': params.name,
                'gen_ai.operation.name': 'execute_tool',
                ...(this.captureToolPayloads && {
                  'gen_ai.tool.call.arguments': safeStringify(params.arguments),
                }),
              },
            },
            async span => {
              const result = await handleErrors(async () => {
                const { actions: allActions } = await this.actions.list({
                  credentials,
                });
                const actions = serverConfig
                  ? this.filterActions(allActions, serverConfig)
                  : allActions;

                const action = actions.find(
                  a => this.getToolName(a) === params.name,
                );

                if (!action) {
                  throw new NotFoundError(`Action "${params.name}" not found`);
                }

                // Re-attribute the span to the plugin that owns the action.
                // This runs after the span has started, so head-based samplers
                // still see the default `mcp-actions` value when deciding
                // whether to record the span. The pluginId is only known after
                // resolving the action via `actions.list`, so the reattribution
                // is unavoidable.
                span.setAttribute('backstage.plugin.id', action.pluginId);

                const { output } = await this.actions.invoke({
                  id: action.id,
                  input: params.arguments as JsonObject,
                  credentials,
                  signal: extra.signal,
                });

                if (this.captureToolPayloads) {
                  span.setAttribute(
                    'gen_ai.tool.call.result',
                    safeStringify(output),
                  );
                }

                return {
                  content: [
                    {
                      type: 'text',
                      text: safeStringify(output),
                    },
                  ],
                  structuredContent: output,
                };
              });

              isError = !!(result as { isError?: boolean })?.isError;

              if (isError) {
                span.setAttribute('error.type', 'tool_error');
                span.setStatus({ code: 'error', message: 'tool_error' });
                const errorDescription =
                  (result as { errorDescription?: string })?.errorDescription ??
                  `Tool "${params.name}" reported isError=true`;

                await auditorEvent.fail({
                  error: new Error(errorDescription),
                });
              } else {
                await auditorEvent.success();
              }

              return result;
            },
          );
        } catch (err) {
          errorType = err instanceof Error ? err.name : 'Error';
          if (!isError) {
            await auditorEvent.fail({
              error: toError(err),
            });
          }
          throw err;
        } finally {
          const durationSeconds = (performance.now() - startTime) / 1000;

          // Determine error.type per OTel MCP spec:
          // - Thrown exceptions use the error name
          // - CallToolResult with isError=true uses 'tool_error'
          let errorAttribute: string | undefined = errorType;
          if (!errorAttribute && isError) {
            errorAttribute = 'tool_error';
          }

          this.operationDuration.record(durationSeconds, {
            'mcp.method.name': 'tools/call',
            'gen_ai.tool.name': params.name,
            'gen_ai.operation.name': 'execute_tool',
            ...(errorAttribute && { 'error.type': errorAttribute }),
          });
        }
      },
    );

    return server;
  }

  private filterActions(
    actions: ActionsServiceAction[],
    serverConfig: McpServerConfig,
  ): ActionsServiceAction[] {
    const { includeRules, excludeRules } = serverConfig;
    if (includeRules.length === 0 && excludeRules.length === 0) {
      return actions;
    }

    return actions.filter(action => {
      if (excludeRules.some(rule => this.matchesRule(action, rule))) {
        return false;
      }

      if (includeRules.length === 0) {
        return true;
      }

      return includeRules.some(rule => this.matchesRule(action, rule));
    });
  }

  private getToolName(action: ActionsServiceAction): string {
    if (this.namespacedToolNames) {
      return `${action.pluginId}.${action.name}`;
    }
    return action.name;
  }

  private matchesRule(action: ActionsServiceAction, rule: FilterRule): boolean {
    if (rule.idMatcher && !rule.idMatcher.match(action.id)) {
      return false;
    }

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
