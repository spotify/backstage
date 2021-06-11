/*
 * Copyright 2020 Spotify AB
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
import { EventEmitter } from 'events';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { ClientError } from 'pkgcloud';

const rootDir = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

const checkFileExists = async (Key: string): Promise<boolean> => {
  // Key will always have / as file separator irrespective of OS since cloud providers expects /.
  // Normalize Key to OS specific path before checking if file exists.
  const filePath = path.join(rootDir, Key);

  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

class PkgCloudStorageClient {
  getFile(
    containerName: string,
    file: string,
    callback: (err: any, file: any) => any,
  ) {
    checkFileExists(file).then(res => {
      if (!res) {
        callback('File does not exist', undefined);
      } else {
        callback(undefined, 'success');
      }
    });
  }

  getContainer(
    containerName: string,
    callback: (err: ClientError, container: any) => any,
  ) {
    if (containerName !== 'mock') {
      callback(new Error('Container does not exist'), undefined);
    } else {
      callback(undefined, 'success');
    }
  }

  upload({ remote }: { remote: string }) {
    const filePath = path.join(rootDir, remote);

    const emitter = new EventEmitter();

    process.nextTick(() => {
      if (fs.existsSync(filePath)) {
        emitter.emit('success');
        (emitter as any).end = () => true;
      } else {
        emitter.emit(
          'error',
          new Error(`The file ${filePath} does not exist !`),
        );
      }
    });

    return emitter;
  }

  download({ remote }: { remote: string }) {
    const filePath = path.join(rootDir, remote);

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
  }
}

export class storage {
  static createClient() {
    return new PkgCloudStorageClient();
  }
}
