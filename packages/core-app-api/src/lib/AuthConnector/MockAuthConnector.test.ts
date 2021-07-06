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

import { MockAuthConnector, mockAccessToken } from './MockAuthConnector';

describe('MockAuthConnector', () => {
  it('should return mock tokens', async () => {
    const helper = new MockAuthConnector();

    await expect(helper.createSession()).resolves.toEqual({
      accessToken: mockAccessToken,
      expiresAt: expect.any(Date),
      scopes: expect.any(String),
    });

    await expect(helper.refreshSession()).resolves.toEqual({
      accessToken: mockAccessToken,
      expiresAt: expect.any(Date),
      scopes: expect.any(String),
    });
  });
});
