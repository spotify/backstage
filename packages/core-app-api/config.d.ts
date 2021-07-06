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

export interface Config {
  /**
   * Generic frontend configuration.
   */
  app: {
    /**
     * The public absolute root URL that the frontend.
     * @visibility frontend
     */
    baseUrl: string;

    /**
     * The title of the app, as shown in the Backstage web interface.
     * @visibility frontend
     */
    title?: string;

    /**
     * Information about support of this Backstage instance and how to contact the integrator team.
     */
    support?: {
      /**
       * The primary support url.
       * @visibility frontend
       */
      url: string;
      /**
       * A list of categorized support item groupings.
       */
      items: Array<{
        /**
         * The title of the support item grouping.
         * @visibility frontend
         */
        title: string;
        /**
         * An optional icon for the support item grouping.
         * @visibility frontend
         */
        icon?: string;
        /**
         * A list of support links for the Backstage instance inside this grouping.
         */
        links: Array<{
          /** @visibility frontend */
          url: string;
          /** @visibility frontend */
          title?: string;
        }>;
      }>;
    };
  };

  /**
   * Generic backend configuration.
   */
  backend: {
    /**
     * The public absolute root URL that the backend is reachable at, from the browser's perspective.
     * @visibility frontend
     */
    baseUrl: string;
  };

  /**
   * Configuration that provides information about the organization that the app is for.
   */
  organization?: {
    /**
     * The name of the organization that the app belongs to.
     * @visibility frontend
     */
    name?: string;
  };

  homepage?: {
    clocks?: Array<{
      /** @visibility frontend */
      label: string;
      /** @visibility frontend */
      timezone: string;
    }>;
  };

  /**
   * Configuration that provides information on available configured authentication providers.
   */
  auth?: {
    /**
     * The 'environment' attribute added as an optional parameter to have configurable environment value for `auth.providers`.
     * default value: 'development'
     * optional values: 'development' | 'production'
     * @visibility frontend
     */
    environment?: string;
  };
}
