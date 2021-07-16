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

import {
  Git,
  resolveSafeChildPath,
  UrlReader,
} from '@backstage/backend-common';
import {
  Entity,
  getEntitySourceLocation,
  parseLocationReference,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import fs from 'fs-extra';
import parseGitUrl from 'git-url-parse';
import os from 'os';
import path from 'path';
import { Logger } from 'winston';
import { getDefaultBranch } from './default-branch';
import { getGitRepoType, getTokenForGitRepo } from './git-auth';
import { PreparerResponse, RemoteProtocol } from './stages/prepare/types';

export type ParsedLocationAnnotation = {
  type: RemoteProtocol;
  target: string;
};

export const parseReferenceAnnotation = (
  annotationName: string,
  entity: Entity,
): ParsedLocationAnnotation => {
  const annotation = entity.metadata.annotations?.[annotationName];
  if (!annotation) {
    throw new InputError(
      `No location annotation provided in entity: ${entity.metadata.name}`,
    );
  }

  const { type, target } = parseLocationReference(annotation);
  return {
    type: type as RemoteProtocol,
    target,
  };
};

/**
 * Check if the entity provides a `backstage.io/techdocs-ref` annotation of type `dir`
 * and return the annotation. It accepts the two variants `<target>` and `dir:<target>`.
 *
 * @param entity - the entity to check
 */
export const getDirLocation = (
  entity: Entity,
): { type: 'dir'; target: string } | undefined => {
  const annotation = entity.metadata.annotations?.['backstage.io/techdocs-ref'];

  if (!annotation) {
    return undefined;
  }

  if (typeof annotation !== 'string') {
    return undefined;
  }

  // if the string doesn't contain `:`, interpret it as the target of a dir type
  if (!annotation.includes(':')) {
    return { type: 'dir', target: annotation };
  }

  // note that `backstage.io/techdocs-ref: https://...` is invalid and will throw
  const reference = parseLocationReference(annotation);

  if (reference.type === 'dir') {
    return {
      type: 'dir',
      target: reference.target,
    };
  }

  // ignore any other types
  return undefined;
};

/**
 * TechDocs references of type `dir` are relative the source location of the entity.
 * This function transforms relative references to absolute ones, based on the
 * location the entity was ingested from. If the entity was registered by a `url`
 * location, it returns a `url` location with a resolved target that points to the
 * targeted subfolder. If the entity was registered by a `file` location, it returns
 * an absolute `dir` location.
 *
 * @param entity - the entity with annotations
 * @param scmIntegrations - access to the scmIntegrationt to do url transformations
 * @throws if the entity doesn't specify a `dir` location or is ingested from an unsupported location.
 * @returns the transformed location with an absolute target.
 */
export const transformDirLocation = (
  entity: Entity,
  scmIntegrations: ScmIntegrationRegistry,
): { type: 'dir' | 'url'; target: string } => {
  const dirLocation = getDirLocation(entity);

  if (!dirLocation) {
    throw new InputError(
      `No techdocs location annotation provided in entity: ${stringifyEntityRef(
        entity,
      )}`,
    );
  }

  const location = getEntitySourceLocation(entity);

  switch (location.type) {
    case 'url': {
      const target = scmIntegrations.resolveUrl({
        url: dirLocation.target,
        base: location.target,
      });

      return {
        type: 'url',
        target,
      };
    }

    case 'file': {
      // only permit targets in the same folder as the target of the `file` location!
      const target = resolveSafeChildPath(
        path.dirname(location.target),
        dirLocation.target,
      );

      return {
        type: 'dir',
        target,
      };
    }

    default:
      throw new InputError(`Unable to resolve location type ${location.type}`);
  }
};

export const getLocationForEntity = (
  entity: Entity,
  scmIntegration: ScmIntegrationRegistry,
): ParsedLocationAnnotation => {
  // try to resolve relative references first
  if (getDirLocation(entity) !== undefined) {
    return transformDirLocation(entity, scmIntegration);
  }

  const { type, target } = parseReferenceAnnotation(
    'backstage.io/techdocs-ref',
    entity,
  );

  switch (type) {
    case 'github':
    case 'gitlab':
    case 'azure/api':
    case 'url':
      return { type, target };
    default:
      throw new Error(`Invalid reference annotation ${type}`);
  }
};

export const getGitRepositoryTempFolder = async (
  repositoryUrl: string,
  config: Config,
): Promise<string> => {
  const parsedGitLocation = parseGitUrl(repositoryUrl);
  // removes .git from git location path
  parsedGitLocation.git_suffix = false;

  if (!parsedGitLocation.ref) {
    parsedGitLocation.ref = await getDefaultBranch(
      parsedGitLocation.toString('https'),
      config,
    );
  }

  return path.join(
    // fs.realpathSync fixes a problem with macOS returning a path that is a symlink
    fs.realpathSync(os.tmpdir()),
    'backstage-repo',
    parsedGitLocation.resource,
    parsedGitLocation.owner,
    parsedGitLocation.name,
    parsedGitLocation.ref,
  );
};

export const checkoutGitRepository = async (
  repoUrl: string,
  config: Config,
  logger: Logger,
): Promise<string> => {
  const parsedGitLocation = parseGitUrl(repoUrl);
  const repositoryTmpPath = await getGitRepositoryTempFolder(repoUrl, config);
  const token = await getTokenForGitRepo(repoUrl, config);

  // Initialize a git client
  let git = Git.fromAuth({ logger });

  // Docs about why username and password are set to these specific values.
  // https://isomorphic-git.org/docs/en/onAuth#oauth2-tokens
  if (token) {
    const type = getGitRepoType(repoUrl);
    switch (type) {
      case 'github':
        git = Git.fromAuth({
          username: 'x-access-token',
          password: token,
          logger,
        });
        parsedGitLocation.token = `x-access-token:${token}`;
        break;
      case 'gitlab':
        git = Git.fromAuth({
          username: 'oauth2',
          password: token,
          logger,
        });
        parsedGitLocation.token = `dummyUsername:${token}`;
        parsedGitLocation.git_suffix = true;
        break;
      case 'azure/api':
        git = Git.fromAuth({
          username: 'notempty',
          password: token,
          logger: logger,
        });
        break;
      default:
        parsedGitLocation.token = `:${token}`;
    }
  }

  // Pull from repository if it has already been cloned.
  if (fs.existsSync(repositoryTmpPath)) {
    try {
      const currentBranchName = await git.currentBranch({
        dir: repositoryTmpPath,
      });

      await git.fetch({ dir: repositoryTmpPath, remote: 'origin' });
      await git.merge({
        dir: repositoryTmpPath,
        theirs: `origin/${currentBranchName}`,
        ours: currentBranchName || undefined,
        author: { name: 'Backstage TechDocs', email: 'techdocs@backstage.io' },
        committer: {
          name: 'Backstage TechDocs',
          email: 'techdocs@backstage.io',
        },
      });
      return repositoryTmpPath;
    } catch (e) {
      logger.info(
        `Found error "${e.message}" in cached repository "${repoUrl}" when getting latest changes. Removing cached repository.`,
      );
      fs.removeSync(repositoryTmpPath);
    }
  }

  const repositoryCheckoutUrl = parsedGitLocation.toString('https');

  fs.mkdirSync(repositoryTmpPath, { recursive: true });
  await git.clone({ url: repositoryCheckoutUrl, dir: repositoryTmpPath });

  return repositoryTmpPath;
};

export const getLastCommitTimestamp = async (
  repositoryLocation: string,
  logger: Logger,
): Promise<number> => {
  const git = Git.fromAuth({ logger });
  const sha = await git.resolveRef({ dir: repositoryLocation, ref: 'HEAD' });
  const commit = await git.readCommit({ dir: repositoryLocation, sha });

  return commit.commit.committer.timestamp;
};

export const getDocFilesFromRepository = async (
  reader: UrlReader,
  entity: Entity,
  opts?: { etag?: string; logger?: Logger },
): Promise<PreparerResponse> => {
  const { target } = parseReferenceAnnotation(
    'backstage.io/techdocs-ref',
    entity,
  );

  opts?.logger?.debug(`Reading files from ${target}`);
  // readTree will throw NotModifiedError if etag has not changed.
  const readTreeResponse = await reader.readTree(target, { etag: opts?.etag });
  const preparedDir = await readTreeResponse.dir();

  opts?.logger?.debug(`Tree downloaded and stored at ${preparedDir}`);

  return {
    preparedDir,
    etag: readTreeResponse.etag,
  };
};
