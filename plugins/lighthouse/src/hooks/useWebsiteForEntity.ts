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
import { useEntity } from '@backstage/plugin-catalog-react';
import { useAsync } from 'react-use';
import { LIGHTHOUSE_WEBSITE_URL_ANNOTATION } from '../../constants';
import { lighthouseApiRef } from '../api';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';

// For the sake of simplicity we assume that an entity has only one website url. This is to avoid encoding a list
// type in an annotation which is a plain string.
export const useWebsiteForEntity = () => {
  const { entity } = useEntity();
  const websiteUrl =
    entity.metadata.annotations?.[LIGHTHOUSE_WEBSITE_URL_ANNOTATION] ?? '';
  const lighthouseApi = useApi(lighthouseApiRef);
  const errorApi = useApi(errorApiRef);
  const response = useAsync(() => lighthouseApi.getWebsiteByUrl(websiteUrl), [
    websiteUrl,
  ]);
  if (response.error) {
    errorApi.post(response.error);
  }
  return response;
};
