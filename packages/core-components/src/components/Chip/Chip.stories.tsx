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
import { Chip } from '@material-ui/core';

export default {
  title: 'Data Display/Chip',
  component: Chip,
};

export const Default = () => <Chip label="Default" />;

export const LargeDeletable = () => (
  <Chip label="Large deletable" size="medium" onDelete={() => ({})} />
);

export const LargeNotDeletable = () => (
  <Chip label="Large not deletable" size="medium" />
);

export const SmallDeletable = () => (
  <Chip label="Small deletable" size="small" onDelete={() => ({})} />
);

export const SmallNotDeletable = () => (
  <Chip label="Small not deletable" size="small" />
);

export const Outline = () => <Chip label="Outline" variant="outlined" />;
