/*
 * Copyright 2025 The Backstage Authors
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

import { z } from 'zod';
import fs from 'fs-extra';
import recursiveReaddir from 'recursive-readdir';
import { resolve as resolvePath, relative as relativePath } from 'node:path';
import { dirname } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { targetPaths } from '@backstage/cli-common';

import {
  PortableTemplateFile,
  PortableTemplatePointer,
  TEMPLATE_ROLES,
} from '../types';
import { PortableTemplate } from '../types';
import { ForwardedError } from '@backstage/errors';
import { fromZodError } from 'zod-validation-error';

const templateDefinitionSchema = z
  .object({
    name: z.string(),
    role: z.enum(TEMPLATE_ROLES),
    description: z.string().optional(),
    values: z.record(z.string(), z.string()).optional(),
  })
  .strict();

export async function loadPortableTemplate(
  pointer: PortableTemplatePointer,
): Promise<PortableTemplate> {
  if (pointer.target.match(/https?:\/\//)) {
    throw new Error('Remote templates are not supported yet');
  }
  const templateContent = await fs
    .readFile(targetPaths.resolveInstallationRoot(pointer.target), 'utf-8')
    .catch(error => {
      throw new ForwardedError(
        `Failed to load template definition from '${pointer.target}'`,
        error,
      );
    });
  const rawTemplate = parseYaml(templateContent);

  const parsed = templateDefinitionSchema.safeParse(rawTemplate);
  if (!parsed.success) {
    throw new ForwardedError(
      `Invalid template definition at '${pointer.target}'`,
      fromZodError(parsed.error),
    );
  }

  const { role, values = {} } = parsed.data;

  const templatePath = resolvePath(dirname(pointer.target));
  const filePaths = await recursiveReaddir(templatePath).catch(error => {
    throw new ForwardedError(
      `Failed to load template contents from '${templatePath}'`,
      error,
    );
  });

  const loadedFiles = new Array<PortableTemplateFile>();

  for (const filePath of filePaths) {
    const path = relativePath(templatePath, filePath);
    if (filePath === pointer.target) {
      continue;
    }

    const content = await fs.readFile(filePath, 'utf-8').catch(error => {
      throw new ForwardedError(
        `Failed to load file contents from '${path}'`,
        error,
      );
    });

    if (path.endsWith('.hbs')) {
      loadedFiles.push({
        path: path.slice(0, -4),
        content,
        syntax: 'handlebars',
      });
    } else {
      loadedFiles.push({ path, content });
    }
  }

  return {
    name: pointer.name,
    role,
    files: loadedFiles,
    values,
  };
}
