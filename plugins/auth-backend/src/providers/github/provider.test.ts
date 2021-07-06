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

import { Profile as PassportProfile } from 'passport';
import { GithubAuthProvider } from './provider';
import * as helpers from '../../lib/passport/PassportStrategyHelper';
import { OAuthResult } from '../../lib/oauth';

const mockFrameHandler = (jest.spyOn(
  helpers,
  'executeFrameHandlerStrategy',
) as unknown) as jest.MockedFunction<
  () => Promise<{
    result: Omit<OAuthResult, 'params'> & { params: { scope: string } };
  }>
>;

describe('GithubAuthProvider', () => {
  const provider = new GithubAuthProvider({
    callbackUrl: 'mock',
    clientId: 'mock',
    clientSecret: 'mock',
  });

  describe('should transform to type OAuthResponse', () => {
    it('when all fields are present, it should be able to map them', async () => {
      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const fullProfile = {
        id: 'uid-123',
        username: 'jimmymarkum',
        provider: 'github',
        displayName: 'Jimmy Markum',
        emails: [
          {
            value: 'jimmymarkum@gmail.com',
          },
        ],
        photos: [
          {
            value:
              'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
          },
        ],
      };

      const params = {
        scope: 'read:scope',
      };

      const expected = {
        backstageIdentity: {
          id: 'jimmymarkum',
        },
        providerInfo: {
          accessToken: '19xasczxcm9n7gacn9jdgm19me',
          expiresInSeconds: undefined,
          idToken: undefined,
          scope: 'read:scope',
        },
        profile: {
          email: 'jimmymarkum@gmail.com',
          displayName: 'Jimmy Markum',
          picture:
            'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
        },
      };

      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile, accessToken, params },
      });
      const { response } = await provider.handler({} as any);
      expect(response).toEqual(expected);
    });

    it('when "email" is missing, it should be able to create the profile without it', async () => {
      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const fullProfile = ({
        id: 'uid-123',
        username: 'jimmymarkum',
        provider: 'github',
        displayName: 'Jimmy Markum',
        emails: null,
        photos: [
          {
            value:
              'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
          },
        ],
      } as unknown) as PassportProfile;

      const params = {
        scope: 'read:scope',
      };

      const expected = {
        backstageIdentity: {
          id: 'jimmymarkum',
        },
        providerInfo: {
          accessToken: '19xasczxcm9n7gacn9jdgm19me',
          expiresInSeconds: undefined,
          idToken: undefined,
          scope: 'read:scope',
        },
        profile: {
          displayName: 'Jimmy Markum',
          picture:
            'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
        },
      };

      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile, accessToken, params },
      });
      const { response } = await provider.handler({} as any);
      expect(response).toEqual(expected);
    });

    it('when "displayName" is missing, it should be able to create the profile and map "displayName" with "username"', async () => {
      const accessToken = '19xasczxcm9n7gacn9jdgm19me';
      const fullProfile = ({
        id: 'uid-123',
        username: 'jimmymarkum',
        provider: 'github',
        displayName: null,
        emails: null,
        photos: [
          {
            value:
              'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
          },
        ],
      } as unknown) as PassportProfile;

      const params = {
        scope: 'read:scope',
      };
      const expected = {
        backstageIdentity: {
          id: 'jimmymarkum',
        },
        providerInfo: {
          accessToken: '19xasczxcm9n7gacn9jdgm19me',
          expiresInSeconds: undefined,
          idToken: undefined,
          scope: 'read:scope',
        },
        profile: {
          displayName: 'jimmymarkum',
          picture:
            'https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters_opt/p-mystic-river-sean-penn.jpg',
        },
      };

      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile, accessToken, params },
      });
      const { response } = await provider.handler({} as any);
      expect(response).toEqual(expected);
    });

    it('when "photos" is missing, it should be able to create the profile without it', async () => {
      const accessToken =
        'ajakljsdoiahoawxbrouawucmbawe.awkxjemaneasdxwe.sodijxqeqwexeqwxe';
      const fullProfile = {
        id: 'ipd12039',
        username: 'daveboyle',
        provider: 'gitlab',
        displayName: 'Dave Boyle',
        emails: [
          {
            value: 'daveboyle@gitlab.org',
          },
        ],
      };

      const params = {
        scope: 'read:user',
      };

      const expected = {
        backstageIdentity: {
          id: 'daveboyle',
        },
        providerInfo: {
          accessToken:
            'ajakljsdoiahoawxbrouawucmbawe.awkxjemaneasdxwe.sodijxqeqwexeqwxe',
          scope: 'read:user',
          expiresInSeconds: undefined,
          idToken: undefined,
        },
        profile: {
          displayName: 'Dave Boyle',
          email: 'daveboyle@gitlab.org',
        },
      };

      mockFrameHandler.mockResolvedValueOnce({
        result: { fullProfile, accessToken, params },
      });
      const { response } = await provider.handler({} as any);
      expect(response).toEqual(expected);
    });
  });
});
