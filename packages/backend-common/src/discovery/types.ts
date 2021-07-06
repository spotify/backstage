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

/**
 * The PluginEndpointDiscovery is used to provide a mechanism for backend
 * plugins to discover the endpoints for itself or other backend plugins.
 *
 * The purpose of the discovery API is to allow for many different deployment
 * setups and routing methods through a central configuration, instead
 * of letting each individual plugin manage that configuration.
 *
 * Implementations of the discovery API can be as simple as a URL pattern
 * using the pluginId, but could also have overrides for individual plugins,
 * or query a separate discovery service.
 */
export type PluginEndpointDiscovery = {
  /**
   * Returns the internal HTTP base URL for a given plugin, without a trailing slash.
   *
   * The returned URL should point to an internal endpoint for the plugin, with
   * the shortest route possible. The URL should be used for service-to-service
   * communication within a Backstage backend deployment.
   *
   * This method must always be called just before making a request, as opposed to
   * fetching the URL when constructing an API client. That is to ensure that more
   * flexible routing patterns can be supported.
   *
   * For example, asking for the URL for `catalog` may return something
   * like `http://10.1.2.3/api/catalog`
   */
  getBaseUrl(pluginId: string): Promise<string>;

  /**
   * Returns the external HTTP base backend URL for a given plugin, without a trailing slash.
   *
   * The returned URL should point to an external endpoint for the plugin, such that
   * it is reachable from the Backstage frontend and other external services. The returned
   * URL should be usable for example as a callback / webhook URL.
   *
   * The returned URL should be stable and in general not change unless other static
   * or external configuration is changed. Changes should not come as a surprise
   * to an operator of the Backstage backend.
   *
   * For example, asking for the URL for `catalog` may return something
   * like `https://backstage.example.com/api/catalog`
   */
  getExternalBaseUrl(pluginId: string): Promise<string>;
};
