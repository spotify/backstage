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

import { showLoginPopup } from './loginPopup';

describe('showLoginPopup', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should show an auth popup', async () => {
    const popupMock = { closed: false };
    const openSpy = jest
      .spyOn(window, 'open')
      .mockReturnValue(popupMock as Window);
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const payloadPromise = showLoginPopup({
      url:
        'my-origin/api/backend/auth/start?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fa%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fb',
      name: 'test-popup',
      origin: 'my-origin',
    });

    expect(openSpy).toBeCalledTimes(1);
    expect(openSpy.mock.calls[0][0]).toBe(
      'my-origin/api/backend/auth/start?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fa%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fb',
    );
    expect(openSpy.mock.calls[0][1]).toBe('test-popup');
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(removeEventListenerSpy).toBeCalledTimes(0);

    const listener = addEventListenerSpy.mock.calls[0][1] as EventListener;

    await expect(Promise.race([payloadPromise, 'waiting'])).resolves.toBe(
      'waiting',
    );

    listener({} as MessageEvent);

    await expect(Promise.race([payloadPromise, 'waiting'])).resolves.toBe(
      'waiting',
    );

    // None of these should be accepted
    listener({ source: popupMock } as MessageEvent);
    listener({ origin: 'my-origin' } as MessageEvent);
    listener({ data: { type: 'authorization_response' } } as MessageEvent);
    listener({
      source: popupMock,
      origin: 'my-origin',
      data: {},
    } as MessageEvent);
    listener({
      source: popupMock,
      origin: 'my-origin',
      data: { type: 'not-auth-result', response: {} },
    } as MessageEvent);

    await expect(Promise.race([payloadPromise, 'waiting'])).resolves.toBe(
      'waiting',
    );

    const myResponse = {};

    // This should be accepted as a valid sessions response
    listener({
      source: popupMock,
      origin: 'my-origin',
      data: {
        type: 'authorization_response',
        response: myResponse,
      },
    } as MessageEvent);

    await expect(payloadPromise).resolves.toBe(myResponse);

    expect(openSpy).toBeCalledTimes(1);
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(removeEventListenerSpy).toBeCalledTimes(1);
  });

  it('should fail if popup returns error', async () => {
    const popupMock = { closed: false };
    const openSpy = jest
      .spyOn(window, 'open')
      .mockReturnValue(popupMock as Window);
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const payloadPromise = showLoginPopup({
      url: 'url',
      name: 'name',
      origin: 'my-origin',
    });

    expect(openSpy).toBeCalledTimes(1);
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(removeEventListenerSpy).toBeCalledTimes(0);

    const listener = addEventListenerSpy.mock.calls[0][1] as EventListener;

    listener({
      source: popupMock,
      origin: 'my-origin',
      data: {
        type: 'authorization_response',
        error: {
          message: 'NOPE',
          name: 'NopeError',
        },
      },
    } as MessageEvent);

    await expect(payloadPromise).rejects.toThrow({
      name: 'NopeError',
      message: 'NOPE',
    });

    expect(openSpy).toBeCalledTimes(1);
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(removeEventListenerSpy).toBeCalledTimes(1);
  });

  it('should fail if popup is closed', async () => {
    const openSpy = jest
      .spyOn(window, 'open')
      .mockReturnValue({ closed: false } as Window);
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const popupMock = { closed: false };

    openSpy.mockReturnValue(popupMock as Window);

    const payloadPromise = showLoginPopup({
      url: 'url',
      name: 'name',
      origin: 'origin',
    });

    expect(openSpy).toBeCalledTimes(1);
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(removeEventListenerSpy).toBeCalledTimes(0);

    const listener = addEventListenerSpy.mock.calls[0][1] as EventListener;
    listener({
      source: popupMock,
      origin: 'origin',
      data: {
        type: 'config_info',
        targetOrigin: 'http://localhost',
      },
    } as MessageEvent);

    setTimeout(() => {
      popupMock.closed = true;
    }, 150);
    await expect(payloadPromise).rejects.toThrow(
      'Login failed, popup was closed',
    );

    expect(openSpy).toBeCalledTimes(1);
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(removeEventListenerSpy).toBeCalledTimes(1);
  });

  it('should indicate if origin does not match', async () => {
    const openSpy = jest
      .spyOn(window, 'open')
      .mockReturnValue({ closed: false } as Window);
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const popupMock = { closed: false };

    openSpy.mockReturnValue(popupMock as Window);

    const payloadPromise = showLoginPopup({
      url: 'url',
      name: 'name',
      origin: 'origin',
    });

    const listener = addEventListenerSpy.mock.calls[0][1] as EventListener;
    listener({
      source: popupMock,
      origin: 'origin',
      data: {
        type: 'config_info',
        targetOrigin: 'http://differenthost',
      },
    } as MessageEvent);

    setTimeout(() => {
      popupMock.closed = true;
    }, 150);
    await expect(payloadPromise).rejects.toThrow(
      'Login failed, Incorrect app origin, expected http://differenthost',
    );

    expect(openSpy).toBeCalledTimes(1);
    expect(addEventListenerSpy).toBeCalledTimes(1);
    expect(removeEventListenerSpy).toBeCalledTimes(1);
  });
});
