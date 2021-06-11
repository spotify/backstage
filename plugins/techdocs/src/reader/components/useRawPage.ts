/*
 * Copyright 2020 Spotify AB
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
import { EntityName } from '@backstage/catalog-model';
import { useApi } from '@backstage/core';
import { useAsyncRetry } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsync';
import { techdocsStorageApiRef } from '../../api';

export type RawPage = {
  content: string;
  path: string;
  entityId: EntityName;
};

export function useRawPage(
  path: string,
  kind: string,
  namespace: string,
  name: string,
): AsyncState<RawPage> & {
  retry(): void;
} {
  const techdocsStorageApi = useApi(techdocsStorageApiRef);

  return useAsyncRetry(async () => {
    const content = await techdocsStorageApi.getEntityDocs(
      { kind, namespace, name },
      path,
    );

    return {
      content,
      path,
      entityId: {
        kind,
        name,
        namespace,
      },
    };
  }, [techdocsStorageApi, kind, namespace, name, path]);
}
