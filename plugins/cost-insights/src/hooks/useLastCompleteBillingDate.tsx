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
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as yup from 'yup';
import { Alert } from '@material-ui/lab';
import { costInsightsApiRef } from '../api';
import { MapLoadingToProps, useLoading } from './useLoading';
import { DefaultLoadingAction } from '../utils/loading';
import { Maybe } from '../types';
import { useApi } from '@backstage/core-plugin-api';

type BillingDateProviderLoadingProps = {
  dispatchLoadingBillingDate: (isLoading: boolean) => void;
};

const mapLoadingToProps: MapLoadingToProps<BillingDateProviderLoadingProps> = ({
  dispatch,
}) => ({
  dispatchLoadingBillingDate: (isLoading: boolean) =>
    dispatch({ [DefaultLoadingAction.LastCompleteBillingDate]: isLoading }),
});

export type BillingDateContextProps = {
  lastCompleteBillingDate: string; // YYYY-MM-DD
};

export const BillingDateContext = React.createContext<
  BillingDateContextProps | undefined
>(undefined);

export const dateRegex: RegExp = /^\d{4}-\d{2}-\d{2}$/;
const dateFormatSchema = yup.string().matches(dateRegex, {
  message:
    'Unsupported billing date format: ${value}. Date should be in YYYY-MM-DD format.',
  excludeEmptyString: true,
});

export const BillingDateProvider = ({ children }: PropsWithChildren<{}>) => {
  const client = useApi(costInsightsApiRef);
  const [error, setError] = useState<Maybe<Error>>(null);
  const { dispatchLoadingBillingDate } = useLoading(mapLoadingToProps);

  const [lastCompleteBillingDate, setLastCompeteBillingDate] = useState<
    Maybe<string>
  >(null);

  useEffect(() => {
    dispatchLoadingBillingDate(true);

    async function getLastCompleteBillingDate() {
      try {
        const d = await client.getLastCompleteBillingDate();
        const validDate = await dateFormatSchema.validate(d);
        if (validDate) setLastCompeteBillingDate(validDate);
      } catch (e) {
        setError(e);
      } finally {
        dispatchLoadingBillingDate(false);
      }
    }

    getLastCompleteBillingDate();
  }, [client]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!lastCompleteBillingDate) return null;

  return (
    <BillingDateContext.Provider
      value={
        {
          lastCompleteBillingDate: lastCompleteBillingDate,
        } as BillingDateContextProps
      }
    >
      {children}
    </BillingDateContext.Provider>
  );
};

export function useLastCompleteBillingDate(): string {
  const context = useContext(BillingDateContext);
  return context ? context.lastCompleteBillingDate : assertNever();
}

function assertNever(): never {
  throw Error(
    'Cannot use useLastCompleteBillingDate outside of BillingDateProvider',
  );
}
