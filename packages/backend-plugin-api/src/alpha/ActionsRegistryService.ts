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
import { z, AnyZodObject } from 'zod/v3';
import { BasicPermission } from '@backstage/plugin-permission-common';
import {
  LoggerService,
  BackstageCredentials,
} from '@backstage/backend-plugin-api';

/**
 * @alpha
 */
export type ActionsRegistryActionContext<
  TInputSchema extends AnyZodObject,
  TSecretsSchema extends AnyZodObject | undefined = undefined,
> = {
  input: z.infer<TInputSchema>;
  secrets: TSecretsSchema extends AnyZodObject
    ? z.infer<TSecretsSchema>
    : undefined;
  logger: LoggerService;
  credentials: BackstageCredentials;
  /** Signal that is aborted when the caller cancels the action invocation. */
  signal?: AbortSignal;
};

/**
 * Browser security and client visibility metadata for an action UI.
 *
 * @alpha
 */
export type ActionUiMetadata = {
  csp?: {
    connectDomains?: string[];
    resourceDomains?: string[];
    frameDomains?: string[];
    baseUriDomains?: string[];
  };
  permissions?: {
    camera?: Record<string, never>;
    microphone?: Record<string, never>;
    geolocation?: Record<string, never>;
    clipboardWrite?: Record<string, never>;
  };
  visibility?: Array<'model' | 'app'>;
};

/**
 * Declares a React UI that accompanies an action.
 *
 * The component loader is discovered and bundled by Backstage build tooling.
 * Declare it inline on an action with a literal name using
 * `() => import('./module').then(module => module.Component)`. The build fails
 * when the declaration cannot be statically resolved. Its resource identity is
 * derived from the registered action name.
 *
 * @alpha
 */
export type ActionUi = ActionUiMetadata & {
  component?: () => Promise<unknown>;
};

/**
 * An example of how to use an action registered in the actions registry.
 *
 * @alpha
 */
export type ActionsRegistryActionExample<
  TInputSchema extends AnyZodObject,
  TOutputSchema extends AnyZodObject,
> = {
  title: string;
  description?: string;
  input: z.infer<TInputSchema>;
  output?: z.infer<TOutputSchema>;
};

/**
 * @alpha
 */
export type ActionsRegistryActionOptions<
  TInputSchema extends AnyZodObject,
  TOutputSchema extends AnyZodObject,
  TSecretsSchema extends AnyZodObject | undefined = undefined,
> = {
  name: string;
  title: string;
  description: string;
  schema: {
    input: (zod: typeof z) => TInputSchema;
    output: (zod: typeof z) => TOutputSchema;
    secrets?: (
      zod: typeof z,
    ) => TSecretsSchema extends AnyZodObject ? TSecretsSchema : never;
  };
  examples?: Array<ActionsRegistryActionExample<TInputSchema, TOutputSchema>>;
  visibilityPermission?: BasicPermission;
  ui?: ActionUi;
  attributes?: {
    /**
     * Whether the action may perform destructive updates. Defaults to `false`
     * when `readOnly` is `true`, and `true` otherwise.
     */
    destructive?: boolean;
    idempotent?: boolean;
    /** Whether the action only reads from its environment. Defaults to `false`. */
    readOnly?: boolean;
  };
  action: (
    context: ActionsRegistryActionContext<TInputSchema, TSecretsSchema>,
  ) => Promise<
    z.infer<TOutputSchema> extends void
      ? void
      : { output: z.infer<TOutputSchema> }
  >;
};

/**
 * @alpha
 */
export interface ActionsRegistryService {
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
  ): void;
}
