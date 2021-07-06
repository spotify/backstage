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

import React from 'react';
import { CostInsightsPage } from './CostInsightsPage';
import { FilterProvider } from '../../hooks/useFilters';
import { LoadingProvider } from '../../hooks/useLoading';
import { GroupsProvider } from '../../hooks/useGroups';
import { CurrencyProvider } from '../../hooks/useCurrency';
import { ScrollProvider } from '../../hooks/useScroll';
import { ConfigProvider } from '../../hooks/useConfig';
import { BillingDateProvider } from '../../hooks/useLastCompleteBillingDate';
import { CostInsightsThemeProvider } from './CostInsightsThemeProvider';

export const CostInsightsPageRoot = () => (
  <CostInsightsThemeProvider>
    <ConfigProvider>
      <LoadingProvider>
        <GroupsProvider>
          <BillingDateProvider>
            <FilterProvider>
              <ScrollProvider>
                <CurrencyProvider>
                  <CostInsightsPage />
                </CurrencyProvider>
              </ScrollProvider>
            </FilterProvider>
          </BillingDateProvider>
        </GroupsProvider>
      </LoadingProvider>
    </ConfigProvider>
  </CostInsightsThemeProvider>
);
