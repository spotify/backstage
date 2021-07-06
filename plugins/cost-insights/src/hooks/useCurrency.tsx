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
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useContext,
  PropsWithChildren,
} from 'react';
import { Currency } from '../types';
import { findAlways } from '../utils/assert';
import { defaultCurrencies } from '../utils/currency';

export type CurrencyContextProps = {
  currency: Currency;
  setCurrency: Dispatch<SetStateAction<Currency>>;
};

export const CurrencyContext = React.createContext<
  CurrencyContextProps | undefined
>(undefined);

export const CurrencyProvider = ({ children }: PropsWithChildren<{}>) => {
  const engineers = findAlways(defaultCurrencies, c => c.kind === null);
  const [currency, setCurrency] = useState<Currency>(engineers);
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency(): [Currency, Dispatch<SetStateAction<Currency>>] {
  const context = useContext(CurrencyContext);

  if (!context) {
    assertNever();
  }

  return [context.currency, context.setCurrency];
}

function assertNever(): never {
  throw Error('Cannot use useCurrency outside of CurrencyProvider');
}
