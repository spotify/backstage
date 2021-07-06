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
import { paths } from '../lib/paths';

const SKIPPED_KEYS = ['access', 'registry', 'tag'];

const PKG_PATH = 'package.json';
const PKG_BACKUP_PATH = 'package.json-prepack';

export const pre = async () => {
  const pkgPath = paths.resolveTarget(PKG_PATH);

  const pkgContent = await fs.readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgContent);
  await fs.writeFile(PKG_BACKUP_PATH, pkgContent);

  for (const key of Object.keys(pkg.publishConfig ?? {})) {
    if (!SKIPPED_KEYS.includes(key)) {
      pkg[key] = pkg.publishConfig[key];
    }
  }
  await fs.writeJson(pkgPath, pkg, { encoding: 'utf8', spaces: 2 });
};

export const post = async () => {
  // postpack isn't called by yarn right now, so it needs to be called manually
  try {
    await fs.move(PKG_BACKUP_PATH, PKG_PATH, { overwrite: true });
  } catch (error) {
    console.warn(
      `Failed to restore package.json during postpack, ${error}. ` +
        'Your package will be fine but you may have ended up with some garbage in the repo.',
    );
  }
};
