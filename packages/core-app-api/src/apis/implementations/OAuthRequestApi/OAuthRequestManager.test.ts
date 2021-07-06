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

import ProviderIcon from '@material-ui/icons/AcUnit';
import { OAuthRequestManager } from './OAuthRequestManager';

describe('OAuthRequestManager', () => {
  it('should forward a requests', async () => {
    const manager = new OAuthRequestManager();

    const reqSpy = jest.fn();
    manager.authRequest$().subscribe(reqSpy);

    const requester = manager.createAuthRequester({
      provider: {
        title: 'My Provider',
        icon: ProviderIcon,
      },
      onAuthRequest: async () => 'hello',
    });

    expect(reqSpy).toHaveBeenCalledTimes(0);
    await 'a tick';
    expect(reqSpy).toHaveBeenCalledTimes(2);
    expect(reqSpy).toHaveBeenLastCalledWith([]);

    const req = requester(new Set(['my-scope']));

    expect(reqSpy).toHaveBeenCalledTimes(3);
    expect(reqSpy).toHaveBeenLastCalledWith([
      expect.objectContaining({
        reject: expect.any(Function),
        trigger: expect.any(Function),
      }),
    ]);

    await expect(Promise.race([req, Promise.resolve('not yet')])).resolves.toBe(
      'not yet',
    );

    const [request] = reqSpy.mock.calls[2][0];
    request.trigger();

    await expect(req).resolves.toBe('hello');
  });
});
