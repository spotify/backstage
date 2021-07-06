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

import { Config } from '@backstage/config';
import { CorsOptions } from 'cors';

export type BaseOptions = {
  listenPort?: string | number;
  listenHost?: string;
};

export type HttpsSettings = {
  certificate: CertificateGenerationOptions | CertificateReferenceOptions;
};

export type CertificateReferenceOptions = {
  key: string;
  cert: string;
};

export type CertificateGenerationOptions = {
  hostname: string;
};

export type CertificateAttributes = {
  commonName: string;
};

/**
 * A map from CSP directive names to their values.
 *
 * Added here since helmet doesn't export this type publicly.
 */
export type CspOptions = Record<string, string[]>;

/**
 * Reads some base options out of a config object.
 *
 * @param config The root of a backend config object
 * @returns A base options object
 *
 * @example
 * ```json
 * {
 *   baseUrl: "http://localhost:7000",
 *   listen: "0.0.0.0:7000"
 * }
 * ```
 */
export function readBaseOptions(config: Config): BaseOptions {
  if (typeof config.get('listen') === 'string') {
    // TODO(freben): Expand this to support more addresses and perhaps optional
    const { host, port } = parseListenAddress(config.getString('listen'));

    return removeUnknown({
      listenPort: port,
      listenHost: host,
    });
  }

  const port = config.getOptional('listen.port');
  if (
    typeof port !== 'undefined' &&
    typeof port !== 'number' &&
    typeof port !== 'string'
  ) {
    throw new Error(
      `Invalid type in config for key 'backend.listen.post', got ${typeof port}, wanted string or number`,
    );
  }

  return removeUnknown({
    listenPort: port,
    listenHost: config.getOptionalString('listen.host'),
    baseUrl: config.getOptionalString('baseUrl'),
  });
}

/**
 * Attempts to read a CORS options object from the root of a config object.
 *
 * @param config The root of a backend config object
 * @returns A CORS options object, or undefined if not specified
 *
 * @example
 * ```json
 * {
 *   cors: {
 *    origin: "http://localhost:3000",
 *    credentials: true
 *   }
 * }
 * ```
 */
export function readCorsOptions(config: Config): CorsOptions | undefined {
  const cc = config.getOptionalConfig('cors');
  if (!cc) {
    return undefined;
  }

  return removeUnknown({
    origin: getOptionalStringOrStrings(cc, 'origin'),
    methods: getOptionalStringOrStrings(cc, 'methods'),
    allowedHeaders: getOptionalStringOrStrings(cc, 'allowedHeaders'),
    exposedHeaders: getOptionalStringOrStrings(cc, 'exposedHeaders'),
    credentials: cc.getOptionalBoolean('credentials'),
    maxAge: cc.getOptionalNumber('maxAge'),
    preflightContinue: cc.getOptionalBoolean('preflightContinue'),
    optionsSuccessStatus: cc.getOptionalNumber('optionsSuccessStatus'),
  });
}

/**
 * Attempts to read a CSP options object from the root of a config object.
 *
 * @param config The root of a backend config object
 * @returns A CSP options object, or undefined if not specified. Values can be
 *          false as well, which means to remove the default behavior for that
 *          key.
 *
 * @example
 * ```yaml
 * backend:
 *   csp:
 *     connect-src: ["'self'", 'http:', 'https:']
 *     upgrade-insecure-requests: false
 * ```
 */
export function readCspOptions(
  config: Config,
): Record<string, string[] | false> | undefined {
  const cc = config.getOptionalConfig('csp');
  if (!cc) {
    return undefined;
  }

  const result: Record<string, string[] | false> = {};
  for (const key of cc.keys()) {
    if (cc.get(key) === false) {
      result[key] = false;
    } else {
      result[key] = cc.getStringArray(key);
    }
  }

  return result;
}

/**
 * Attempts to read a https settings object from the root of a config object.
 *
 * @param config The root of a backend config object
 * @returns A https settings object, or undefined if not specified
 *
 * @example
 * ```json
 * {
 *   https: {
 *    certificate: ...
 *   }
 * }
 * ```
 */
export function readHttpsSettings(config: Config): HttpsSettings | undefined {
  const https = config.getOptional('https');
  if (https === true) {
    const baseUrl = config.getString('baseUrl');
    let hostname;
    try {
      hostname = new URL(baseUrl).hostname;
    } catch (error) {
      throw new Error(`Invalid backend.baseUrl "${baseUrl}"`);
    }

    return { certificate: { hostname } };
  }

  const cc = config.getOptionalConfig('https');
  if (!cc) {
    return undefined;
  }

  const certificateConfig = cc.get('certificate');

  const cfg = {
    certificate: certificateConfig,
  };

  return removeUnknown(cfg as HttpsSettings);
}

function getOptionalStringOrStrings(
  config: Config,
  key: string,
): string | string[] | undefined {
  const value = config.getOptional(key);
  if (
    value === undefined ||
    typeof value === 'string' ||
    isStringArray(value)
  ) {
    return value;
  }
  throw new Error(`Expected string or array of strings, got ${typeof value}`);
}

function isStringArray(value: any): value is string[] {
  if (!Array.isArray(value)) {
    return false;
  }
  for (const v of value) {
    if (typeof v !== 'string') {
      return false;
    }
  }
  return true;
}

function removeUnknown<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as T;
}

function parseListenAddress(value: string): { host?: string; port?: number } {
  const parts = value.split(':');
  if (parts.length === 1) {
    return { port: parseInt(parts[0], 10) };
  }
  if (parts.length === 2) {
    return { host: parts[0], port: parseInt(parts[1], 10) };
  }
  throw new Error(
    `Unable to parse listen address ${value}, expected <port> or <host>:<port>`,
  );
}
