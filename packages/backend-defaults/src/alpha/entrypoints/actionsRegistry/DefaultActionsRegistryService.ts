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
  HttpAuthService,
  LoggerService,
  PermissionsRegistryService,
  PermissionsService,
  PluginMetadataService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import PromiseRouter from 'express-promise-router';
import { Router, json } from 'express';
import { z, AnyZodObject } from 'zod/v3';
import zodToJsonSchema from 'zod-to-json-schema';
import type {
  ActionsRegistryActionOptions,
  ActionsRegistryService,
  ActionsServiceAction,
  ActionUi,
} from '@backstage/backend-plugin-api/alpha';
import { InputError, NotAllowedError, NotFoundError } from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { filterActions } from './actionFilters';
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, parse, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

function findPackageRoot(filePath: string): string | undefined {
  let directory = dirname(filePath);
  const root = parse(directory).root;
  while (directory !== root) {
    if (existsSync(resolve(directory, 'package.json'))) {
      return directory;
    }
    directory = dirname(directory);
  }
  return undefined;
}

function findRegistrationPackageRoot(): string | undefined {
  const frameworkRoot = findPackageRoot(__filename);
  for (const line of new Error().stack?.split('\n') ?? []) {
    const match = line.match(
      /(?:\()?((?:file:\/\/\/|[A-Za-z]:[\\/]|\/).+):\d+:\d+\)?$/,
    );
    if (!match) {
      continue;
    }
    const filePath = match[1].startsWith('file:///')
      ? fileURLToPath(match[1])
      : match[1];
    const packageRoot = findPackageRoot(filePath);
    if (packageRoot && packageRoot !== frameworkRoot) {
      return packageRoot;
    }
  }
  return undefined;
}

type RegisteredAction = ActionsRegistryActionOptions<any, any, any> & {
  ui?: ActionUi & { html?: () => Promise<string> };
};
type ActionEntry = [string, RegisteredAction];

export class DefaultActionsRegistryService implements ActionsRegistryService {
  private actions = new Map<string, RegisteredAction>();

  private readonly logger: LoggerService;
  private readonly httpAuth: HttpAuthService;
  private readonly auth: AuthService;
  private readonly config: RootConfigService;
  private readonly metadata: PluginMetadataService;
  private readonly permissions: PermissionsService;
  private readonly permissionsRegistry: PermissionsRegistryService;
  private readonly discovery: DiscoveryService;

  private constructor(
    logger: LoggerService,
    httpAuth: HttpAuthService,
    auth: AuthService,
    config: RootConfigService,
    metadata: PluginMetadataService,
    permissions: PermissionsService,
    permissionsRegistry: PermissionsRegistryService,
    discovery: DiscoveryService,
  ) {
    this.logger = logger;
    this.httpAuth = httpAuth;
    this.auth = auth;
    this.config = config;
    this.metadata = metadata;
    this.permissions = permissions;
    this.permissionsRegistry = permissionsRegistry;
    this.discovery = discovery;
  }

  static create({
    httpAuth,
    logger,
    auth,
    config,
    metadata,
    permissions,
    permissionsRegistry,
    discovery,
  }: {
    httpAuth: HttpAuthService;
    logger: LoggerService;
    auth: AuthService;
    config: RootConfigService;
    metadata: PluginMetadataService;
    permissions: PermissionsService;
    permissionsRegistry: PermissionsRegistryService;
    discovery: DiscoveryService;
  }): DefaultActionsRegistryService {
    return new DefaultActionsRegistryService(
      logger,
      httpAuth,
      auth,
      config,
      metadata,
      permissions,
      permissionsRegistry,
      discovery,
    );
  }

  createRouter(): Router {
    const router = PromiseRouter();
    router.use('/.backstage/actions/', json());

    router.get('/.backstage/actions/v1/actions', async (req, res) => {
      const credentials = await this.httpAuth.credentials(req);
      const entries = Array.from(this.actions.entries()).filter(entry =>
        this.isActionAllowed(entry),
      );

      const allowedActions = await this.filterByPermissions(
        entries,
        credentials,
      );

      return res.json({
        actions: allowedActions.map(([id, action]) => ({
          id,
          name: action.name,
          title: action.title,
          description: action.description,
          pluginId: this.metadata.getId(),
          attributes: this.toActionAttributes(action),
          examples: action.examples,
          ...(action.ui && {
            ui: {
              hasResource: Boolean(action.ui.html),
              ...(action.ui.csp && { csp: action.ui.csp }),
              ...(action.ui.permissions && {
                permissions: action.ui.permissions,
              }),
              ...(action.ui.visibility && {
                visibility: action.ui.visibility,
              }),
            },
          }),
          schema: {
            input: action.schema?.input
              ? zodToJsonSchema(action.schema.input(z))
              : zodToJsonSchema(z.object({})),
            output: action.schema?.output
              ? zodToJsonSchema(action.schema.output(z))
              : zodToJsonSchema(z.object({})),
            ...(action.schema?.secrets && {
              secrets: zodToJsonSchema(action.schema.secrets(z)),
            }),
          },
        })),
      });
    });

    router.get('/.backstage/actions/v1/status', async (req, res) => {
      await this.httpAuth.credentials(req, { allow: ['service'] });

      return res.json({
        hasActions: this.actions.size > 0,
      });
    });

    router.get(
      '/.backstage/actions/v1/actions/:actionId/ui',
      async (req, res) => {
        const credentials = await this.httpAuth.credentials(req);
        if (this.auth.isPrincipal(credentials, 'none')) {
          throw new NotAllowedError(
            'Action UIs must be read by an authenticated principal',
          );
        }
        const action = this.actions.get(req.params.actionId);
        const [visible] =
          action && this.isActionAllowed([req.params.actionId, action])
            ? await this.filterByPermissions(
                [[req.params.actionId, action]],
                credentials,
              )
            : [];
        const visibleAction = visible?.[1];
        if (!visibleAction?.ui?.html) {
          throw new NotFoundError(
            `UI for action "${req.params.actionId}" not found`,
          );
        }
        let csp = visibleAction.ui.csp;
        try {
          const externalUrl = await this.discovery.getExternalBaseUrl(
            this.metadata.getId(),
          );
          const origin = new URL(externalUrl).origin;
          const existing = csp?.connectDomains ?? [];
          if (!existing.includes(origin)) {
            csp = { ...csp, connectDomains: [...existing, origin] };
          }
        } catch (error) {
          this.logger.warn(
            'Failed to add the plugin origin to action UI CSP',
            error,
          );
        }
        return res.json({
          html: await visibleAction.ui.html(),
          csp,
          permissions: visibleAction.ui.permissions,
        });
      },
    );

    const invokeHandler =
      (opts: { wrapped: boolean }) =>
      async (
        req: import('express').Request,
        res: import('express').Response,
      ) => {
        const credentials = await this.httpAuth.credentials(req);
        if (this.auth.isPrincipal(credentials, 'none')) {
          throw new NotAllowedError(
            `Actions must be invoked by an authenticated principal, not an anonymous request`,
          );
        }

        const action = this.actions.get(req.params.actionId);

        if (!action) {
          throw new NotFoundError(`Action "${req.params.actionId}" not found`);
        }

        if (!this.isActionAllowed([req.params.actionId, action])) {
          throw new NotFoundError(`Action "${req.params.actionId}" not found`);
        }

        if (action.visibilityPermission) {
          const [decision] = await this.permissions.authorize(
            [{ permission: action.visibilityPermission }],
            { credentials },
          );
          if (decision.result !== AuthorizeResult.ALLOW) {
            throw new NotFoundError(
              `Action "${req.params.actionId}" not found`,
            );
          }
        }

        const rawInput = opts.wrapped ? req.body.input : req.body;
        const rawSecrets = opts.wrapped ? req.body.secrets : undefined;

        const input = action.schema?.input
          ? action.schema.input(z).safeParse(rawInput)
          : ({ success: true, data: undefined } as const);

        if (!input.success) {
          throw new InputError(
            `Invalid input to action "${req.params.actionId}"`,
            input.error,
          );
        }

        if (action.schema?.secrets && !rawSecrets) {
          throw new InputError(
            `Action "${req.params.actionId}" requires secrets but none were provided`,
          );
        }

        if (!action.schema?.secrets && rawSecrets) {
          throw new InputError(
            `Action "${req.params.actionId}" does not accept secrets`,
          );
        }

        const secrets = action.schema?.secrets
          ? action.schema.secrets(z).safeParse(rawSecrets)
          : ({ success: true, data: undefined } as const);

        if (!secrets.success) {
          throw new InputError(
            `Invalid secrets for action "${req.params.actionId}"`,
            secrets.error,
          );
        }

        const controller = new AbortController();
        const abort = () =>
          controller.abort(new Error('Action request was cancelled'));
        const close = () => {
          if (!res.writableEnded) {
            abort();
          }
        };
        req.once('aborted', abort);
        res.once('close', close);
        let result;
        try {
          result = await action.action({
            input: input.data,
            secrets: secrets.data,
            credentials,
            logger: this.logger,
            signal: controller.signal,
          });
        } finally {
          req.off('aborted', abort);
          res.off('close', close);
        }

        const output = action.schema?.output
          ? action.schema.output(z).safeParse(result?.output)
          : ({ success: true, data: result?.output } as const);

        if (!output.success) {
          throw new InputError(
            `Invalid output from action "${req.params.actionId}"`,
            output.error,
          );
        }

        res.json({ output: output.data });
      };

    // Deprecated: remove v1 invoke route once all callers have migrated to v2
    router.post(
      '/.backstage/actions/v1/actions/:actionId/invoke',
      invokeHandler({ wrapped: false }),
    );

    router.post(
      '/.backstage/actions/v2/actions/:actionId/invoke',
      invokeHandler({ wrapped: true }),
    );

    return router;
  }

  register<
    TInputSchema extends AnyZodObject,
    TOutputSchema extends AnyZodObject,
    TSecretsSchema extends AnyZodObject | undefined = undefined,
  >(
    options: ActionsRegistryActionOptions<
      TInputSchema,
      TOutputSchema,
      TSecretsSchema
    >,
  ): void {
    const id = `${this.metadata.getId()}:${options.name}`;

    if (this.actions.has(id)) {
      throw new Error(`Action with id "${id}" is already registered`);
    }

    if (options.visibilityPermission) {
      this.permissionsRegistry.addPermissions([options.visibilityPermission]);
    }

    let registered: RegisteredAction = options;
    if (options.ui?.component) {
      const packageRoot = findRegistrationPackageRoot();
      if (!packageRoot) {
        throw new Error(
          `Unable to locate the declaring package for ${id} action UI`,
        );
      } else {
        const outputRoot = resolve(packageRoot, 'dist', 'action-ui');
        const manifestPath = resolve(outputRoot, 'manifest.json');
        let registeredManifest: any;
        try {
          registeredManifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
        } catch {
          throw new Error(`Action UI manifest not found at ${manifestPath}`);
        }
        if (
          registeredManifest?.version !== 1 ||
          typeof registeredManifest.resources?.[options.name]?.path !== 'string'
        ) {
          throw new Error(
            `Action UI '${options.name}' is not present in ${manifestPath}`,
          );
        }
        const loadHtml = async () => {
          let manifest: any;
          try {
            manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
          } catch {
            throw new NotFoundError(
              `Action UI manifest not found at ${manifestPath}`,
            );
          }
          const relativePath =
            manifest?.version === 1
              ? manifest.resources?.[options.name]?.path
              : undefined;
          if (typeof relativePath !== 'string') {
            throw new NotFoundError(
              `Action UI '${options.name}' is not present in ${manifestPath}`,
            );
          }
          const htmlPath = resolve(outputRoot, relativePath);
          if (!htmlPath.startsWith(`${outputRoot}${sep}`)) {
            throw new InputError(
              `Action UI '${options.name}' resolves outside its output directory`,
            );
          }
          return readFile(htmlPath, 'utf8');
        };
        registered = {
          ...options,
          ui: {
            ...options.ui,
            html: loadHtml,
          },
        };
      }
    }
    this.actions.set(id, registered);
  }

  private isActionAllowed([id, action]: ActionEntry): boolean {
    const pluginSources = this.config.getOptionalStringArray(
      'backend.actions.pluginSources',
    );

    if (pluginSources && !pluginSources.includes(this.metadata.getId())) {
      return false;
    }

    return (
      filterActions(this.config, [
        {
          id,
          attributes: this.toActionAttributes(action),
        },
      ]).length === 1
    );
  }

  private toActionAttributes(
    action: ActionEntry[1],
  ): ActionsServiceAction['attributes'] {
    // Resolve optional attributes to the values exposed by ActionsService.
    return {
      destructive:
        action.attributes?.destructive ?? !action.attributes?.readOnly,
      idempotent: action.attributes?.idempotent ?? false,
      readOnly: action.attributes?.readOnly ?? false,
    };
  }

  private async filterByPermissions(
    entries: ActionEntry[],
    credentials: BackstageCredentials,
  ): Promise<ActionEntry[]> {
    const permissionedEntries = entries.filter(
      ([_, action]) => action.visibilityPermission,
    );

    if (permissionedEntries.length === 0) {
      return entries;
    }

    const decisions = await this.permissions.authorize(
      permissionedEntries.map(([_, action]) => ({
        permission: action.visibilityPermission!,
      })),
      { credentials },
    );

    const deniedIds = new Set(
      permissionedEntries
        .filter((_, index) => decisions[index].result !== AuthorizeResult.ALLOW)
        .map(([id]) => id),
    );

    return entries.filter(([id]) => !deniedIds.has(id));
  }
}
