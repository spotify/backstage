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

import { Entity } from '@backstage/catalog-model';
import { isChildPath } from '@backstage/backend-common';
import { spawn } from 'child_process';
import fs from 'fs-extra';
import yaml, { DEFAULT_SCHEMA, Type } from 'js-yaml';
import { resolve as resolvePath } from 'path';
import { PassThrough, Writable } from 'stream';
import { Logger } from 'winston';
import { ParsedLocationAnnotation } from '../../helpers';
import { RemoteProtocol } from '../prepare/types';
import { SupportedGeneratorKey } from './types';

// TODO: Implement proper support for more generators.
export function getGeneratorKey(entity: Entity): SupportedGeneratorKey {
  if (!entity) {
    throw new Error('No entity provided');
  }

  return 'techdocs';
}

export type RunCommandOptions = {
  command: string;
  args: string[];
  options: object;
  logStream?: Writable;
};

/**
 *
 * @param options the options object
 * @param options.command the command to run
 * @param options.args the arguments to pass the command
 * @param options.options options used in spawn
 * @param options.logStream the log streamer to capture log messages
 */
export const runCommand = async ({
  command,
  args,
  options,
  logStream = new PassThrough(),
}: RunCommandOptions) => {
  await new Promise<void>((resolve, reject) => {
    const process = spawn(command, args, options);

    process.stdout.on('data', stream => {
      logStream.write(stream);
    });

    process.stderr.on('data', stream => {
      logStream.write(stream);
    });

    process.on('error', error => {
      return reject(error);
    });

    process.on('close', code => {
      if (code !== 0) {
        return reject(`Command ${command} failed, exit code: ${code}`);
      }
      return resolve();
    });
  });
};

/**
 * Return true if mkdocs can compile docs with provided repo_url
 *
 * Valid repo_url examples in mkdocs.yml
 * - https://github.com/backstage/backstage
 * - https://gitlab.com/org/repo/
 * - http://github.com/backstage/backstage
 * - A http(s) protocol URL to the root of the repository
 *
 * Invalid repo_url examples in mkdocs.yml
 * - https://github.com/backstage/backstage/blob/master/plugins/techdocs-backend/examples/documented-component
 * - (anything that is not valid as described above)
 *
 * @param {string} repoUrl URL supposed to be used as repo_url in mkdocs.yml
 * @param {RemoteProtocol} locationType Type of source code host - github, gitlab, dir, url, etc.
 * @returns {boolean}
 */
export const isValidRepoUrlForMkdocs = (
  repoUrl: string,
  locationType: RemoteProtocol,
): boolean => {
  // Trim trailing slash
  const cleanRepoUrl = repoUrl.replace(/\/$/, '');

  if (locationType === 'github' || locationType === 'gitlab') {
    // A valid repoUrl to the root of the repository will be split into 5 strings if split using the / delimiter.
    // We do not want URLs which have more than that number of forward slashes since they will signify a non-root location
    // Note: This is not the best possible implementation but will work most of the times.. Feel free to improve or
    // highlight edge cases.
    return cleanRepoUrl.split('/').length === 5;
  }

  return false;
};

/**
 * Return a valid URL of the repository used in backstage.io/techdocs-ref annotation.
 * Return undefined if the `target` is not valid in context of repo_url in mkdocs.yml
 * Alter URL so that it is a valid repo_url config in mkdocs.yml
 *
 * @param {ParsedLocationAnnotation} parsedLocationAnnotation Object with location url and type
 * @returns {string | undefined}
 */
export const getRepoUrlFromLocationAnnotation = (
  parsedLocationAnnotation: ParsedLocationAnnotation,
): string | undefined => {
  const { type: locationType, target } = parsedLocationAnnotation;

  // Add more options from the RemoteProtocol type of parsedLocationAnnotation.type here
  // when TechDocs supports more hosts and if mkdocs can generated an Edit URL for them.
  const supportedHosts = ['github', 'gitlab'];

  if (supportedHosts.includes(locationType)) {
    // Trim .git or .git/ from the end of repository url
    return target.replace(/.git\/*$/, '');
  }

  return undefined;
};

class UnknownTag {
  constructor(public readonly data: any, public readonly type?: string) {}
}

const MKDOCS_SCHEMA = DEFAULT_SCHEMA.extend([
  new Type('', {
    kind: 'scalar',
    multi: true,
    representName: o => (o as UnknownTag).type,
    represent: o => (o as UnknownTag).data ?? '',
    instanceOf: UnknownTag,
    construct: (data: string, type?: string) => new UnknownTag(data, type),
  }),
]);

/**
 * Validating mkdocs config file for incorrect/insecure values
 * Throws on invalid configs
 *
 * @param {string} inputDir base dir to be used as a docs_dir path validity check
 * @param {string} mkdocsYmlPath Absolute path to mkdocs.yml or equivalent of a docs site
 */
export const validateMkdocsYaml = async (
  inputDir: string,
  mkdocsYmlPath: string,
) => {
  let mkdocsYmlFileString;
  try {
    mkdocsYmlFileString = await fs.readFile(mkdocsYmlPath, 'utf8');
  } catch (error) {
    throw new Error(
      `Could not read MkDocs YAML config file ${mkdocsYmlPath} before for validation: ${error.message}`,
    );
  }

  const mkdocsYml: any = yaml.load(mkdocsYmlFileString, {
    schema: MKDOCS_SCHEMA,
  });

  if (
    mkdocsYml.docs_dir &&
    !isChildPath(inputDir, resolvePath(inputDir, mkdocsYml.docs_dir))
  ) {
    throw new Error(
      `docs_dir configuration value in mkdocs can't be an absolute directory or start with ../ for security reasons.
       Use relative paths instead which are resolved relative to your mkdocs.yml file location.`,
    );
  }
};

/**
 * Update the mkdocs.yml file before TechDocs generator uses it to generate docs site.
 *
 * List of tasks:
 * - Add repo_url if it does not exists
 * If mkdocs.yml has a repo_url, the generated docs site gets an Edit button on the pages by default.
 * If repo_url is missing in mkdocs.yml, we will use techdocs annotation of the entity to possibly get
 * the repository URL.
 *
 * This function will not throw an error since this is not critical to the whole TechDocs pipeline.
 * Instead it will log warnings if there are any errors in reading, parsing or writing YAML.
 *
 * @param {string} mkdocsYmlPath Absolute path to mkdocs.yml or equivalent of a docs site
 * @param {Logger} logger
 * @param {ParsedLocationAnnotation} parsedLocationAnnotation Object with location url and type
 */
export const patchMkdocsYmlPreBuild = async (
  mkdocsYmlPath: string,
  logger: Logger,
  parsedLocationAnnotation: ParsedLocationAnnotation,
) => {
  let mkdocsYmlFileString;
  try {
    mkdocsYmlFileString = await fs.readFile(mkdocsYmlPath, 'utf8');
  } catch (error) {
    logger.warn(
      `Could not read MkDocs YAML config file ${mkdocsYmlPath} before running the generator: ${error.message}`,
    );
    return;
  }

  let mkdocsYml: any;
  try {
    mkdocsYml = yaml.load(mkdocsYmlFileString, { schema: MKDOCS_SCHEMA });

    // mkdocsYml should be an object type after successful parsing.
    // But based on its type definition, it can also be a string or undefined, which we don't want.
    if (typeof mkdocsYml === 'string' || typeof mkdocsYml === 'undefined') {
      throw new Error('Bad YAML format.');
    }
  } catch (error) {
    logger.warn(
      `Error in parsing YAML at ${mkdocsYmlPath} before running the generator. ${error.message}`,
    );
    return;
  }

  // Add repo_url to mkdocs.yml if it is missing. This will enable the Page edit button generated by MkDocs.
  if (!('repo_url' in mkdocsYml)) {
    const repoUrl = getRepoUrlFromLocationAnnotation(parsedLocationAnnotation);
    if (repoUrl !== undefined) {
      // mkdocs.yml will not build with invalid repo_url. So, make sure it is valid.
      if (isValidRepoUrlForMkdocs(repoUrl, parsedLocationAnnotation.type)) {
        mkdocsYml.repo_url = repoUrl;
      }
    }
  }

  try {
    await fs.writeFile(
      mkdocsYmlPath,
      yaml.dump(mkdocsYml, { schema: MKDOCS_SCHEMA }),
      'utf8',
    );
  } catch (error) {
    logger.warn(
      `Could not write to ${mkdocsYmlPath} after updating it before running the generator. ${error.message}`,
    );
    return;
  }
};

/**
 * Update the techdocs_metadata.json to add a new build timestamp metadata. Create the .json file if it doesn't exist.
 *
 * @param {string} techdocsMetadataPath File path to techdocs_metadata.json
 */
export const addBuildTimestampMetadata = async (
  techdocsMetadataPath: string,
  logger: Logger,
): Promise<void> => {
  // check if file exists, create if it does not.
  try {
    await fs.access(techdocsMetadataPath, fs.constants.F_OK);
  } catch (err) {
    // Bootstrap file with empty JSON
    await fs.writeJson(techdocsMetadataPath, JSON.parse('{}'));
  }
  // check if valid Json
  let json;
  try {
    json = await fs.readJson(techdocsMetadataPath);
  } catch (err) {
    const message = `Invalid JSON at ${techdocsMetadataPath} with error ${err.message}`;
    logger.error(message);
    throw new Error(message);
  }

  json.build_timestamp = Date.now();
  await fs.writeJson(techdocsMetadataPath, json);
  return;
};

/**
 * Update the techdocs_metadata.json to add etag of the prepared tree (e.g. commit SHA or actual Etag of the resource).
 * This is helpful to check if a TechDocs site in storage has gone outdated, without maintaining an in-memory build info
 * per Backstage instance.
 *
 * @param {string} techdocsMetadataPath File path to techdocs_metadata.json
 * @param {string} etag
 */
export const storeEtagMetadata = async (
  techdocsMetadataPath: string,
  etag: string,
): Promise<void> => {
  const json = await fs.readJson(techdocsMetadataPath);
  json.etag = etag;
  await fs.writeJson(techdocsMetadataPath, json);
};
