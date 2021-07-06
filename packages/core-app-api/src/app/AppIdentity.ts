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

import { IdentityApi, ProfileInfo } from '@backstage/core-plugin-api';
import { SignInResult } from './types';

/**
 * Implementation of the connection between the App-wide IdentityApi
 * and sign-in page.
 */
export class AppIdentity implements IdentityApi {
  private hasIdentity = false;
  private userId?: string;
  private profile?: ProfileInfo;
  private idTokenFunc?: () => Promise<string>;
  private signOutFunc?: () => Promise<void>;

  getUserId(): string {
    if (!this.hasIdentity) {
      throw new Error(
        'Tried to access IdentityApi userId before app was loaded',
      );
    }
    return this.userId!;
  }

  getProfile(): ProfileInfo {
    if (!this.hasIdentity) {
      throw new Error(
        'Tried to access IdentityApi profile before app was loaded',
      );
    }
    return this.profile!;
  }

  async getIdToken(): Promise<string | undefined> {
    if (!this.hasIdentity) {
      throw new Error(
        'Tried to access IdentityApi idToken before app was loaded',
      );
    }
    return this.idTokenFunc?.();
  }

  async signOut(): Promise<void> {
    if (!this.hasIdentity) {
      throw new Error(
        'Tried to access IdentityApi signOutFunc before app was loaded',
      );
    }
    await this.signOutFunc?.();
    location.reload();
  }

  // This is indirectly called by the sign-in page to continue into the app.
  setSignInResult(result: SignInResult) {
    if (this.hasIdentity) {
      return;
    }
    if (!result.userId) {
      throw new Error('Invalid sign-in result, userId not set');
    }
    if (!result.profile) {
      throw new Error('Invalid sign-in result, profile not set');
    }
    this.hasIdentity = true;
    this.userId = result.userId;
    this.profile = result.profile;
    this.idTokenFunc = result.getIdToken;
    this.signOutFunc = result.signOut;
  }
}
