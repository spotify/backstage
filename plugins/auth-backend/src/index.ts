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

export * from './service/router';
export { IdentityClient } from './identity';
export * from './providers';

// flow package provides 2 functions
// ensuresXRequestedWith and postMessageResponse to safely handle CORS requests for login. The WebMessageResponse type in flow is used to type the response from the login-popup
export * from './lib/flow';

// OAuth wrapper over a passport or a custom `startegy`.
export * from './lib/oauth';
