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

export type JsonPrimitive = number | string | boolean | null;
export type JsonObject = { [key in string]?: JsonValue };
export interface JsonArray extends Array<JsonValue> {}
export type JsonValue = JsonObject | JsonArray | JsonPrimitive;

export type AppConfig = {
  context: string;
  data: JsonObject;
};

export type Config = {
  has(key: string): boolean;

  keys(): string[];

  get<T = JsonValue>(key?: string): T;
  getOptional<T = JsonValue>(key?: string): T | undefined;

  getConfig(key: string): Config;
  getOptionalConfig(key: string): Config | undefined;

  getConfigArray(key: string): Config[];
  getOptionalConfigArray(key: string): Config[] | undefined;

  getNumber(key: string): number;
  getOptionalNumber(key: string): number | undefined;

  getBoolean(key: string): boolean;
  getOptionalBoolean(key: string): boolean | undefined;

  getString(key: string): string;
  getOptionalString(key: string): string | undefined;

  getStringArray(key: string): string[];
  getOptionalStringArray(key: string): string[] | undefined;
};
