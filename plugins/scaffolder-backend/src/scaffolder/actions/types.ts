/*
 * Copyright 2021 Spotify AB
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

import { Logger } from 'winston';
import { Writable } from 'stream';
import { JsonValue, JsonObject } from '@backstage/config';
import { Schema } from 'jsonschema';

type PartialJsonObject = Partial<JsonObject>;
type PartialJsonValue = PartialJsonObject | JsonValue | undefined;
export type InputBase = Partial<{ [name: string]: PartialJsonValue }>;

export type ActionContext<Input extends InputBase> = {
  /**
   * Base URL for the location of the task spec, typically the url of the source entity file.
   */
  baseUrl?: string;

  logger: Logger;
  logStream: Writable;

  /**
   * User token forwarded from initial request, for use in subsequent api requests
   */
  token?: string | undefined;
  workspacePath: string;
  input: Input;
  output(name: string, value: JsonValue): void;

  /**
   * Creates a temporary directory for use by the action, which is then cleaned up automatically.
   */
  createTemporaryDirectory(): Promise<string>;
};

export type TemplateAction<Input extends InputBase> = {
  id: string;
  description?: string;
  schema?: {
    input?: Schema;
    output?: Schema;
  };
  handler: (ctx: ActionContext<Input>) => Promise<void>;
};
