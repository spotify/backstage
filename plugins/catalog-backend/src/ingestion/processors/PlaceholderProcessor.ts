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

import { UrlReader } from '@backstage/backend-common';
import { Entity, LocationSpec } from '@backstage/catalog-model';
import { JsonValue } from '@backstage/config';
import yaml from 'yaml';
import { CatalogProcessor } from './types';

export type ResolverRead = (url: string) => Promise<Buffer>;

export type ResolverParams = {
  key: string;
  value: JsonValue;
  baseUrl: string;
  read: ResolverRead;
};

export type PlaceholderResolver = (
  params: ResolverParams,
) => Promise<JsonValue>;

type Options = {
  resolvers: Record<string, PlaceholderResolver>;
  reader: UrlReader;
};

/**
 * Traverses raw entity JSON looking for occurrences of $-prefixed placeholders
 * that it then fills in with actual data.
 */
export class PlaceholderProcessor implements CatalogProcessor {
  constructor(private readonly options: Options) {}

  async preProcessEntity(
    entity: Entity,
    location: LocationSpec,
  ): Promise<Entity> {
    const process = async (data: any): Promise<[any, boolean]> => {
      if (!data || !(data instanceof Object)) {
        // Scalars can't have placeholders
        return [data, false];
      }

      if (Array.isArray(data)) {
        // We're an array - process all entries recursively
        const items = await Promise.all(data.map(item => process(item)));
        return items.every(([, changed]) => !changed)
          ? [data, false]
          : [items.map(([item]) => item), true];
      }

      const keys = Object.keys(data);
      if (!keys.some(k => k.startsWith('$'))) {
        // We're an object but no placeholders at this level - process all
        // entries recursively
        const entries = await Promise.all(
          Object.entries(data).map(([k, v]) =>
            process(v).then(vp => [k, vp] as const),
          ),
        );
        return entries.every(([, [, changed]]) => !changed)
          ? [data, false]
          : [Object.fromEntries(entries.map(([k, [v]]) => [k, v])), true];
      } else if (keys.length !== 1) {
        // This was an object that had more than one key, some of which were
        // dollar prefixed. We only handle the case where there is exactly one
        // such key; anything else is left alone.
        return [data, false];
      }

      const resolverKey = keys[0].substr(1);
      const resolverValue = data[keys[0]];
      const resolver = this.options.resolvers[resolverKey];
      if (!resolver || typeof resolverValue !== 'string') {
        // If there was no such placeholder resolver or if the value was not a
        // string, we err on the side of safety and assume that this is
        // something that's best left alone. For example, if the input contains
        // JSONSchema, there may be "$ref": "#/definitions/node" nodes in the
        // document.
        return [data, false];
      }

      const read = async (url: string): Promise<Buffer> => {
        if (this.options.reader.readUrl) {
          const response = await this.options.reader.readUrl(url);
          const buffer = await response.buffer();
          return buffer;
        }
        return this.options.reader.read(url);
      };

      return [
        await resolver({
          key: resolverKey,
          value: resolverValue,
          baseUrl: location.target,
          read,
        }),
        true,
      ];
    };

    const [result] = await process(entity);
    return result;
  }
}

/*
 * Resolvers
 */

export async function yamlPlaceholderResolver(
  params: ResolverParams,
): Promise<JsonValue> {
  const text = await readTextLocation(params);

  let documents: yaml.Document.Parsed[];
  try {
    documents = yaml.parseAllDocuments(text).filter(d => d);
  } catch (e) {
    throw new Error(
      `Placeholder \$${params.key} failed to parse YAML data at ${params.value}, ${e}`,
    );
  }

  if (documents.length !== 1) {
    throw new Error(
      `Placeholder \$${params.key} expected to find exactly one document of data at ${params.value}, found ${documents.length}`,
    );
  }

  const document = documents[0];

  if (document.errors?.length) {
    throw new Error(
      `Placeholder \$${params.key} found an error in the data at ${params.value}, ${document.errors[0]}`,
    );
  }

  return document.toJSON();
}

export async function jsonPlaceholderResolver(
  params: ResolverParams,
): Promise<JsonValue> {
  const text = await readTextLocation(params);

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(
      `Placeholder \$${params.key} failed to parse JSON data at ${params.value}, ${e}`,
    );
  }
}

export async function textPlaceholderResolver(
  params: ResolverParams,
): Promise<JsonValue> {
  return await readTextLocation(params);
}

/*
 * Helpers
 */

async function readTextLocation(params: ResolverParams): Promise<string> {
  const newUrl = relativeUrl(params);

  try {
    const data = await params.read(newUrl);
    return data.toString('utf-8');
  } catch (e) {
    throw new Error(
      `Placeholder \$${params.key} could not read location ${params.value}, ${e}`,
    );
  }
}

function relativeUrl({ key, value, baseUrl }: ResolverParams): string {
  if (typeof value !== 'string') {
    throw new Error(
      `Placeholder \$${key} expected a string value parameter, in the form of an absolute URL or a relative path`,
    );
  }

  let url: URL;
  try {
    // The two-value form of the URL constructor handles relative paths for us
    url = new URL(value, baseUrl);
  } catch {
    try {
      // Check whether value is a valid absolute URL on it's own, if not fail.
      url = new URL(value);
    } catch {
      // The only remaining case that isn't support is a relative file path that should be
      // resolved using a relative file location. Accessing local file paths can lead to
      // path traversal attacks and access to any file on the host system. Implementing this
      // would require additional security measures.
      throw new Error(
        `Placeholder \$${key} could not form a URL out of ${baseUrl} and ${value}`,
      );
    }
  }

  return url.toString();
}
