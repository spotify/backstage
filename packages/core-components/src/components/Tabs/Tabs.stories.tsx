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
import { Tabs } from './Tabs';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';

export default {
  title: 'Navigation/Tabs',
  component: Tabs,
};

const containerStyle = {};

export const Default = () => (
  <div style={containerStyle}>
    <Tabs
      tabs={[...Array(4)].map((_, index) => ({
        label: `ANOTHER TAB`,
        content: <div>Content {index}</div>,
      }))}
    />
  </div>
);

export const Expandable = () => (
  <div style={containerStyle}>
    <Tabs
      tabs={[...Array(31)].map((_, index) => ({
        label: `ANOTHER TAB`,
        content: <div>Content {index}</div>,
      }))}
    />
  </div>
);

export const Icons = () => (
  <div style={containerStyle}>
    <Tabs
      tabs={[...Array(4)].map((_, index) => ({
        icon: <AccessAlarmIcon />,
        content: <div>Content {index}</div>,
      }))}
    />
  </div>
);

export const IconsAndLabels = () => (
  <div style={containerStyle}>
    <Tabs
      tabs={[...Array(4)].map((_, index) => ({
        icon: <AccessAlarmIcon />,
        label: `ANOTHER TAB`,
        content: <div>Content {index}</div>,
      }))}
    />
  </div>
);
