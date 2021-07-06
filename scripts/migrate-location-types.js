#!/usr/bin/env node
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

// This is a script that helps you migrate any locations that are using
// deprecated location types. Change the below URL to point towards your
// catalog API endpoint and execute the script. It will delete and add
// back the locations with the correct type one by one.

const BASE_URL = 'http://localhost:7000/api/catalog'; // Change me

const deprecatedTypes = [
  'github',
  'github/api',
  'bitbucket/api',
  'gitlab/api',
  'azure/api',
];

async function main() {
  const locations = await request('GET', `${BASE_URL}/locations`);

  for (const { data: location } of locations) {
    if (!deprecatedTypes.includes(location.type)) {
      continue;
    }
    console.log(`${location.type} -> url : ${location.target}`);
    await request('DELETE', `${BASE_URL}/locations/${location.id}`);
    try {
      await request('POST', `${BASE_URL}/locations`, {
        type: 'url',
        target: location.target,
      });
    } catch (error) {
      console.log(`Failed to add back location ${location.target}`);
      throw error;
    }
  }
}

async function request(method, url, body) {
  return new Promise((resolve, reject) => {
    const parsedUrl = require('url').parse(url);

    const req = require('http').request(
      {
        method,
        ...parsedUrl,
        headers: body
          ? {
              'Content-Type': 'application/json',
            }
          : {},
      },
      res => {
        const chunks = [];
        res.on('data', chunk => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          if (res.statusCode >= 300) {
            reject(
              new Error(
                `${method} to ${url} failed with status ${res.statusCode}`,
              ),
            );
            return;
          }
          try {
            const body = Buffer.concat(chunks).toString('utf8').trim();
            if (body) {
              resolve(JSON.parse(body));
            } else {
              resolve();
            }
          } catch (error) {
            reject(error);
          }
        });
      },
    );

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
