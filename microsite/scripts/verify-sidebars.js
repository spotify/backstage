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

/**
 * This script relies on docusaurus internals. It can be replaced in case
 * docusaurus adds proper validation of the sidebar items.
 */

let metadata;
try {
  metadata = require('docusaurus/lib/core/metadata.js');
} catch (error) {
  console.log('❌ Run `yarn build` before running `yarn verify:sidebars`');
  process.exit(1);
}

const errors = [];
const ids = Object.keys(metadata);
for (let id of ids) {
  const { next, previous } = metadata[id];

  if (next && !ids.includes(next)) {
    errors.push(`Next ${next} does not exist in ${id}.`);
  }

  if (previous && !ids.includes(previous)) {
    errors.push(`Previous ${previous} does not exist in ${id}.`);
  }
}

if (errors.length) {
  for (const error of errors) {
    console.log(`❌ ${error}`);
  }
  process.exit(1);
}

console.log('✅ All sidebar links are correct.');
