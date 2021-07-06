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

import qs from 'qs';
import * as yup from 'yup';
import { Duration, Group, PageFilters } from '../types';
import { getDefaultPageFilters } from '../utils/filters';
import { ConfigContextProps } from '../hooks/useConfig';

const schema = yup
  .object()
  .shape({
    group: yup.string().nullable(),
    project: yup.string().nullable(),
  })
  .required();

export const stringify = (queryParams: Partial<PageFilters>) =>
  qs.stringify(queryParams, { strictNullHandling: true });

export const parse = (queryString: string): Partial<PageFilters> =>
  qs.parse(queryString, { ignoreQueryPrefix: true, strictNullHandling: true });

export const validate = (queryString: string): Promise<PageFilters> => {
  return schema.validate(parse(queryString), {
    stripUnknown: true,
    strict: true,
  }) as Promise<PageFilters>;
};

export const getInitialPageState = (
  groups: Group[],
  queryParams: Partial<PageFilters> = {},
) => {
  return {
    ...getDefaultPageFilters(groups),
    ...(queryParams.project ? { project: queryParams.project } : {}),
    ...(queryParams.group ? { group: queryParams.group } : {}),
  };
};

export const getInitialProductState = (config: ConfigContextProps) =>
  config.products.map(product => ({
    productType: product.kind,
    duration: Duration.P30D,
  }));
