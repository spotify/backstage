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

import { ApiEntity } from '@backstage/catalog-model';
import React from 'react';
import { apiDocsConfigRef } from '../../config';
import { useApi } from '@backstage/core-plugin-api';

export const ApiTypeTitle = ({ apiEntity }: { apiEntity: ApiEntity }) => {
  const config = useApi(apiDocsConfigRef);
  const definition = config.getApiDefinitionWidget(apiEntity);
  const type = definition ? definition.title : apiEntity.spec.type;

  return <span>{type}</span>;
};
