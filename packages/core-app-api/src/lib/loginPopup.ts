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

/**
 * Options used to open a login popup.
 */
export type LoginPopupOptions = {
  /**
   * The URL that the auth popup should point to
   */
  url: string;

  /**
   * The name of the popup, as in second argument to window.open
   */
  name: string;

  /**
   * The origin of the final popup page that will post a message to this window.
   */
  origin: string;

  /**
   * The width of the popup in pixels, defaults to 500
   */
  width?: number;

  /**
   * The height of the popup in pixels, defaults to 700
   */
  height?: number;
};

type AuthResult =
  | {
      type: 'authorization_response';
      response: unknown;
    }
  | {
      type: 'authorization_response';
      error: {
        name: string;
        message: string;
      };
    };

/**
 * Show a popup pointing to a URL that starts an auth flow. Implementing the receiving
 * end of the postMessage mechanism outlined in https://tools.ietf.org/html/draft-sakimura-oauth-wmrm-00
 *
 * The redirect handler of the flow should use postMessage to communicate back
 * to the app window. The message posted to the app must match the AuthResult type.
 *
 * The returned promise resolves to the response of the message that was posted from the auth popup.
 */
export function showLoginPopup(options: LoginPopupOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    const width = options.width || 500;
    const height = options.height || 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      options.url,
      options.name,
      `menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=${width},height=${height},top=${top},left=${left}`,
    );

    let targetOrigin = '';

    if (!popup || typeof popup.closed === 'undefined' || popup.closed) {
      const error = new Error('Failed to open auth popup.');
      error.name = 'PopupRejectedError';
      reject(error);
      return;
    }

    const messageListener = (event: MessageEvent) => {
      if (event.source !== popup) {
        return;
      }
      if (event.origin !== options.origin) {
        return;
      }
      const { data } = event;

      if (data.type === 'config_info') {
        targetOrigin = data.targetOrigin;
        return;
      }

      if (data.type !== 'authorization_response') {
        return;
      }
      const authResult = data as AuthResult;

      if ('error' in authResult) {
        const error = new Error(authResult.error.message);
        error.name = authResult.error.name;
        // TODO: proper error type
        // error.extra = authResult.error.extra;
        reject(error);
      } else {
        resolve(authResult.response);
      }
      done();
    };

    const intervalId = setInterval(() => {
      if (popup.closed) {
        const errMessage = `Login failed, ${
          targetOrigin && targetOrigin !== window.location.origin
            ? `Incorrect app origin, expected ${targetOrigin}`
            : 'popup was closed'
        }`;
        const error = new Error(errMessage);
        error.name = 'PopupClosedError';
        reject(error);
        done();
      }
    }, 100);

    function done() {
      window.removeEventListener('message', messageListener);
      clearInterval(intervalId);
    }

    window.addEventListener('message', messageListener);
  });
}
