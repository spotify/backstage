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
import { costInsightsApiRef, CostInsightsApi } from '../api';
import { LoadingContext, LoadingContextProps } from '../hooks/useLoading';
import { GroupsContext, GroupsContextProps } from '../hooks/useGroups';
import { FilterContext, FilterContextProps } from '../hooks/useFilters';
import { ConfigContext, ConfigContextProps } from '../hooks/useConfig';
import { CurrencyContext, CurrencyContextProps } from '../hooks/useCurrency';
import {
  BillingDateContext,
  BillingDateContextProps,
} from '../hooks/useLastCompleteBillingDate';
import { ScrollContext, ScrollContextProps } from '../hooks/useScroll';
import { Group, Duration } from '../types';

// TODO(Rugvip): Could be good to have a clear place to put test utils that is linted accordingly
// eslint-disable-next-line import/no-extraneous-dependencies
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { IdentityApi, identityApiRef } from '@backstage/core-plugin-api';

type PartialPropsWithChildren<T> = PropsWithChildren<Partial<T>>;

export const MockGroups: Group[] = [{ id: 'tech' }, { id: 'mock-group' }];

export type MockFilterProviderProps = PartialPropsWithChildren<FilterContextProps>;

export const MockFilterProvider = ({
  children,
  ...context
}: MockFilterProviderProps) => {
  const defaultContext: FilterContextProps = {
    pageFilters: {
      group: 'tech',
      project: null,
      duration: Duration.P90D,
      metric: null,
    },
    productFilters: [],
    setPageFilters: jest.fn(),
    setProductFilters: jest.fn(),
  };
  return (
    <FilterContext.Provider value={{ ...defaultContext, ...context }}>
      {children}
    </FilterContext.Provider>
  );
};

export type MockLoadingProviderProps = PartialPropsWithChildren<LoadingContextProps>;

export const MockLoadingProvider = ({
  children,
  ...context
}: MockLoadingProviderProps) => {
  const defaultContext: LoadingContextProps = {
    state: {},
    actions: [],
    dispatch: jest.fn(),
  };
  return (
    <LoadingContext.Provider value={{ ...defaultContext, ...context }}>
      {children}
    </LoadingContext.Provider>
  );
};

export type MockConfigProviderProps = PartialPropsWithChildren<ConfigContextProps>;

export const MockConfigProvider = ({
  children,
  ...context
}: MockConfigProviderProps) => {
  const defaultContext: ConfigContextProps = {
    metrics: [],
    products: [],
    icons: [],
    engineerCost: 0,
    currencies: [],
  };
  return (
    <ConfigContext.Provider value={{ ...defaultContext, ...context }}>
      {children}
    </ConfigContext.Provider>
  );
};

export type MockCurrencyProviderProps = PartialPropsWithChildren<CurrencyContextProps>;

export const MockCurrencyProvider = ({
  children,
  ...context
}: MockCurrencyProviderProps) => {
  const defaultContext: CurrencyContextProps = {
    currency: {
      kind: null,
      label: 'Engineers 🛠',
      unit: 'engineer',
    },
    setCurrency: jest.fn(),
  };
  return (
    <CurrencyContext.Provider value={{ ...defaultContext, ...context }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export type MockBillingDateProviderProps = PartialPropsWithChildren<BillingDateContextProps>;

export const MockBillingDateProvider = ({
  children,
  ...context
}: MockBillingDateProviderProps) => {
  const defaultContext: BillingDateContextProps = {
    lastCompleteBillingDate: '2020-10-01',
  };
  return (
    <BillingDateContext.Provider value={{ ...defaultContext, ...context }}>
      {children}
    </BillingDateContext.Provider>
  );
};

export type MockScrollProviderProps = PropsWithChildren<{}>;

export const MockScrollProvider = ({ children }: MockScrollProviderProps) => {
  const defaultContext: ScrollContextProps = {
    scroll: null,
    setScroll: jest.fn(),
  };
  return (
    <ScrollContext.Provider value={defaultContext}>
      {children}
    </ScrollContext.Provider>
  );
};

export type MockGroupsProviderProps = PartialPropsWithChildren<GroupsContextProps>;

export const MockGroupsProvider = ({
  children,
  ...context
}: MockGroupsProviderProps) => {
  const defaultContext: GroupsContextProps = {
    groups: [],
  };
  return (
    <GroupsContext.Provider value={{ ...defaultContext, ...context }}>
      {children}
    </GroupsContext.Provider>
  );
};

export type MockCostInsightsApiProviderProps = PartialPropsWithChildren<{
  identityApi: Partial<IdentityApi>;
  costInsightsApi: Partial<CostInsightsApi>;
}>;

export const MockCostInsightsApiProvider = ({
  children,
  ...context
}: MockCostInsightsApiProviderProps) => {
  const defaultIdentityApi: IdentityApi = {
    getProfile: jest.fn(),
    getIdToken: jest.fn(),
    getUserId: jest.fn(),
    signOut: jest.fn(),
  };

  const defaultCostInsightsApi: CostInsightsApi = {
    getAlerts: jest.fn(),
    getDailyMetricData: jest.fn(),
    getGroupDailyCost: jest.fn(),
    getGroupProjects: jest.fn(),
    getLastCompleteBillingDate: jest.fn(),
    getProductInsights: jest.fn(),
    getProjectDailyCost: jest.fn(),
    getUserGroups: jest.fn(),
  };

  // TODO: defaultConfigApiRef: ConfigApiRef

  const defaultContext = ApiRegistry.from([
    [identityApiRef, { ...defaultIdentityApi, ...context.identityApi }],
    [
      costInsightsApiRef,
      { ...defaultCostInsightsApi, ...context.costInsightsApi },
    ],
    // [configApiRef, { ...defaultConfigApiRef, ...context.configApiRef }]
  ]);

  return <ApiProvider apis={defaultContext}>{children}</ApiProvider>;
};
