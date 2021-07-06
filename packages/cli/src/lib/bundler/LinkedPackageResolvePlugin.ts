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

import { resolve as resolvePath } from 'path';
import { ResolvePlugin } from 'webpack';
import { isChildPath } from '@backstage/cli-common';
import { LernaPackage } from './types';

// Enables proper resolution of packages when linking in external packages.
// Without this the packages would depend on dependencies in the node_modules
// of the external packages themselves, leading to module duplication
export class LinkedPackageResolvePlugin implements ResolvePlugin {
  constructor(
    private readonly targetModules: string,
    private readonly packages: LernaPackage[],
  ) {}

  apply(resolver: any) {
    resolver.hooks.resolve.tapAsync(
      'LinkedPackageResolvePlugin',
      (
        data: {
          request: string;
          path?: false | string;
          context?: { issuer?: string };
        },
        context: unknown,
        callback: () => void,
      ) => {
        const pkg = this.packages.find(
          pkge => data.path && isChildPath(pkge.location, data.path),
        );
        if (!pkg) {
          callback();
          return;
        }

        // pkg here is an external package. We rewrite the context of any imports to resolve
        // from the location of the package within the node_modules of the target root rather
        // than the real location of the external package.
        const modulesLocation = resolvePath(this.targetModules, pkg.name);
        const newContext = data.context?.issuer
          ? {
              ...data.context,
              issuer: data.context.issuer.replace(
                pkg.location,
                modulesLocation,
              ),
            }
          : data.context;

        // Re-run resolution but this time from the point of view of our target monorepo rather
        // than the location of the external package. By resolving modules using this method we avoid
        // pulling in e.g. `react` from the external repo, which would otherwise lead to conflicts.
        resolver.doResolve(
          resolver.hooks.resolve,
          {
            ...data,
            context: newContext,
            path: data.path && data.path.replace(pkg.location, modulesLocation),
          },
          `resolve ${data.request} in ${modulesLocation}`,
          context,
          callback,
        );
      },
    );
  }
}
