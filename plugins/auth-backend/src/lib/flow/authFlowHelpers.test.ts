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

import express from 'express';
import {
  safelyEncodeURIComponent,
  ensuresXRequestedWith,
  postMessageResponse,
} from './authFlowHelpers';
import { WebMessageResponse } from './types';

describe('oauth helpers', () => {
  describe('safelyEncodeURIComponent', () => {
    it('encodes all occurrences of single quotes', () => {
      expect(safelyEncodeURIComponent("a'ö'b")).toBe('a%27%C3%B6%27b');
    });
  });

  describe('postMessageResponse', () => {
    const appOrigin = 'http://localhost:3000';
    it('should post a message back with payload success', () => {
      const mockResponse = ({
        end: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
      } as unknown) as express.Response;

      const data: WebMessageResponse = {
        type: 'authorization_response',
        response: {
          providerInfo: {
            accessToken: 'ACCESS_TOKEN',
            idToken: 'ID_TOKEN',
            expiresInSeconds: 10,
            scope: 'email',
          },
          profile: {
            email: 'foo@bar.com',
          },
          backstageIdentity: {
            id: 'a',
            idToken: 'a.b.c',
          },
        },
      };
      const encoded = safelyEncodeURIComponent(JSON.stringify(data));

      postMessageResponse(mockResponse, appOrigin, data);
      expect(mockResponse.setHeader).toBeCalledTimes(3);
      expect(mockResponse.end).toBeCalledTimes(1);
      expect(mockResponse.end).toBeCalledWith(expect.stringContaining(encoded));
    });

    it('should post a message back with payload error', () => {
      const mockResponse = ({
        end: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
      } as unknown) as express.Response;

      const data: WebMessageResponse = {
        type: 'authorization_response',
        error: new Error('Unknown error occurred'),
      };
      const encoded = safelyEncodeURIComponent(JSON.stringify(data));

      postMessageResponse(mockResponse, appOrigin, data);
      expect(mockResponse.setHeader).toBeCalledTimes(3);
      expect(mockResponse.end).toBeCalledTimes(1);
      expect(mockResponse.end).toBeCalledWith(expect.stringContaining(encoded));
    });

    it('should call postMessage twice but only one of them with target *', () => {
      let responseBody = '';

      const mockResponse = ({
        end: jest.fn(body => {
          responseBody = body;
          return this;
        }),
        setHeader: jest.fn().mockReturnThis(),
      } as unknown) as express.Response;

      const data: WebMessageResponse = {
        type: 'authorization_response',
        response: {
          providerInfo: {
            accessToken: 'ACCESS_TOKEN',
            idToken: 'ID_TOKEN',
            expiresInSeconds: 10,
            scope: 'email',
          },
          profile: {
            email: 'foo@bar.com',
          },
          backstageIdentity: {
            id: 'a',
            idToken: 'a.b.c',
          },
        },
      };
      postMessageResponse(mockResponse, appOrigin, data);
      expect(responseBody.match(/.postMessage\(/g)).toHaveLength(2);
      expect(
        responseBody.match(/.postMessage\([a-zA-z.()]*, \'\*\'\)/g),
      ).toHaveLength(1);

      const errData: WebMessageResponse = {
        type: 'authorization_response',
        error: new Error('Unknown error occurred'),
      };
      postMessageResponse(mockResponse, appOrigin, errData);
      expect(responseBody.match(/.postMessage\(/g)).toHaveLength(2);
      expect(
        responseBody.match(/.postMessage\([a-zA-z.()]*, \'\*\'\)/g),
      ).toHaveLength(1);
    });

    it('handles single quotes and unicode chars safely', () => {
      const mockResponse = ({
        end: jest.fn().mockReturnThis(),
        setHeader: jest.fn().mockReturnThis(),
      } as unknown) as express.Response;

      const data: WebMessageResponse = {
        type: 'authorization_response',
        response: {
          providerInfo: {
            accessToken: 'ACCESS_TOKEN',
            idToken: 'ID_TOKEN',
            expiresInSeconds: 10,
            scope: 'email',
          },
          profile: {
            email: 'foo@bar.com',
            displayName: "Adam l'Hôpital",
          },
          backstageIdentity: {
            id: 'a',
            idToken: 'a.b.c',
          },
        },
      };

      postMessageResponse(mockResponse, appOrigin, data);
      expect(mockResponse.setHeader).toBeCalledTimes(3);
      expect(mockResponse.end).toBeCalledTimes(1);
      expect(mockResponse.end).toBeCalledWith(
        expect.stringContaining('Adam%20l%27H%C3%B4pital'),
      );
    });
  });

  describe('ensuresXRequestedWith', () => {
    it('should return false if no header present', () => {
      const mockRequest = ({
        header: () => jest.fn(),
      } as unknown) as express.Request;
      expect(ensuresXRequestedWith(mockRequest)).toBe(false);
    });

    it('should return false if header present with incorrect value', () => {
      const mockRequest = ({
        header: () => 'INVALID',
      } as unknown) as express.Request;
      expect(ensuresXRequestedWith(mockRequest)).toBe(false);
    });

    it('should return true if header present with correct value', () => {
      const mockRequest = ({
        header: () => 'XMLHttpRequest',
      } as unknown) as express.Request;
      expect(ensuresXRequestedWith(mockRequest)).toBe(true);
    });
  });
});
