/*
 * Copyright 2021 Spotify AB
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

import { createTemplateAction } from '../actions';
import { FilePreparer, PreparerBuilder } from './prepare';
import { PublisherBuilder } from './publish';
import { TemplaterBuilder, TemplaterValues } from './templater';

type Options = {
  preparers: PreparerBuilder;
  templaters: TemplaterBuilder;
  publishers: PublisherBuilder;
};

export function createLegacyActions(options: Options) {
  const { preparers, templaters, publishers } = options;

  return [
    createTemplateAction({
      id: 'legacy:prepare',
      async handler(ctx) {
        ctx.logger.info('Preparing the skeleton');
        const { protocol, url } = ctx.input;
        const preparer =
          protocol === 'file'
            ? new FilePreparer()
            : preparers.get(url as string);

        await preparer.prepare({
          url: url as string,
          logger: ctx.logger,
          workspacePath: ctx.workspacePath,
        });
      },
    }),
    createTemplateAction({
      id: 'legacy:template',
      async handler(ctx) {
        ctx.logger.info('Running the templater');
        const templater = templaters.get(ctx.input.templater as string);
        await templater.run({
          workspacePath: ctx.workspacePath,
          logStream: ctx.logStream,
          values: ctx.input.values as TemplaterValues,
        });
      },
    }),
    createTemplateAction({
      id: 'legacy:publish',
      async handler(ctx) {
        const { values } = ctx.input;
        if (
          typeof values !== 'object' ||
          values === null ||
          Array.isArray(values)
        ) {
          throw new Error(
            `Invalid values passed to publish, got ${typeof values}`,
          );
        }
        const storePath = values.storePath as unknown;
        if (typeof storePath !== 'string') {
          throw new Error(
            `Invalid store path passed to publish, got ${typeof storePath}`,
          );
        }
        const owner = values.owner as unknown;
        if (typeof owner !== 'string') {
          throw new Error(
            `Invalid owner passed to publish, got ${typeof owner}`,
          );
        }

        const publisher = publishers.get(storePath);
        ctx.logger.info('Will now store the template');
        const { remoteUrl, catalogInfoUrl } = await publisher.publish({
          values: {
            ...values,
            owner,
            storePath,
          },
          workspacePath: ctx.workspacePath,
          logger: ctx.logger,
        });
        ctx.output('remoteUrl', remoteUrl);
        if (catalogInfoUrl) {
          ctx.output('catalogInfoUrl', catalogInfoUrl);
        }
      },
    }),
  ];
}
