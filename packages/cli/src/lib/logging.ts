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

export type LogFunc = (data: Buffer | string) => void;
export type LogPipe = (dst: NodeJS.WriteStream) => LogFunc;

export type LogOptions = {
  // If set, prefix each log message with this string
  prefix?: string;

  // If true, clear terminal commands will be forwarded, otherwise they are removed
  forwardClearTerm?: boolean;
};

// Creates a log pipe that binds to a destination stream and forwards logs with optional transforms.
// Use returned logPipe e.g. as follows: child.stdout.on('data', logPipe(process.stdout))
export function createLogPipe(options: LogOptions = {}): LogPipe {
  const { prefix = '', forwardClearTerm = false } = options;

  return (dst: NodeJS.WriteStream) => (data: Buffer | string) => {
    let str = typeof data === 'string' ? data : data.toString('utf8');

    if (!forwardClearTerm) {
      str = trimClearTerm(str);
    }
    if (prefix) {
      str = `${prefix}${str}`;
    }

    dst.write(Buffer.from(str, 'utf8'));
  };
}

// Wrapper around createLogPipe to avoid awkward immediate call of returned function
export function createLogFunc(
  dst: NodeJS.WriteStream,
  options: LogOptions = {},
): LogFunc {
  return createLogPipe(options)(dst);
}

// Returns the string without terminal clear command if it was prefixed with one.
export function trimClearTerm(msg: string): string {
  return msg.startsWith('\x1b\x63') ? msg.slice(2) : msg;
}
