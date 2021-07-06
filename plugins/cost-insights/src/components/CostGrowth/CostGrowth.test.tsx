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

import React, { PropsWithChildren } from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { CostGrowth } from './CostGrowth';
import { Currency, CurrencyType, Duration } from '../../types';
import { findAlways } from '../../utils/assert';
import { MockConfigProvider, MockCurrencyProvider } from '../../testUtils';
import { defaultCurrencies } from '../../utils/currency';

const engineers = findAlways(defaultCurrencies, c => c.kind === null);
const usd = findAlways(defaultCurrencies, c => c.kind === CurrencyType.USD);
const carbon = findAlways(
  defaultCurrencies,
  c => c.kind === CurrencyType.CarbonOffsetTons,
);

const MockContext = ({
  children,
  currency,
  engineerCost,
}: PropsWithChildren<{
  currency: Currency;
  engineerCost: number;
}>) => (
  <MockConfigProvider engineerCost={engineerCost}>
    <MockCurrencyProvider currency={currency}>{children}</MockCurrencyProvider>
  </MockConfigProvider>
);

describe.each`
  engineerCost | ratio           | amount     | expected
  ${200_000}   | ${0}            | ${0}       | ${'Negligible'}
  ${200_000}   | ${0}            | ${8_333}   | ${'Negligible'}
  ${200_000}   | ${undefined}    | ${10_000}  | ${`~1 ${engineers.unit}`}
  ${200_000}   | ${0.000000001}  | ${8_334}   | ${`0% or ~1 ${engineers.unit}`}
  ${200_000}   | ${-0.000000001} | ${10_000}  | ${`0% or ~1 ${engineers.unit}`}
  ${200_000}   | ${-0.8}         | ${10_000}  | ${`80% or ~1 ${engineers.unit}`}
  ${200_000}   | ${3}            | ${600_000} | ${`300% or ~36 ${engineers.unit}s`}
`('<CostGrowth />', ({ engineerCost, ratio, amount, expected }) => {
  it(`formats ${engineers.unit}s correctly for ${expected}`, async () => {
    const { getByText } = await renderInTestApp(
      <MockContext engineerCost={engineerCost} currency={engineers}>
        <CostGrowth change={{ ratio, amount }} duration={Duration.P30D} />
      </MockContext>,
    );
    expect(getByText(expected)).toBeInTheDocument();
  });
});

describe.each`
  engineerCost | ratio           | amount     | expected
  ${200_000}   | ${0}            | ${0}       | ${'Negligible'}
  ${200_000}   | ${0}            | ${8_333}   | ${'Negligible'}
  ${200_000}   | ${undefined}    | ${-1_000}  | ${'Negligible'}
  ${200_000}   | ${undefined}    | ${1_000}   | ${'Negligible'}
  ${200_000}   | ${undefined}    | ${10_000}  | ${'~$10,000'}
  ${200_000}   | ${0.000000001}  | ${8_334}   | ${'0% or ~$8,334'}
  ${200_000}   | ${-0.000000001} | ${10_000}  | ${'0% or ~$10,000'}
  ${200_000}   | ${-0.8}         | ${10_000}  | ${'80% or ~$10,000'}
  ${200_000}   | ${3}            | ${600_000} | ${'300% or ~$600,000'}
`('<CostGrowth />', ({ engineerCost, ratio, amount, expected }) => {
  it(`formats ${usd.unit}s correctly for ${expected}`, async () => {
    const { getByText } = await renderInTestApp(
      <MockContext engineerCost={engineerCost} currency={usd}>
        <CostGrowth change={{ ratio, amount }} duration={Duration.P30D} />
      </MockContext>,
    );
    expect(getByText(expected)).toBeInTheDocument();
  });
});

describe.each`
  engineerCost | ratio           | amount     | expected
  ${200_000}   | ${0}            | ${0}       | ${'Negligible'}
  ${200_000}   | ${0}            | ${8_333}   | ${'Negligible'}
  ${200_000}   | ${undefined}    | ${1_000}   | ${'Negligible'}
  ${200_000}   | ${undefined}    | ${10_000}  | ${`~2,857 ${carbon.unit}s`}
  ${200_000}   | ${0.000000001}  | ${8_334}   | ${`0% or ~2,381 ${carbon.unit}s`}
  ${200_000}   | ${-0.000000001} | ${10_000}  | ${`0% or ~2,857 ${carbon.unit}s`}
  ${200_000}   | ${-0.8}         | ${10_000}  | ${`80% or ~2,857 ${carbon.unit}s`}
  ${200_000}   | ${3}            | ${600_000} | ${`300% or ~171,429 ${carbon.unit}s`}
`('<CostGrowth />', ({ engineerCost, ratio, amount, expected }) => {
  it(`formats ${carbon.unit}s correctly for ${expected}`, async () => {
    const { getByText } = await renderInTestApp(
      <MockContext engineerCost={engineerCost} currency={carbon}>
        <CostGrowth change={{ ratio, amount }} duration={Duration.P30D} />
      </MockContext>,
    );
    expect(getByText(expected)).toBeInTheDocument();
  });
});
