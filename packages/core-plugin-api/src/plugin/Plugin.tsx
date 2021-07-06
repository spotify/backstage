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
  PluginConfig,
  PluginOutput,
  BackstagePlugin,
  Extension,
  AnyRoutes,
  AnyExternalRoutes,
} from './types';
import { AnyApiFactory } from '../apis';

export class PluginImpl<
  Routes extends AnyRoutes,
  ExternalRoutes extends AnyExternalRoutes
> implements BackstagePlugin<Routes, ExternalRoutes> {
  private storedOutput?: PluginOutput[];

  constructor(private readonly config: PluginConfig<Routes, ExternalRoutes>) {}

  getId(): string {
    return this.config.id;
  }

  getApis(): Iterable<AnyApiFactory> {
    return this.config.apis ?? [];
  }

  get routes(): Routes {
    return this.config.routes ?? ({} as Routes);
  }

  get externalRoutes(): ExternalRoutes {
    return this.config.externalRoutes ?? ({} as ExternalRoutes);
  }

  output(): PluginOutput[] {
    if (this.storedOutput) {
      return this.storedOutput;
    }
    if (!this.config.register) {
      return [];
    }

    const outputs = new Array<PluginOutput>();

    this.config.register({
      featureFlags: {
        register(name) {
          outputs.push({ type: 'feature-flag', name });
        },
      },
    });

    this.storedOutput = outputs;
    return this.storedOutput;
  }

  provide<T>(extension: Extension<T>): T {
    return extension.expose(this);
  }

  toString() {
    return `plugin{${this.config.id}}`;
  }
}

export function createPlugin<
  Routes extends AnyRoutes = {},
  ExternalRoutes extends AnyExternalRoutes = {}
>(
  config: PluginConfig<Routes, ExternalRoutes>,
): BackstagePlugin<Routes, ExternalRoutes> {
  return new PluginImpl(config);
}
