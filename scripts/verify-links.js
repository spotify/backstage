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

/* eslint-disable import/no-extraneous-dependencies */

const { resolve: resolvePath, join: joinPath, dirname } = require('path');
const fs = require('fs').promises;
const { existsSync } = require('fs');

const IGNORED_DIRS = ['node_modules', 'dist', 'bin', '.git'];

async function listFiles(dir) {
  const files = await fs.readdir(dir);
  const paths = await Promise.all(
    files
      .filter(file => !IGNORED_DIRS.includes(file))
      .map(async file => {
        const path = joinPath(dir, file);

        if ((await fs.stat(path)).isDirectory()) {
          return listFiles(path);
        }
        return path;
      }),
  );
  return paths.flat();
}

const projectRoot = resolvePath(__dirname, '..');

async function verifyUrl(basePath, absUrl, docPages) {
  // Avoid having absolute URL links within docs/, so that links work on the site
  if (
    absUrl.match(
      /https:\/\/github.com\/backstage\/backstage\/(tree|blob)\/master\/docs\//,
    ) &&
    basePath.match(/^(?:docs|microsite)\//)
  ) {
    return { url: absUrl, basePath, problem: 'github' };
  }

  const url = absUrl
    .replace(/#.*$/, '')
    .replace(
      /https:\/\/github.com\/backstage\/backstage\/(tree|blob)\/master/,
      '',
    );
  if (!url) {
    return undefined;
  }

  // Only verify existence of local files for now, so skip anything with a schema
  if (url.match(/[a-z]+:/)) {
    return undefined;
  }

  let path = '';

  if (url.startsWith('/')) {
    if (url.startsWith('/docs/')) {
      if (basePath.match(/^(?:docs)\//)) {
        return { url, basePath, problem: 'not-relative' };
      }
      if (basePath.startsWith('microsite/')) {
        if (docPages.has(url)) {
          return undefined;
        }
        return { url, basePath, problem: 'doc-missing' };
      }
    }

    const staticPath = resolvePath(projectRoot, 'microsite/static', `.${url}`);
    if (existsSync(staticPath)) {
      return undefined;
    }

    path = resolvePath(projectRoot, `.${url}`);
  } else {
    path = resolvePath(dirname(resolvePath(projectRoot, basePath)), url);
  }

  if (
    absUrl === url &&
    basePath.match(/^(?:docs)\//) &&
    !path.startsWith(resolvePath(projectRoot, 'docs'))
  ) {
    return { url, basePath, problem: 'out-of-docs' };
  }

  if (!existsSync(path)) {
    return { url, basePath, problem: 'missing' };
  }

  return undefined;
}

async function verifyFile(filePath, docPages) {
  const content = await fs.readFile(filePath, 'utf8');
  const mdLinks = content.match(/\[.+?\]\(.+?\)/g) || [];
  const badUrls = [];

  for (const mdLink of mdLinks) {
    const url = mdLink.match(/\[.+\]\((.+)\)/)[1].trim();
    const badUrl = await verifyUrl(filePath, url, docPages);
    if (badUrl) {
      badUrls.push(badUrl);
    }
  }

  return badUrls;
}

// This discovers the doc paths as they will be available on the microsite.
// It is used to validate microsite links from outside /docs/, as those
// are not transformed from the markdown file representation by docusaurus.
async function findExternalDocsLinks(dir) {
  const allFiles = await listFiles(dir);
  const mdFiles = allFiles.filter(p => p.endsWith('.md'));

  const paths = new Map();

  for (const file of mdFiles) {
    const content = await fs.readFile(file, 'utf8');
    const url = `/${file}`;
    const match = content.match(/---(?:\r|\n|.)*^id: (.*)$/m);

    // Both docs with an id and without should remove trailing /index
    const realPath = (match
      ? joinPath(dirname(url), match[1])
      : url.replace(/\.md$/, '')
    ).replace(/\/index$/, '');

    paths.set(url, realPath);
    if (url.endsWith('/index.md')) {
      paths.set(url.replace(/\/index\.md$/, ''), realPath);
    }
  }

  return paths;
}

async function main() {
  process.chdir(projectRoot);

  const files = await listFiles('.');
  const mdFiles = files.filter(f => f.endsWith('.md'));
  const badUrls = [];

  const docPages = await findExternalDocsLinks('docs');
  const docPageSet = new Set(docPages.values());

  for (const mdFile of mdFiles) {
    const badFileUrls = await verifyFile(mdFile, docPageSet);
    badUrls.push(...badFileUrls);
  }

  if (badUrls.length) {
    console.log(`Found ${badUrls.length} bad links within repo`);
    for (const { url, basePath, problem } of badUrls) {
      if (problem === 'missing') {
        console.error(
          `Unable to reach ${url} from root or microsite/static/, linked from ${basePath}`,
        );
      } else if (problem === 'out-of-docs') {
        console.error(
          'Links in docs must use absolute URLs for targets outside of docs',
        );
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url}`);
        console.error(
          `  Likely replace with: https://github.com/backstage/backstage/blob/master/${url.replace(
            /^[./]+/,
            '',
          )}`,
        );
      } else if (problem === 'doc-missing') {
        const suggestion =
          docPages.get(url) ||
          docPages.get(new URL(url, 'http://localhost').pathname);
        console.error('Links into /docs/ must use an externally reachable ID');
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url}`);
        if (suggestion) {
          console.error(`  Replace With: ${suggestion}`);
        }
      } else if (problem === 'not-relative') {
        console.error('Links within /docs/ must be relative');
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url}`);
      } else if (problem === 'github') {
        console.error(
          `Link to docs/ should not use a GitHub URL, use a relative URL instead`,
        );
        console.error(`  From: ${basePath}`);
        console.error(`  To: ${url}`);
      }
    }
    process.exit(1);
  }
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
