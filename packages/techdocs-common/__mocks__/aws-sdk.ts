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
import type { S3 as S3Types } from 'aws-sdk';
import { EventEmitter } from 'events';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

export { Credentials } from 'aws-sdk';

const rootDir = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

/**
 * @param Key Relative path to entity root dir. Contains either / or \ as file separator
 * depending upon the OS.
 */
const checkFileExists = async (Key: string): Promise<boolean> => {
  // Key will always have / as file separator irrespective of OS since S3 expects /.
  // Normalize Key to OS specific path before checking if file exists.
  const relativeFilePath = Key.split(path.posix.sep).join(path.sep);
  const filePath = path.join(rootDir, Key);

  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

export class S3 {
  private readonly options;

  constructor(options: S3Types.ClientConfiguration) {
    this.options = options;
  }

  headObject({ Key }: { Key: string }) {
    return {
      promise: async () => {
        if (!(await checkFileExists(Key))) {
          throw new Error('File does not exist');
        }
      },
    };
  }

  getObject({ Key }: { Key: string }) {
    const filePath = path.join(rootDir, Key);
    return {
      promise: () => checkFileExists(filePath),
      createReadStream: () => {
        const emitter = new EventEmitter();
        process.nextTick(() => {
          if (fs.existsSync(filePath)) {
            emitter.emit('data', Buffer.from(fs.readFileSync(filePath)));
            emitter.emit('end');
          } else {
            emitter.emit(
              'error',
              new Error(`The file ${filePath} does not exist !`),
            );
          }
        });
        return emitter;
      },
    };
  }

  headBucket({ Bucket }) {
    return {
      promise: async () => {
        if (Bucket === 'errorBucket') {
          throw new Error('Bucket does not exist');
        }

        return {};
      },
    };
  }

  upload({ Key }: { Key: string }) {
    return {
      promise: () =>
        new Promise(async (resolve, reject) => {
          if (!(await checkFileExists(Key))) {
            reject(`The file ${Key} does not exist`);
          } else {
            resolve('');
          }
        }),
    };
  }
}

export default {
  S3,
};
