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

import { SearchClient } from './apis';

describe('apis', () => {
  const query = {
    term: '',
    filters: {},
    types: [],
    pageCursor: '',
  };

  const baseUrl = 'https://base-url.com/';
  const getBaseUrl = jest.fn().mockResolvedValue(baseUrl);

  const token = 'AUTHTOKEN';
  const withToken = jest.fn().mockResolvedValue(token);
  const withoutToken = jest.fn().mockResolvedValue(undefined);
  const createIdentityApiMock = (getIdToken: any) => ({
    getIdToken,
    getUserId: jest.fn(),
    getProfile: jest.fn(),
    signOut: jest.fn(),
  });

  const client = new SearchClient({
    discoveryApi: { getBaseUrl },
    identityApi: createIdentityApiMock(withoutToken),
  });

  const json = jest.fn();
  const originalFetch = window.fetch;
  window.fetch = jest.fn().mockResolvedValue({ json });

  afterAll(() => {
    window.fetch = originalFetch;
  });

  it('Fetch is called with expected URL (including stringified Q params)', async () => {
    await client.query(query);
    expect(getBaseUrl).toHaveBeenLastCalledWith('search/query');
    expect(fetch).toHaveBeenLastCalledWith(`${baseUrl}?term=&pageCursor=`, {
      headers: {},
    });
  });

  it('Sets Authorization if token is available', async () => {
    const authedClient = new SearchClient({
      discoveryApi: { getBaseUrl },
      identityApi: createIdentityApiMock(withToken),
    });
    await authedClient.query(query);
    expect(getBaseUrl).toHaveBeenLastCalledWith('search/query');
    expect(fetch).toHaveBeenLastCalledWith(`${baseUrl}?term=&pageCursor=`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  it('Resolves JSON from fetch response', async () => {
    const result = { loading: false, error: '', value: {} };
    json.mockReturnValueOnce(result);
    expect(await client.query(query)).toStrictEqual(result);
  });
});
