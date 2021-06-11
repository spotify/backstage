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
import { Grid } from '@material-ui/core';
import React, { PropsWithChildren, useState } from 'react';
import { MemoryRouter } from 'react-router';
import { CardTab, TabbedCard } from './TabbedCard';

const cardContentStyle = { height: 200, width: 500 };

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <MemoryRouter>{children}</MemoryRouter>
);

export default {
  title: 'Layout/Tabbed Card',
  component: TabbedCard,
  decorators: [
    (storyFn: () => JSX.Element) => (
      <Grid container spacing={4}>
        <Grid item>{storyFn()}</Grid>
      </Grid>
    ),
  ],
};

export const Default = () => {
  return (
    <Wrapper>
      <TabbedCard title="Default Example Header">
        <CardTab label="Option 1">
          <div style={cardContentStyle}>Some content</div>
        </CardTab>
        <CardTab label="Option 2">
          <div style={cardContentStyle}>Some content 2</div>
        </CardTab>
        <CardTab label="Option 3">
          <div style={cardContentStyle}>Some content 3</div>
        </CardTab>
        <CardTab label="Option 4">
          <div style={cardContentStyle}>Some content 4</div>
        </CardTab>
      </TabbedCard>
    </Wrapper>
  );
};

const linkInfo = { title: 'Go to XYZ Location', link: '#' };

export const WithFooterLink = () => {
  return (
    <Wrapper>
      <TabbedCard title="Footer Link Example Header" deepLink={linkInfo}>
        <CardTab label="Option 1">
          <div style={cardContentStyle}>Some content</div>
        </CardTab>
        <CardTab label="Option 2">
          <div style={cardContentStyle}>Some content 2</div>
        </CardTab>
        <CardTab label="Option 3">
          <div style={cardContentStyle}>Some content 3</div>
        </CardTab>
        <CardTab label="Option 4">
          <div style={cardContentStyle}>Some content 4</div>
        </CardTab>
      </TabbedCard>
    </Wrapper>
  );
};

export const WithControlledTabValue = () => {
  const [selectedTab, setSelectedTab] = useState<string | number>('one');

  const handleChange = (_ev: any, newSelectedTab: string | number) =>
    setSelectedTab(newSelectedTab);

  return (
    <Wrapper>
      <span>Selected tab is {selectedTab}</span>

      <TabbedCard
        value={selectedTab}
        onChange={handleChange}
        title="Controlled Value Example"
      >
        <CardTab value="one" label="Option 1">
          <div style={cardContentStyle}>Some content</div>
        </CardTab>
        <CardTab value="two" label="Option 2">
          <div style={cardContentStyle}>Some content 2</div>
        </CardTab>
        <CardTab value="three" label="Option 3">
          <div style={cardContentStyle}>Some content 3</div>
        </CardTab>
        <CardTab value="four" label="Option 4">
          <div style={cardContentStyle}>Some content 4</div>
        </CardTab>
      </TabbedCard>
    </Wrapper>
  );
};
