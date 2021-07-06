/*
 * Copyright 2021 The Backstage Authors
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
import { TransactionValue } from './TransactionValue';
import { Knex } from 'knex';
import { BackgroundContext } from './BackgroundContext';

describe('TransactionValue Context', () => {
  it('should be able to store tx values and retrieve them from a context', () => {
    const tx = {} as Knex.Transaction;
    const ctx = new BackgroundContext();

    const nextCtx = TransactionValue.in(ctx, tx);

    expect(TransactionValue.from(nextCtx)).toBe(tx);
  });

  it('should throw when there is no tx value in the context', () => {
    const ctx = new BackgroundContext();

    expect(() => TransactionValue.from(ctx)).toThrow(
      /No transaction available in context/,
    );
  });
});
