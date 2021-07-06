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
import { Entity } from '@backstage/catalog-model';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAsync } from 'react-use';
import { catalogApiRef } from '../api';
import { useEntityCompoundName } from './useEntityCompoundName';

type EntityLoadingStatus = {
  entity?: Entity;
  loading: boolean;
  error?: Error;
};

export const EntityContext = createContext<EntityLoadingStatus>({
  entity: undefined,
  loading: true,
  error: undefined,
});

export const useEntityFromUrl = (): EntityLoadingStatus => {
  const { kind, namespace, name } = useEntityCompoundName();
  const navigate = useNavigate();
  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);

  const { value: entity, error, loading } = useAsync(
    () => catalogApi.getEntityByName({ kind, namespace, name }),
    [catalogApi, kind, namespace, name],
  );

  useEffect(() => {
    if (!name) {
      errorApi.post(new Error('No name provided!'));
      navigate('/');
    }
  }, [errorApi, navigate, error, loading, entity, name]);

  return { entity, loading, error };
};

/**
 * Grab the current entity from the context and its current loading state.
 */
export function useEntity<T extends Entity = Entity>() {
  const { entity, loading, error } = useContext(EntityContext);
  return { entity: entity as T, loading, error };
}
