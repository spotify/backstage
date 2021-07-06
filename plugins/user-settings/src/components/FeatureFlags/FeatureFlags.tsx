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

import React, { useCallback, useState } from 'react';
import { List } from '@material-ui/core';
import { EmptyFlags } from './EmptyFlags';
import { FlagItem } from './FeatureFlagsItem';

import {
  featureFlagsApiRef,
  FeatureFlagState,
  useApi,
} from '@backstage/core-plugin-api';
import { InfoCard } from '@backstage/core-components';

export const FeatureFlags = () => {
  const featureFlagsApi = useApi(featureFlagsApiRef);
  const featureFlags = featureFlagsApi.getRegisteredFlags();

  const initialFlagState = Object.fromEntries(
    featureFlags.map(({ name }) => [name, featureFlagsApi.isActive(name)]),
  );

  const [state, setState] = useState<Record<string, boolean>>(initialFlagState);

  const toggleFlag = useCallback(
    (flagName: string) => {
      const newState = featureFlagsApi.isActive(flagName)
        ? FeatureFlagState.None
        : FeatureFlagState.Active;

      featureFlagsApi.save({
        states: { [flagName]: newState },
        merge: true,
      });

      setState(prevState => ({
        ...prevState,
        [flagName]: newState === FeatureFlagState.Active,
      }));
    },
    [featureFlagsApi],
  );

  if (!featureFlags.length) {
    return <EmptyFlags />;
  }

  return (
    <InfoCard title="Feature Flags">
      <List dense>
        {featureFlags.map(featureFlag => {
          const enabled = Boolean(state[featureFlag.name]);

          return (
            <FlagItem
              key={featureFlag.name}
              flag={featureFlag}
              enabled={enabled}
              toggleHandler={toggleFlag}
            />
          );
        })}
      </List>
    </InfoCard>
  );
};
