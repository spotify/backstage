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

import React, { createContext, PropsWithChildren } from 'react';
import {
  VersionedValue,
  createVersionedValueMap,
} from '../lib/versionedValues';
import { getOrCreateGlobalSingleton } from '../lib/globalObject';
import { AppContext as AppContextV1 } from './types';

type AppContextType = VersionedValue<{ 1: AppContextV1 }> | undefined;
const AppContext = getOrCreateGlobalSingleton('app-context', () =>
  createContext<AppContextType | undefined>(undefined),
);

type Props = {
  appContext: AppContextV1;
};

export const AppContextProvider = ({
  appContext,
  children,
}: PropsWithChildren<Props>) => {
  const versionedValue = createVersionedValueMap({ 1: appContext });

  return <AppContext.Provider value={versionedValue} children={children} />;
};
