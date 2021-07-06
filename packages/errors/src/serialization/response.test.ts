/*
 * Copyright 2021 The Backstage Authors
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

import { parseErrorResponse, ErrorResponse } from './response';

describe('parseErrorResponse', () => {
  it('handles the happy path', async () => {
    const body: ErrorResponse = {
      error: { name: 'Fours', message: 'Expected fives', stack: 'lines' },
      request: { method: 'GET', url: '/' },
      response: { statusCode: 444 },
    };

    const response: Partial<Response> = {
      status: 444,
      statusText: 'Fours',
      text: async () => JSON.stringify(body),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };

    await expect(parseErrorResponse(response as Response)).resolves.toEqual(
      body,
    );
  });

  it('uses request header and text body when wrong content type, even if parsable', async () => {
    const body: ErrorResponse = {
      error: { name: 'Threes', message: 'Expected twos' },
      request: { method: 'GET', url: '/' },
      response: { statusCode: 333 },
    };

    const response: Partial<Response> = {
      status: 444,
      statusText: 'Fours',
      text: async () => JSON.stringify(body),
      headers: new Headers({ 'Content-Type': 'not-application/not-json' }),
    };

    await expect(parseErrorResponse(response as Response)).resolves.toEqual({
      error: {
        name: 'Unknown',
        message: `Request failed with status 444 Fours, ${JSON.stringify(
          body,
        )}`,
      },
      response: { statusCode: 444 },
    });
  });

  it('uses request header and text body when not parsable', async () => {
    const body: ErrorResponse = {
      error: { name: 'Threes', message: 'Expected twos' },
      request: { method: 'GET', url: '/' },
      response: { statusCode: 333 },
    };

    const response: Partial<Response> = {
      status: 444,
      statusText: 'Fours',
      text: async () => JSON.stringify(body).substring(1),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };

    await expect(parseErrorResponse(response as Response)).resolves.toEqual({
      error: {
        name: 'Unknown',
        message: `Request failed with status 444 Fours, ${JSON.stringify(
          body,
        ).substring(1)}`,
      },
      response: { statusCode: 444 },
    });
  });

  it('uses request header when failing to get body', async () => {
    const response: Partial<Response> = {
      status: 444,
      statusText: 'Fours',
      text: async () => {
        throw new Error('bail');
      },
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };

    await expect(parseErrorResponse(response as Response)).resolves.toEqual({
      error: {
        name: 'Unknown',
        message: `Request failed with status 444 Fours`,
      },
      response: { statusCode: 444 },
    });
  });
});
