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

import { PublishSubject, BehaviorSubject } from './subjects';

function observerSpy() {
  return {
    next: jest.fn(),
    error: jest.fn(),
    complete: jest.fn(),
  };
}

describe('PublishSubject', () => {
  it('should be completed', async () => {
    const subj = new PublishSubject<number>();
    subj.complete();

    const spy = observerSpy();
    subj.subscribe(spy);
    await 'a tick';

    expect(spy.next).not.toHaveBeenCalled();
    expect(spy.error).not.toHaveBeenCalled();
    expect(spy.complete).toHaveBeenCalledTimes(1);

    expect(() => subj.next(1)).toThrow('PublishSubject is closed');
    expect(() => subj.error(new Error())).toThrow('PublishSubject is closed');
    expect(() => subj.complete()).toThrow('PublishSubject is closed');

    expect(subj.closed).toBe(true);
  });

  it('should forward values to all subscribers', async () => {
    const subj = new PublishSubject<number>();

    const spy1 = observerSpy();
    const spy2 = observerSpy();
    subj.subscribe(spy1);
    const sub = subj.subscribe(spy2);

    subj.next(42);

    expect(spy1.next).toHaveBeenCalledTimes(1);
    expect(spy1.next).toHaveBeenCalledWith(42);
    expect(spy2.next).toHaveBeenCalledTimes(1);
    expect(spy2.next).toHaveBeenCalledWith(42);

    sub.unsubscribe();

    subj.next(1337);

    expect(spy1.next).toHaveBeenCalledTimes(2);
    expect(spy1.next).toHaveBeenCalledWith(1337);
    expect(spy2.next).toHaveBeenCalledTimes(1);

    expect(spy1.error).not.toHaveBeenCalled();
    expect(spy2.error).not.toHaveBeenCalled();
    expect(spy1.complete).not.toHaveBeenCalled();
    expect(spy2.complete).not.toHaveBeenCalled();

    expect(subj.closed).toBe(false);
  });

  it('should forward errors', async () => {
    const subj = new PublishSubject<number>();

    const spy1 = observerSpy();
    subj.subscribe(spy1);

    const error = new Error('NOPE');
    subj.error(error);
    expect(spy1.error).toHaveBeenCalledWith(error);
    expect(spy1.next).not.toHaveBeenCalled();
    expect(spy1.complete).not.toHaveBeenCalled();

    const spy2 = observerSpy();
    subj.subscribe(spy2);
    await 'a tick';
    expect(spy2.error).toHaveBeenCalledWith(error);
    expect(spy2.next).not.toHaveBeenCalled();
    expect(spy2.complete).not.toHaveBeenCalled();

    expect(subj.closed).toBe(true);
  });
});

describe('BehaviorSubject', () => {
  it('should be completed', async () => {
    const subj = new BehaviorSubject(0);
    subj.complete();

    const next = jest.fn();
    const complete = jest.fn();
    subj.subscribe({ next, complete });
    await 'a tick';

    expect(complete).toHaveBeenCalledTimes(1);

    expect(() => subj.next(1)).toThrow('BehaviorSubject is closed');
    expect(() => subj.error(new Error())).toThrow('BehaviorSubject is closed');
    expect(() => subj.complete()).toThrow('BehaviorSubject is closed');

    expect(subj.closed).toBe(true);
  });

  it('should forward values to all subscribers', async () => {
    const subj = new BehaviorSubject(0);

    const obs1 = jest.fn();
    const obs2 = jest.fn();
    subj.subscribe(obs1);
    const sub = subj.subscribe(obs2);
    await 'a tick';

    expect(obs1).toHaveBeenCalledTimes(1);
    expect(obs1).toHaveBeenCalledWith(0);
    expect(obs2).toHaveBeenCalledTimes(1);
    expect(obs2).toHaveBeenCalledWith(0);

    subj.next(42);

    expect(obs1).toHaveBeenCalledTimes(2);
    expect(obs1).toHaveBeenCalledWith(42);
    expect(obs2).toHaveBeenCalledTimes(2);
    expect(obs2).toHaveBeenCalledWith(42);

    sub.unsubscribe();

    subj.next(1337);

    expect(obs1).toHaveBeenCalledTimes(3);
    expect(obs1).toHaveBeenCalledWith(1337);
    expect(obs2).toHaveBeenCalledTimes(2);

    expect(subj.closed).toBe(false);
  });

  it('should forward errors', async () => {
    const subj = new BehaviorSubject<number>(0);

    const spy1 = observerSpy();
    subj.subscribe(spy1);
    await 'a tick';

    expect(spy1.error).not.toHaveBeenCalled();
    expect(spy1.next).toHaveBeenCalledWith(0);

    const error = new Error('NOPE');
    subj.error(error);
    expect(spy1.error).toHaveBeenCalledWith(error);
    expect(spy1.next).toHaveBeenCalledWith(0);
    expect(spy1.next).toHaveBeenCalledTimes(1);
    expect(spy1.complete).not.toHaveBeenCalled();

    const spy2 = observerSpy();
    subj.subscribe(spy2);
    await 'a tick';
    expect(spy2.error).toHaveBeenCalledWith(error);
    expect(spy2.next).not.toHaveBeenCalled();
    expect(spy2.complete).not.toHaveBeenCalled();

    expect(subj.closed).toBe(true);
  });
});
