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
import { Alert } from '@material-ui/lab';
import { costInsightsApiRef } from '../api';
import { MapLoadingToProps, useLoading } from './useLoading';
import { Group, Maybe } from '../types';
import { DefaultLoadingAction } from '../utils/loading';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';

type GroupsProviderLoadingProps = {
  dispatchLoadingGroups: (isLoading: boolean) => void;
};

const mapLoadingToProps: MapLoadingToProps<GroupsProviderLoadingProps> = ({
  dispatch,
}) => ({
  dispatchLoadingGroups: (isLoading: boolean) =>
    dispatch({ [DefaultLoadingAction.UserGroups]: isLoading }),
});

export type GroupsContextProps = {
  groups: Group[];
};

export const GroupsContext = React.createContext<
  GroupsContextProps | undefined
>(undefined);

export const GroupsProvider = ({ children }: PropsWithChildren<{}>) => {
  const userId = useApi(identityApiRef).getUserId();
  const client = useApi(costInsightsApiRef);
  const [error, setError] = useState<Maybe<Error>>(null);
  const { dispatchLoadingGroups } = useLoading(mapLoadingToProps);

  const [groups, setGroups] = useState<Maybe<Group[]>>(null);

  useEffect(() => {
    dispatchLoadingGroups(true);

    async function getUserGroups() {
      try {
        const g = await client.getUserGroups(userId);
        setGroups(g);
      } catch (e) {
        setError(e);
      } finally {
        dispatchLoadingGroups(false);
      }
    }

    getUserGroups();
  }, [userId, client]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!groups) return null;

  return (
    <GroupsContext.Provider value={{ groups: groups }}>
      {children}
    </GroupsContext.Provider>
  );
};

export function useGroups(): Group[] {
  const context = useContext(GroupsContext);
  return context ? context.groups : assertNever();
}

function assertNever(): never {
  throw Error('Cannot use useGroups outside of GroupsProvider');
}
