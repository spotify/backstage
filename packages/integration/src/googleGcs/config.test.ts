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

import { Config, ConfigReader } from '@backstage/config';
import {
  GoogleGcsIntegrationConfig,
  readGoogleGcsIntegrationConfig,
} from './config';

describe('readGoogleGcsIntegrationConfig', () => {
  function buildConfig(data: Partial<GoogleGcsIntegrationConfig>): Config {
    return new ConfigReader(data);
  }

  it('reads all values', () => {
    const output = readGoogleGcsIntegrationConfig(
      buildConfig({
        privateKey: 'fake-key',
        clientEmail: 'someone@example.com',
      }),
    );
    expect(output).toEqual({
      privateKey: 'fake-key',
      clientEmail: 'someone@example.com',
    });
  });

  it('does not fail when config is not set', () => {
    const output = readGoogleGcsIntegrationConfig(buildConfig({}));
    expect(output).toEqual({});
  });
});
