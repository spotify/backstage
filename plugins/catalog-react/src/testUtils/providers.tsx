/*
 * Copyright 2021 Spotify AB
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
import {
  EntityListContext,
  EntityListContextProps,
} from '../hooks/useEntityListProvider';

export const MockEntityListContextProvider = ({
  children,
  value,
}: PropsWithChildren<{ value: Partial<EntityListContextProps> }>) => {
  const defaultContext: EntityListContextProps = {
    entities: [],
    backendEntities: [],
    updateFilters: jest.fn(),
    filters: {},
    loading: false,
  };

  return (
    <EntityListContext.Provider value={{ ...defaultContext, ...value }}>
      {children}
    </EntityListContext.Provider>
  );
};
