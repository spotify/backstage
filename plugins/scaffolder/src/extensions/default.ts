/*
 * Copyright 2021 The Backstage Authors
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
import { EntityPicker } from '../components/fields/EntityPicker';
import { OwnerPicker } from '../components/fields/OwnerPicker';
import {
  repoPickerValidation,
  RepoUrlPicker,
} from '../components/fields/RepoUrlPicker';
import { FieldExtensionOptions } from './types';

export const DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS: FieldExtensionOptions[] = [
  {
    component: EntityPicker,
    name: 'EntityPicker',
  },
  {
    component: RepoUrlPicker,
    name: 'RepoUrlPicker',
    validation: repoPickerValidation,
  },
  {
    component: OwnerPicker,
    name: 'OwnerPicker',
  },
];
