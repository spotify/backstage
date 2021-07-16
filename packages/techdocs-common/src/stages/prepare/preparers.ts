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

import { UrlReader } from '@backstage/backend-common';
import { Entity, parseLocationReference } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { Logger } from 'winston';
import { getDirLocation } from '../../helpers';
import { CommonGitPreparer } from './commonGit';
import { DirectoryPreparer } from './dir';
import { PreparerBase, PreparerBuilder, RemoteProtocol } from './types';
import { UrlPreparer } from './url';

type factoryOptions = {
  logger: Logger;
  reader: UrlReader;
};

export class Preparers implements PreparerBuilder {
  private preparerMap = new Map<RemoteProtocol, PreparerBase>();

  static async fromConfig(
    config: Config,
    { logger, reader }: factoryOptions,
  ): Promise<PreparerBuilder> {
    const preparers = new Preparers();

    const urlPreparer = new UrlPreparer(reader, logger);
    preparers.register('url', urlPreparer);

    /**
     * Dir preparer is a syntactic sugar for users to define techdocs-ref annotation.
     * When using dir preparer, the docs will be fetched using URL Reader.
     */
    const directoryPreparer = new DirectoryPreparer(config, logger, reader);
    preparers.register('dir', directoryPreparer);

    // Common git preparers will be deprecated soon.
    const commonGitPreparer = new CommonGitPreparer(config, logger);
    preparers.register('github', commonGitPreparer);
    preparers.register('gitlab', commonGitPreparer);
    preparers.register('azure/api', commonGitPreparer);

    return preparers;
  }

  register(protocol: RemoteProtocol, preparer: PreparerBase) {
    this.preparerMap.set(protocol, preparer);
  }

  get(entity: Entity): PreparerBase {
    const annotation =
      entity.metadata.annotations?.['backstage.io/techdocs-ref'];
    if (!annotation) {
      throw new InputError(
        `No location annotation provided in entity: ${entity.metadata.name}`,
      );
    }

    // the dir processor handles both `<target>` and `dir:<target>`
    if (getDirLocation(entity) !== undefined) {
      return this.preparerMap.get('dir')!;
    }

    const { type } = parseLocationReference(annotation);
    const preparer = this.preparerMap.get(type as RemoteProtocol);

    if (!preparer) {
      throw new Error(`No preparer registered for type: "${type}"`);
    }

    return preparer;
  }
}
