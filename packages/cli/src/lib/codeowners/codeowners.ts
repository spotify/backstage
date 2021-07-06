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
import path from 'path';

const TEAM_ID_RE = /^@[-\w]+\/[-\w]+$/;
const USER_ID_RE = /^@[-\w]+$/;
const EMAIL_RE = /^[^@]+@[-.\w]+\.[-\w]+$/i;
const DEFAULT_OWNER = '@backstage/maintainers';

type CodeownersEntry = {
  ownedPath: string;
  ownerIds: string[];
};

export async function getCodeownersFilePath(
  rootDir: string,
): Promise<string | undefined> {
  const paths = [
    path.join(rootDir, '.github', 'CODEOWNERS'),
    path.join(rootDir, '.gitlab', 'CODEOWNERS'),
    path.join(rootDir, 'docs', 'CODEOWNERS'),
    path.join(rootDir, 'CODEOWNERS'),
  ];

  for (const p of paths) {
    if (await fs.pathExists(p)) {
      return p;
    }
  }

  return undefined;
}

export function isValidSingleOwnerId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  return TEAM_ID_RE.test(id) || USER_ID_RE.test(id) || EMAIL_RE.test(id);
}

export function parseOwnerIds(
  spaceSeparatedOwnerIds: string,
): string[] | undefined {
  if (!spaceSeparatedOwnerIds || typeof spaceSeparatedOwnerIds !== 'string') {
    return undefined;
  }

  const ids = spaceSeparatedOwnerIds.split(' ').filter(Boolean);
  if (!ids.every(isValidSingleOwnerId)) {
    return undefined;
  }

  return ids;
}

export async function addCodeownersEntry(
  codeownersFilePath: string,
  ownedPath: string,
  ownerIds: string[],
): Promise<void> {
  const allLines = (await fs.readFile(codeownersFilePath, 'utf8')).split('\n');

  // Only keep comments from the top of the file
  const commentLines = [];
  for (const line of allLines) {
    if (line[0] !== '#') {
      break;
    }
    commentLines.push(line);
  }

  const oldDeclarationEntries: CodeownersEntry[] = allLines
    .filter(line => line[0] !== '#')
    .map(line => line.split(/\s+/).filter(Boolean))
    .filter(tokens => tokens.length >= 2)
    .map(tokens => ({
      ownedPath: tokens[0],
      ownerIds: tokens.slice(1),
    }));

  const newDeclarationEntries = oldDeclarationEntries
    .filter(entry => entry.ownedPath !== '*')
    .concat([{ ownedPath, ownerIds }])
    .sort((l1, l2) => l1.ownedPath.localeCompare(l2.ownedPath));
  newDeclarationEntries.unshift({
    ownedPath: '*',
    ownerIds: [DEFAULT_OWNER],
  });

  // Calculate longest path to be able to align entries nicely
  const longestOwnedPath = newDeclarationEntries.reduce(
    (length, entry) => Math.max(length, entry.ownedPath.length),
    0,
  );

  const newDeclarationLines = newDeclarationEntries.map(entry => {
    const entryPath =
      entry.ownedPath + ' '.repeat(longestOwnedPath - entry.ownedPath.length);
    return [entryPath, ...entry.ownerIds].join(' ');
  });

  const newLines = [...commentLines, '', ...newDeclarationLines, ''];

  await fs.writeFile(codeownersFilePath, newLines.join('\n'), 'utf8');
}
