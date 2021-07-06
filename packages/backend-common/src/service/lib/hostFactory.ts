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

import fs from 'fs-extra';
import { resolve as resolvePath, dirname } from 'path';
import express from 'express';
import * as http from 'http';
import * as https from 'https';
import { Logger } from 'winston';
import { HttpsSettings } from './config';

const ALMOST_MONTH_IN_MS = 25 * 24 * 60 * 60 * 1000;

const IP_HOSTNAME_REGEX = /:|^\d+\.\d+\.\d+\.\d+$/;

/**
 * Creates a Http server instance based on an Express application.
 *
 * @param app The Express application object
 * @param logger Optional Winston logger object
 * @returns A Http server instance
 *
 */
export function createHttpServer(
  app: express.Express,
  logger?: Logger,
): http.Server {
  logger?.info('Initializing http server');

  return http.createServer(app);
}

/**
 * Creates a Https server instance based on an Express application.
 *
 * @param app The Express application object
 * @param httpsSettings HttpsSettings for self-signed certificate generation
 * @param logger Optional Winston logger object
 * @returns A Https server instance
 *
 */
export async function createHttpsServer(
  app: express.Express,
  httpsSettings: HttpsSettings,
  logger?: Logger,
): Promise<http.Server> {
  logger?.info('Initializing https server');

  let credentials: { key: string | Buffer; cert: string | Buffer };

  if ('hostname' in httpsSettings?.certificate) {
    credentials = await getGeneratedCertificate(
      httpsSettings.certificate.hostname,
      logger,
    );
  } else {
    logger?.info('Loading certificate from config');

    credentials = {
      key: httpsSettings?.certificate?.key,
      cert: httpsSettings?.certificate?.cert,
    };
  }

  if (!credentials.key || !credentials.cert) {
    throw new Error('Invalid HTTPS credentials');
  }

  return https.createServer(credentials, app) as http.Server;
}

async function getGeneratedCertificate(hostname: string, logger?: Logger) {
  const hasModules = await fs.pathExists('node_modules');
  let certPath;
  if (hasModules) {
    certPath = resolvePath(
      'node_modules/.cache/backstage-backend/dev-cert.pem',
    );
    await fs.ensureDir(dirname(certPath));
  } else {
    certPath = resolvePath('.dev-cert.pem');
  }

  let cert = undefined;
  if (await fs.pathExists(certPath)) {
    const stat = await fs.stat(certPath);
    const ageMs = Date.now() - stat.ctimeMs;
    if (stat.isFile() && ageMs < ALMOST_MONTH_IN_MS) {
      cert = await fs.readFile(certPath);
    }
  }

  if (cert) {
    logger?.info('Using existing self-signed certificate');
    return {
      key: cert,
      cert: cert,
    };
  }

  logger?.info('Generating new self-signed certificate');
  const newCert = await createCertificate(hostname);
  await fs.writeFile(certPath, newCert.cert + newCert.key, 'utf8');
  return newCert;
}

async function createCertificate(hostname: string) {
  const attributes = [
    {
      name: 'commonName',
      value: 'dev-cert',
    },
  ];

  const sans = [
    {
      type: 2, // DNS
      value: 'localhost',
    },
    {
      type: 2,
      value: 'localhost.localdomain',
    },
    {
      type: 2,
      value: '[::1]',
    },
    {
      type: 7, // IP
      ip: '127.0.0.1',
    },
    {
      type: 7,
      ip: 'fe80::1',
    },
  ];

  // Add hostname from backend.baseUrl if it doesn't already exist in our list of SANs
  if (!sans.find(({ value, ip }) => value === hostname || ip === hostname)) {
    sans.push(
      IP_HOSTNAME_REGEX.test(hostname)
        ? {
            type: 7,
            ip: hostname,
          }
        : {
            type: 2,
            value: hostname,
          },
    );
  }

  const params = {
    algorithm: 'sha256',
    keySize: 2048,
    days: 30,
    extensions: [
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true,
      },
      {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        timeStamping: true,
      },
      {
        name: 'subjectAltName',
        altNames: sans,
      },
    ],
  };

  return new Promise<{ key: string; cert: string }>((resolve, reject) =>
    require('selfsigned').generate(
      attributes,
      params,
      (err: Error, bundle: { private: string; cert: string }) => {
        if (err) {
          reject(err);
        } else {
          resolve({ key: bundle.private, cert: bundle.cert });
        }
      },
    ),
  );
}
