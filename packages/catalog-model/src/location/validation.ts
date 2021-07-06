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

import * as yup from 'yup';
import { LocationSpec, Location } from './types';

/** @deprecated */
export const locationSpecSchema = yup
  .object<LocationSpec>({
    type: yup.string().required(),
    target: yup.string().required(),
    presence: yup.string(),
  })
  .noUnknown()
  .required();

/** @deprecated */
export const locationSchema = yup
  .object<Location>({
    id: yup.string().required(),
    type: yup.string().required(),
    target: yup.string().required(),
  })
  .noUnknown()
  .required();

/** @deprecated */
export const analyzeLocationSchema = yup
  .object<{ location: LocationSpec }>({
    location: locationSpecSchema,
  })
  .noUnknown()
  .required();
