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
import { verifyNonce, encodeState } from './helpers';

describe('OAuthProvider Utils', () => {
  describe('verifyNonce', () => {
    it('should throw error if cookie nonce missing', () => {
      const state = { nonce: 'NONCE', env: 'development' };
      const mockRequest = ({
        cookies: {},
        query: {
          state: encodeState(state),
        },
      } as unknown) as express.Request;
      expect(() => {
        verifyNonce(mockRequest, 'providera');
      }).toThrowError('Auth response is missing cookie nonce');
    });

    it('should throw error if state nonce missing', () => {
      const mockRequest = ({
        cookies: {
          'providera-nonce': 'NONCE',
        },
        query: {},
      } as unknown) as express.Request;
      expect(() => {
        verifyNonce(mockRequest, 'providera');
      }).toThrowError('Invalid state passed via request');
    });

    it('should throw error if nonce mismatch', () => {
      const state = { nonce: 'NONCEB', env: 'development' };
      const mockRequest = ({
        cookies: {
          'providera-nonce': 'NONCEA',
        },
        query: {
          state: encodeState(state),
        },
      } as unknown) as express.Request;
      expect(() => {
        verifyNonce(mockRequest, 'providera');
      }).toThrowError('Invalid nonce');
    });

    it('should not throw any error if nonce matches', () => {
      const state = { nonce: 'NONCE', env: 'development' };
      const mockRequest = ({
        cookies: {
          'providera-nonce': 'NONCE',
        },
        query: {
          state: encodeState(state),
        },
      } as unknown) as express.Request;
      expect(() => {
        verifyNonce(mockRequest, 'providera');
      }).not.toThrow();
    });
  });
});
