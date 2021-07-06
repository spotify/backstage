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
import { Readable } from 'stream';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

type storageOptions = {
  keyFilename?: string;
};

const rootDir = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';
/**
 * @param sourceFile Absolute path. Contains either / or \ as file separator depending upon the OS.
 */
const checkFileExists = async (sourceFile: string): Promise<boolean> => {
  // sourceFile will always have / as file separator irrespective of OS since GCS expects /.
  // Normalize sourceFile to OS specific path before checking if file exists.
  const filePath = sourceFile.split(path.posix.sep).join(path.sep);

  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

class GCSFile {
  private readonly localFilePath: string;

  constructor(private readonly destinationFilePath: string) {
    this.destinationFilePath = destinationFilePath;
    this.localFilePath = path.join(rootDir, this.destinationFilePath);
  }

  exists() {
    return new Promise(async (resolve, reject) => {
      if (await checkFileExists(this.localFilePath)) {
        resolve([true]);
      } else {
        reject();
      }
    });
  }

  createReadStream() {
    const readable = new Readable();
    readable._read = () => {};

    process.nextTick(() => {
      if (fs.existsSync(this.localFilePath)) {
        if (readable.eventNames().includes('pipe')) {
          readable.emit('pipe');
        }
        readable.emit('data', fs.readFileSync(this.localFilePath));
        readable.emit('end');
      } else {
        readable.emit(
          'error',
          new Error(`The file ${this.localFilePath} does not exist !`),
        );
      }
    });
    return readable;
  }
}

class Bucket {
  private readonly bucketName;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  async getMetadata() {
    if (this.bucketName === 'errorBucket') {
      throw Error('Bucket does not exist');
    }

    return '';
  }

  upload(source: string, { destination }) {
    return new Promise(async (resolve, reject) => {
      if (await checkFileExists(source)) {
        resolve({ source, destination });
      } else {
        reject(`Source file ${source} does not exist.`);
      }
    });
  }

  file(destinationFilePath: string) {
    return new GCSFile(destinationFilePath);
  }
}

export class Storage {
  private readonly keyFilename;

  constructor(options: storageOptions) {
    this.keyFilename = options.keyFilename;
  }

  bucket(bucketName) {
    return new Bucket(bucketName);
  }
}
