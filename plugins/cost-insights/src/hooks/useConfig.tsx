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
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Config as BackstageConfig } from '@backstage/config';
import { Currency, Icon, Metric, Product } from '../types';
import { getIcon } from '../utils/navigation';
import { validateMetrics } from '../utils/config';
import { defaultCurrencies } from '../utils/currency';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

/*
 * Config schema 2020-10-15
 *
 * costInsights:
 *   engineerCost: 200000
 *   products:
 *     productA:
 *       name: Product A
 *       icon: storage
 *     productB:
 *       name: Product B
 *       icon: data
 *   metrics:
 *     metricA:
 *       name: Metric A
 *       default: true
 *     metricB:
 *       name: Metric B
 */

export type ConfigContextProps = {
  metrics: Metric[];
  products: Product[];
  icons: Icon[];
  engineerCost: number;
  currencies: Currency[];
};

export const ConfigContext = createContext<ConfigContextProps | undefined>(
  undefined,
);

const defaultState: ConfigContextProps = {
  metrics: [],
  products: [],
  icons: [],
  engineerCost: 0,
  currencies: defaultCurrencies,
};

export const ConfigProvider = ({ children }: PropsWithChildren<{}>) => {
  const c: BackstageConfig = useApi(configApiRef);
  const [config, setConfig] = useState(defaultState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function getProducts(): Product[] {
      const products = c.getConfig('costInsights.products');
      return products.keys().map(key => ({
        kind: key,
        name: products.getString(`${key}.name`),
        aggregation: [0, 0],
      }));
    }

    function getMetrics(): Metric[] {
      const metrics = c.getOptionalConfig('costInsights.metrics');
      if (metrics) {
        return metrics.keys().map(key => ({
          kind: key,
          name: metrics.getString(`${key}.name`),
          default: metrics.getOptionalBoolean(`${key}.default`) ?? false,
        }));
      }

      return [];
    }

    function getIcons(): Icon[] {
      const products = c.getConfig('costInsights.products');
      const keys = products.keys();

      return keys.map(k => ({
        kind: k,
        component: getIcon(products.getOptionalString(`${k}.icon`)),
      }));
    }

    function getEngineerCost(): number {
      return c.getNumber('costInsights.engineerCost');
    }

    function getConfig() {
      const products = getProducts();
      const metrics = getMetrics();
      const engineerCost = getEngineerCost();
      const icons = getIcons();

      validateMetrics(metrics);

      setConfig(prevState => ({
        ...prevState,
        metrics,
        products,
        engineerCost,
        icons,
      }));

      setLoading(false);
    }

    getConfig();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return null;
  }

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export function useConfig(): ConfigContextProps {
  const config = useContext(ConfigContext);
  return config ? config : assertNever();
}

function assertNever(): never {
  throw new Error('Cannot use useConfig outside of ConfigProvider');
}
