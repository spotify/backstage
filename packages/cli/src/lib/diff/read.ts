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
import {
  dirname,
  resolve as resolvePath,
  relative as relativePath,
} from 'path';
import handlebars from 'handlebars';
import recursiveReadDir from 'recursive-readdir';
import { paths } from '../paths';
import { FileDiff } from './types';
import { packageVersions } from '../../lib/version';

export type TemplatedFile = {
  path: string;
  contents: string;
};

async function readTemplateFile(
  templateFile: string,
  templateVars: any,
): Promise<string> {
  const contents = await fs.readFile(templateFile, 'utf8');

  if (!templateFile.endsWith('.hbs')) {
    return contents;
  }

  return handlebars.compile(contents)(templateVars, {
    helpers: {
      version(name: keyof typeof packageVersions) {
        if (name in packageVersions) {
          return packageVersions[name];
        }
        throw new Error(`No version available for package ${name}`);
      },
    },
  });
}

async function readTemplate(
  templateDir: string,
  templateVars: any,
): Promise<TemplatedFile[]> {
  const templateFilePaths = await recursiveReadDir(templateDir).catch(error => {
    throw new Error(`Failed to read template directory: ${error.message}`);
  });

  const templatedFiles = new Array<TemplatedFile>();
  for (const templateFile of templateFilePaths) {
    const path = relativePath(templateDir, templateFile).replace(/\.hbs$/, '');
    const contents = await readTemplateFile(templateFile, templateVars);

    templatedFiles.push({ path, contents });
  }

  return templatedFiles;
}

async function diffTemplatedFiles(
  targetDir: string,
  templatedFiles: TemplatedFile[],
): Promise<FileDiff[]> {
  const fileDiffs = new Array<FileDiff>();
  for (const { path, contents: templateContents } of templatedFiles) {
    const targetPath = resolvePath(targetDir, path);
    const targetExists = await fs.pathExists(targetPath);

    const write = async (contents: string) => {
      await fs.ensureDir(dirname(targetPath));
      await fs.writeFile(targetPath, contents, 'utf8');
    };

    if (targetExists) {
      const targetContents = await fs.readFile(targetPath, 'utf8');
      fileDiffs.push({
        path,
        write,
        missing: false,
        targetContents,
        templateContents,
      });
    } else {
      fileDiffs.push({
        path,
        write,
        missing: true,
        targetContents: '',
        templateContents,
      });
    }
  }

  return fileDiffs;
}

// Read all template files for a given template, along with all matching files in the target dir
export async function diffTemplateFiles(template: string, templateData: any) {
  const templateDir = paths.resolveOwn('templates', template);

  const templatedFiles = await readTemplate(templateDir, templateData);
  const fileDiffs = await diffTemplatedFiles(paths.targetDir, templatedFiles);
  return fileDiffs;
}
