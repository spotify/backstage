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

import { SerializedError } from './error';

/**
 * A standard shape of JSON data returned as the body of backend errors.
 */
export type ErrorResponse = {
  /** Details of the error that was caught */
  error: SerializedError;

  /** Details about the incoming request */
  request?: {
    /** The HTTP method of the request */
    method: string;
    /** The URL of the request (excluding protocol and host/port) */
    url: string;
  };

  /** Details about the response */
  response: {
    /** The numeric HTTP status code that was returned */
    statusCode: number;
  };
};

/**
 * Attempts to construct an ErrorResponse out of a failed server request.
 * Assumes that the response has already been checked to be not ok. This
 * function consumes the body of the response, and assumes that it hasn't
 * been consumed before.
 *
 * The code is forgiving, and constructs a useful synthetic body as best it can
 * if the response body wasn't on the expected form.
 *
 * @param response The response of a failed request
 */
export async function parseErrorResponse(
  response: Response,
): Promise<ErrorResponse> {
  try {
    const text = await response.text();
    if (text) {
      if (
        response.headers.get('content-type')?.startsWith('application/json')
      ) {
        try {
          const body = JSON.parse(text);
          if (body.error && body.response) {
            return body;
          }
        } catch {
          // ignore
        }
      }

      return {
        error: {
          name: 'Unknown',
          message: `Request failed with status ${response.status} ${response.statusText}, ${text}`,
        },
        response: {
          statusCode: response.status,
        },
      };
    }
  } catch {
    // ignore
  }

  return {
    error: {
      name: 'Unknown',
      message: `Request failed with status ${response.status} ${response.statusText}`,
    },
    response: {
      statusCode: response.status,
    },
  };
}
