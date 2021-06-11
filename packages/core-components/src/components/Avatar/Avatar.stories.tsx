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

import React from 'react';
import { Avatar } from './Avatar';

export default {
  title: 'Data Display/Avatar',
  component: Avatar,
};

export const Default = () => (
  <Avatar
    displayName="Jenny Doe"
    // Avatar of the backstage GitHub org
    picture="https://avatars1.githubusercontent.com/u/72526453?s=200&v=4"
  />
);

export const NameFallback = () => <Avatar displayName="Jenny Doe" />;

export const Empty = () => <Avatar />;

export const CustomStyling = () => (
  <Avatar
    displayName="Jenny Doe"
    customStyles={{ width: '24px', height: '24px', fontSize: '8px' }}
  />
);
