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

export interface Config {
  /** Configuration options for the scaffolder plugin */
  scaffolder?: {
    github?: {
      [key: string]: string;
      /**
       * The visibility to set on created repositories.
       */
      visibility?: 'public' | 'internal' | 'private';
    };
    gitlab?: {
      api: { [key: string]: string };
      /**
       * The visibility to set on created repositories.
       */
      visibility?: 'public' | 'internal' | 'private';
    };
    azure?: {
      baseUrl: string;
      api: { [key: string]: string };
    };
    bitbucket?: {
      api: { [key: string]: string };
      /**
       * The visibility to set on created repositories.
       */
      visibility?: 'public' | 'private';
    };
  };
}
