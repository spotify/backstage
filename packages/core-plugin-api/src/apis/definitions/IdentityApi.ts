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
import { ApiRef, createApiRef } from '../system';
import { ProfileInfo } from './auth';

/**
 * The Identity API used to identify and get information about the signed in user.
 */
export type IdentityApi = {
  /**
   * The ID of the signed in user. This ID is not meant to be presented to the user, but used
   * as an opaque string to pass on to backends or use in frontend logic.
   *
   * TODO: The intention of the user ID is to be able to tie the user to an identity
   *       that is known by the catalog and/or identity backend. It should for example
   *       be possible to fetch all owned components using this ID.
   */
  getUserId(): string;

  /**
   * The profile of the signed in user.
   */
  getProfile(): ProfileInfo;

  /**
   * An OpenID Connect ID Token which proves the identity of the signed in user.
   *
   * The ID token will be undefined if the signed in user does not have a verified
   * identity, such as a demo user or mocked user for e2e tests.
   */
  getIdToken(): Promise<string | undefined>;

  /**
   * Sign out the current user
   */
  signOut(): Promise<void>;
};

export const identityApiRef: ApiRef<IdentityApi> = createApiRef({
  id: 'core.identity',
});
