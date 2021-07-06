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

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  Sidebar,
  SidebarDivider,
  SidebarIntro,
  SidebarItem,
  SidebarSearchField,
  SidebarSpace,
} from '.';

export default {
  title: 'Layout/Sidebar',
  component: Sidebar,
  decorators: [
    (storyFn: () => JSX.Element) => (
      <MemoryRouter initialEntries={['/']}>{storyFn()}</MemoryRouter>
    ),
  ],
};

const handleSearch = (input: string) => {
  // eslint-disable-next-line no-console
  console.log(input);
};

export const SampleSidebar = () => (
  <Sidebar>
    <SidebarSearchField onSearch={handleSearch} />
    <SidebarDivider />
    <SidebarItem icon={HomeOutlinedIcon} to="#" text="Home" />
    <SidebarItem icon={HomeOutlinedIcon} to="#" text="Plugins" />
    <SidebarItem icon={AddCircleOutlineIcon} to="#" text="Create..." />
    <SidebarDivider />
    <SidebarIntro />
    <SidebarSpace />
  </Sidebar>
);
