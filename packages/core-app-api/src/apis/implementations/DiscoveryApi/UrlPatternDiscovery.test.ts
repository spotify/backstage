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

import { UrlPatternDiscovery } from './UrlPatternDiscovery';

describe('UrlPatternDiscovery', () => {
  it('should not require interpolation', async () => {
    const discoveryApi = UrlPatternDiscovery.compile('http://example.com');
    await expect(discoveryApi.getBaseUrl('my-plugin')).resolves.toBe(
      'http://example.com',
    );
  });

  it('should use a plain pattern', async () => {
    const discoveryApi = UrlPatternDiscovery.compile(
      'http://localhost:7000/{{ pluginId }}',
    );
    await expect(discoveryApi.getBaseUrl('my-plugin')).resolves.toBe(
      'http://localhost:7000/my-plugin',
    );
  });

  it('should allow for multiple interpolation points', async () => {
    const discoveryApi = UrlPatternDiscovery.compile(
      'https://{{pluginId   }}.example.com/api/{{ pluginId}}',
    );
    await expect(discoveryApi.getBaseUrl('my-plugin')).resolves.toBe(
      'https://my-plugin.example.com/api/my-plugin',
    );
  });

  it('should validate that the pattern is a valid URL', () => {
    expect(() => {
      UrlPatternDiscovery.compile('example.com');
    }).toThrow('Invalid discovery URL pattern, Invalid URL: example.com');

    expect(() => {
      UrlPatternDiscovery.compile('http://');
    }).toThrow('Invalid discovery URL pattern, Invalid URL: http://');

    expect(() => {
      UrlPatternDiscovery.compile('abc123');
    }).toThrow('Invalid discovery URL pattern, Invalid URL: abc123');

    expect(() => {
      UrlPatternDiscovery.compile('http://example.com:{{pluginId}}');
    }).toThrow(
      'Invalid discovery URL pattern, Invalid URL: http://example.com:pluginId',
    );

    expect(() => {
      UrlPatternDiscovery.compile('/{{pluginId}}');
    }).toThrow('Invalid discovery URL pattern, Invalid URL: /pluginId');

    expect(() => {
      UrlPatternDiscovery.compile('http://localhost/{{pluginId}}?forbidden');
    }).toThrow('Invalid discovery URL pattern, URL must not have a query');

    expect(() => {
      UrlPatternDiscovery.compile('http://localhost/{{pluginId}}#forbidden');
    }).toThrow('Invalid discovery URL pattern, URL must not have a hash');

    expect(() => {
      UrlPatternDiscovery.compile('http://localhost/{{pluginId}}/');
    }).toThrow('Invalid discovery URL pattern, URL must not end with a slash');

    expect(() => {
      UrlPatternDiscovery.compile('http://localhost/');
    }).toThrow('Invalid discovery URL pattern, URL must not end with a slash');
  });
});
