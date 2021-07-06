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
import React from 'react';
import { HeaderLabel } from '../HeaderLabel';
import { Page } from '../Page';
import { Header } from './Header';

export default {
  title: 'Layout/Header',
  component: Header,
};

const labels = (
  <>
    <HeaderLabel label="Owner" value="players" />
    <HeaderLabel label="Lifecycle" value="Production" />
    <HeaderLabel label="Tier" value="Level 1" />
  </>
);

export const Home = () => (
  <Page themeId="home">
    <Header title="Start/Home Page" type="home">
      {labels}
    </Header>
  </Page>
);

export const HomeWithSubtitle = () => (
  <Header title="Start/Home Page" subtitle="This is a subtitle">
    {labels}
  </Header>
);

export const Apis = () => (
  <Page themeId="apis">
    <Header title="API catalogue" type="tool">
      {labels}
    </Header>
  </Page>
);

export const Tool = () => (
  <Page themeId="tool">
    <Header title="Stand-alone tool" type="tool">
      {labels}
    </Header>
  </Page>
);

export const Service = () => (
  <Page themeId="service">
    <Header title="Service component page" type="service">
      {labels}
    </Header>
  </Page>
);

export const Website = () => (
  <Page themeId="website">
    <Header title="Website component page" type="website">
      {labels}
    </Header>
  </Page>
);

export const Library = () => (
  <Page themeId="library">
    <Header title="Library component page" type="library">
      {labels}
    </Header>
  </Page>
);

export const App = () => (
  <Page themeId="app">
    <Header title="App component page" type="app">
      {labels}
    </Header>
  </Page>
);

export const Documentation = () => (
  <Page themeId="documentation">
    <Header title="Documentation component page" type="documentation">
      {labels}
    </Header>
  </Page>
);

export const Other = () => (
  <Page themeId="other">
    <Header title="Other/generic component page" type="other">
      {labels}
    </Header>
  </Page>
);
