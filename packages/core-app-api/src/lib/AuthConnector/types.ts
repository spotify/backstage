/*
 * Copyright 2020 Spotify AB
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

export type CreateSessionOptions = {
  scopes: Set<string>;
  instantPopup?: boolean;
};

/**
 * An AuthConnector is responsible for realizing auth session actions
 * by for example communicating with a backend or interacting with the user.
 */
export type AuthConnector<AuthSession> = {
  createSession(options: CreateSessionOptions): Promise<AuthSession>;
  refreshSession(): Promise<AuthSession>;
  removeSession(): Promise<void>;
};
