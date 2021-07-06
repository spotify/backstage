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
  useContext,
  ReactNode,
  PropsWithChildren,
} from 'react';
import PropTypes from 'prop-types';
import { ApiHolder } from '@backstage/core-plugin-api';
import { ApiAggregator } from './ApiAggregator';
import { getOrCreateGlobalSingleton } from '../../lib/globalObject';
import {
  VersionedValue,
  createVersionedValueMap,
} from '../../lib/versionedValues';

type ApiProviderProps = {
  apis: ApiHolder;
  children: ReactNode;
};

type ApiContextType = VersionedValue<{ 1: ApiHolder }> | undefined;
const ApiContext = getOrCreateGlobalSingleton('api-context', () =>
  createContext<ApiContextType>(undefined),
);

export const ApiProvider = ({
  apis,
  children,
}: PropsWithChildren<ApiProviderProps>) => {
  const parentHolder = useContext(ApiContext)?.atVersion(1);
  const holder = parentHolder ? new ApiAggregator(apis, parentHolder) : apis;

  return (
    <ApiContext.Provider
      value={createVersionedValueMap({ 1: holder })}
      children={children}
    />
  );
};

ApiProvider.propTypes = {
  apis: PropTypes.shape({ get: PropTypes.func.isRequired }).isRequired,
  children: PropTypes.node,
};
