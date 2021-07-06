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

import {
  getVoidLogger,
  loadBackendConfig,
  SingleHostDiscovery,
} from '@backstage/backend-common';
import { Request, Response } from 'express';
import * as http from 'http';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { buildMiddleware, createRouter } from './router';

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: jest.fn(() => () => undefined),
}));

const mockCreateProxyMiddleware = createProxyMiddleware as jest.MockedFunction<
  typeof createProxyMiddleware
>;

describe('createRouter', () => {
  it('works', async () => {
    const logger = getVoidLogger();
    const config = await loadBackendConfig({ logger, argv: [] });
    const discovery = SingleHostDiscovery.fromConfig(config);
    const router = await createRouter({
      config,
      logger,
      discovery,
    });
    expect(router).toBeDefined();
  });
});

describe('buildMiddleware', () => {
  const logger = getVoidLogger();

  beforeEach(() => {
    mockCreateProxyMiddleware.mockClear();
  });

  it('accepts strings prefixed by /', async () => {
    buildMiddleware('/proxy', logger, '/test', 'http://mocked');

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter, fullConfig] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
      Options,
    ];
    expect(filter('', { method: 'GET', headers: {} })).toBe(true);
    expect(filter('', { method: 'POST', headers: {} })).toBe(true);
    expect(filter('', { method: 'PUT', headers: {} })).toBe(true);
    expect(filter('', { method: 'PATCH', headers: {} })).toBe(true);
    expect(filter('', { method: 'DELETE', headers: {} })).toBe(true);

    expect(fullConfig.pathRewrite).toEqual({ '^/proxy/test/?': '/' });
    expect(fullConfig.changeOrigin).toBe(true);
    expect(fullConfig.logProvider!(logger)).toBe(logger);
  });

  it('accepts routes not prefixed with / when path is not suffixed with /', async () => {
    buildMiddleware('/proxy', logger, 'test', 'http://mocked');

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter, fullConfig] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
      Options,
    ];
    expect(filter('', { method: 'GET', headers: {} })).toBe(true);
    expect(filter('', { method: 'POST', headers: {} })).toBe(true);
    expect(filter('', { method: 'PUT', headers: {} })).toBe(true);
    expect(filter('', { method: 'PATCH', headers: {} })).toBe(true);
    expect(filter('', { method: 'DELETE', headers: {} })).toBe(true);

    expect(fullConfig.pathRewrite).toEqual({ '^/proxy/test/?': '/' });
    expect(fullConfig.changeOrigin).toBe(true);
    expect(fullConfig.logProvider!(logger)).toBe(logger);
  });

  it('accepts routes prefixed with / when path is suffixed with /', async () => {
    buildMiddleware('/proxy/', logger, '/test', 'http://mocked');

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter, fullConfig] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
      Options,
    ];
    expect(filter('', { method: 'GET', headers: {} })).toBe(true);
    expect(filter('', { method: 'POST', headers: {} })).toBe(true);
    expect(filter('', { method: 'PUT', headers: {} })).toBe(true);
    expect(filter('', { method: 'PATCH', headers: {} })).toBe(true);
    expect(filter('', { method: 'DELETE', headers: {} })).toBe(true);

    expect(fullConfig.pathRewrite).toEqual({ '^/proxy/test/?': '/' });
    expect(fullConfig.changeOrigin).toBe(true);
    expect(fullConfig.logProvider!(logger)).toBe(logger);
  });

  it('limits allowedMethods', async () => {
    buildMiddleware('/proxy', logger, '/test', {
      target: 'http://mocked',
      allowedMethods: ['GET', 'DELETE'],
    });

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter, fullConfig] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
      Options,
    ];
    expect(filter('', { method: 'GET', headers: {} })).toBe(true);
    expect(filter('', { method: 'POST', headers: {} })).toBe(false);
    expect(filter('', { method: 'PUT', headers: {} })).toBe(false);
    expect(filter('', { method: 'PATCH', headers: {} })).toBe(false);
    expect(filter('', { method: 'DELETE', headers: {} })).toBe(true);

    expect(fullConfig.pathRewrite).toEqual({ '^/proxy/test/?': '/' });
    expect(fullConfig.changeOrigin).toBe(true);
    expect(fullConfig.logProvider!(logger)).toBe(logger);
  });

  it('permits default headers', async () => {
    buildMiddleware('/proxy', logger, '/test', {
      target: 'http://mocked',
    });

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
    ];

    const testHeaders = {
      'cache-control': 'mocked',
      'content-language': 'mocked',
      'content-length': 'mocked',
      'content-type': 'mocked',
      expires: 'mocked',
      'last-modified': 'mocked',
      pragma: 'mocked',
      host: 'mocked',
      accept: 'mocked',
      'accept-language': 'mocked',
      'user-agent': 'mocked',
      cookie: 'mocked',
    } as Partial<http.IncomingHttpHeaders>;
    const expectedHeaders = {
      ...testHeaders,
    } as Partial<http.IncomingHttpHeaders>;
    delete expectedHeaders.cookie;

    expect(testHeaders).toBeDefined();
    expect(expectedHeaders).toBeDefined();
    expect(testHeaders).not.toEqual(expectedHeaders);
    expect(filter).toBeDefined();

    filter!('', { method: 'GET', headers: testHeaders });

    expect(testHeaders).toEqual(expectedHeaders);
  });

  it('permits default and configured headers', async () => {
    buildMiddleware('/proxy', logger, '/test', {
      target: 'http://mocked',
      headers: {
        Authorization: 'my-token',
      },
    });

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
    ];

    const testHeaders = {
      authorization: 'mocked',
      cookie: 'mocked',
    } as Partial<http.IncomingHttpHeaders>;
    const expectedHeaders = {
      ...testHeaders,
    } as Partial<http.IncomingHttpHeaders>;
    delete expectedHeaders.cookie;

    expect(testHeaders).toBeDefined();
    expect(expectedHeaders).toBeDefined();
    expect(testHeaders).not.toEqual(expectedHeaders);
    expect(filter).toBeDefined();

    filter!('', { method: 'GET', headers: testHeaders });

    expect(testHeaders).toEqual(expectedHeaders);
  });

  it('permits configured headers', async () => {
    buildMiddleware('/proxy', logger, '/test', {
      target: 'http://mocked',
      allowedHeaders: ['authorization', 'cookie'],
    });

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const [filter] = mockCreateProxyMiddleware.mock.calls[0] as [
      (pathname: string, req: Partial<http.IncomingMessage>) => boolean,
    ];

    const testHeaders = {
      authorization: 'mocked',
      cookie: 'mocked',
      'x-auth-request-user': 'mocked',
    } as Partial<http.IncomingHttpHeaders>;
    const expectedHeaders = {
      ...testHeaders,
    } as Partial<http.IncomingHttpHeaders>;
    delete expectedHeaders['x-auth-request-user'];

    expect(testHeaders).toBeDefined();
    expect(expectedHeaders).toBeDefined();
    expect(testHeaders).not.toEqual(expectedHeaders);
    expect(filter).toBeDefined();

    filter!('', { method: 'GET', headers: testHeaders });

    expect(testHeaders).toEqual(expectedHeaders);
  });

  it('responds default headers', async () => {
    buildMiddleware('/proxy', logger, '/test', {
      target: 'http://mocked',
    });

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const config = mockCreateProxyMiddleware.mock.calls[0][1] as Options;

    const testClientResponse = {
      headers: {
        'cache-control': 'value',
        'content-language': 'value',
        'content-length': 'value',
        'content-type': 'value',
        expires: 'value',
        'last-modified': 'value',
        pragma: 'value',
        'set-cookie': ['value'],
      },
    } as Partial<http.IncomingMessage>;

    expect(config).toBeDefined();
    expect(config.onProxyRes).toBeDefined();

    config.onProxyRes!(
      testClientResponse as http.IncomingMessage,
      {} as Request,
      {} as Response,
    );

    expect(Object.keys(testClientResponse.headers!)).toEqual([
      'cache-control',
      'content-language',
      'content-length',
      'content-type',
      'expires',
      'last-modified',
      'pragma',
    ]);
  });

  it('responds configured headers', async () => {
    buildMiddleware('/proxy', logger, '/test', {
      target: 'http://mocked',
      allowedHeaders: ['set-cookie'],
    });

    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    const config = mockCreateProxyMiddleware.mock.calls[0][1] as Options;

    const testClientResponse = {
      headers: {
        'set-cookie': [],
        'x-auth-request-user': 'asd',
      },
    } as Partial<http.IncomingMessage>;

    expect(config).toBeDefined();
    expect(config.onProxyRes).toBeDefined();

    config.onProxyRes!(
      testClientResponse as http.IncomingMessage,
      {} as Request,
      {} as Response,
    );

    expect(Object.keys(testClientResponse.headers!)).toEqual(['set-cookie']);
  });

  it('rejects malformed target URLs', async () => {
    expect(() =>
      buildMiddleware('/proxy', logger, '/test', 'backstage.io'),
    ).toThrowError(/Proxy target is not a valid URL/);
    expect(() =>
      buildMiddleware('/proxy', logger, '/test', { target: 'backstage.io' }),
    ).toThrowError(/Proxy target is not a valid URL/);
  });
});
