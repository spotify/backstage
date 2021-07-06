/*
 * Copyright 2021 The Backstage Authors
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
import { Request } from 'express';
import { UrlReader } from '@backstage/backend-common';
import { InputError, NotFoundError } from '@backstage/errors';
import {
  Entity,
  getEntitySourceLocation,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { ScmIntegration, ScmIntegrations } from '@backstage/integration';
import { AggregateCoverage, FileEntry, JsonCodeCoverage } from './types';

export const calculatePercentage = (
  available: number,
  covered: number,
): number => {
  if (available === 0) {
    return 0;
  }
  return parseFloat(((covered / available) * 100).toFixed(2));
};

export const aggregateCoverage = (c: JsonCodeCoverage): AggregateCoverage => {
  let availableLine = 0;
  let coveredLine = 0;
  let availableBranch = 0;
  let coveredBranch = 0;
  c.files.forEach(f => {
    availableLine += Object.keys(f.lineHits).length;
    coveredLine += Object.values(f.lineHits).filter(l => l > 0).length;

    availableBranch += Object.keys(f.branchHits)
      .map(b => parseInt(b, 10))
      .map((b: number) => f.branchHits[b].available)
      .filter(Boolean)
      .reduce((acc, curr) => acc + curr, 0);
    coveredBranch += Object.keys(f.branchHits)
      .map(b => parseInt(b, 10))
      .map((b: number) => f.branchHits[b].covered)
      .filter(Boolean)
      .reduce((acc, curr) => acc + curr, 0);
  });

  return {
    timestamp: c.metadata.generationTime,
    branch: {
      available: availableBranch,
      covered: coveredBranch,
      missed: availableBranch - coveredBranch,
      percentage: calculatePercentage(availableBranch, coveredBranch),
    },
    line: {
      available: availableLine,
      covered: coveredLine,
      missed: availableLine - coveredLine,
      percentage: calculatePercentage(availableLine, coveredLine),
    },
  };
};

export class CoverageUtils {
  constructor(
    readonly scm: Partial<ScmIntegrations>,
    readonly urlReader: Partial<UrlReader>,
  ) {}

  async processCoveragePayload(
    entity: Entity,
    req: Request,
  ): Promise<{
    sourceLocation?: string;
    vcs?: ScmIntegration;
    scmFiles: string[];
    body: {};
  }> {
    const enforceScmFiles =
      entity.metadata.annotations?.['backstage.io/code-coverage'] ===
        'scm-only' || false;

    let sourceLocation: string | undefined = undefined;
    let vcs: ScmIntegration | undefined = undefined;
    let scmFiles: string[] = [];

    if (enforceScmFiles) {
      try {
        const sl = getEntitySourceLocation(entity);
        sourceLocation = sl.target;
      } catch (e: unknown) {
        // TODO: logging
      }

      if (!sourceLocation) {
        throw new InputError(
          `No "backstage.io/source-location" annotation on entity ${stringifyEntityRef(
            entity,
          )}`,
        );
      }

      vcs = this.scm.byUrl?.(sourceLocation);
      if (!vcs) {
        throw new InputError(`Unable to determine SCM from ${sourceLocation}`);
      }

      const scmTree = await this.urlReader.readTree?.(sourceLocation);
      if (!scmTree) {
        throw new NotFoundError(`Unable to read tree from ${sourceLocation}`);
      }
      scmFiles = (await scmTree.files()).map(f => f.path);
    }

    const body = this.validateRequestBody(req);
    if (Object.keys(body).length === 0) {
      throw new InputError('Unable to parse body');
    }

    return {
      sourceLocation,
      vcs,
      scmFiles,
      body,
    };
  }

  async buildCoverage(
    entity: Entity,
    sourceLocation: string | undefined,
    vcs: ScmIntegration | undefined,
    files: FileEntry[],
  ): Promise<JsonCodeCoverage> {
    return {
      metadata: {
        vcs: {
          type: vcs?.type || 'unknown',
          location: sourceLocation || 'unknown',
        },
        generationTime: Date.now(),
      },
      entity: {
        name: entity.metadata.name,
        namespace: entity.metadata.namespace || 'default',
        kind: entity.kind,
      },
      files,
    };
  }

  validateRequestBody(req: Request) {
    const contentType = req.headers['content-type'];
    if (!contentType) {
      throw new InputError('Content-Type missing');
    } else if (!contentType.match(/^text\/xml($|;)/)) {
      throw new InputError('Illegal Content-Type');
    }
    const body = req.body;
    if (!body) {
      throw new InputError('Missing request body');
    }
    return body;
  }
}
