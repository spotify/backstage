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

import {
  parseErrorResponse,
  ErrorResponse,
  deserializeError,
} from '../serialization';

/**
 * An error thrown as the result of a failed server request.
 *
 * The server is expected to respond on the ErrorResponse format.
 */
export class ResponseError extends Error {
  /**
   * The actual response, as seen by the client.
   *
   * Note that the body of this response is always consumed. Its parsed form is
   * in the `body` field.
   */
  readonly response: Response;

  /**
   * The parsed JSON error body, as sent by the server.
   */
  readonly data: ErrorResponse;

  /**
   * The Error cause, as seen by the remote server. This is parsed out of the
   * JSON error body.
   *
   * This error always has the plain Error constructor, however all
   * serializable enumerable fields on the remote error including its name are
   * preserved. Therefore, if you want to check the error type, use its name
   * property rather than checking typeof or its constructor or prototype.
   */
  readonly cause: Error;

  /**
   * Constructs a ResponseError based on a failed response.
   *
   * Assumes that the response has already been checked to be not ok. This
   * function consumes the body of the response, and assumes that it hasn't
   * been consumed before.
   */
  static async fromResponse(response: Response): Promise<ResponseError> {
    const data = await parseErrorResponse(response);

    const status = data.response.statusCode || response.status;
    const statusText = data.error.name || response.statusText;
    const message = `Request failed with ${status} ${statusText}`;
    const cause = deserializeError(data.error);

    return new ResponseError({
      message,
      response,
      data,
      cause,
    });
  }

  constructor(props: {
    message: string;
    response: Response;
    data: ErrorResponse;
    cause: Error;
  }) {
    super(props.message);
    this.name = 'ResponseError';
    this.response = props.response;
    this.data = props.data;
    this.cause = props.cause;
  }
}
