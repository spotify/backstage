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
import { Grid, makeStyles } from '@material-ui/core';
import { EntitySplunkOnCallCard } from './EntitySplunkOnCallCard';
import {
  Content,
  ContentHeader,
  Page,
  Header,
  SupportButton,
} from '@backstage/core-components';

const useStyles = makeStyles(() => ({
  overflowXScroll: {
    overflowX: 'scroll',
  },
}));

export type SplunkOnCallPageProps = {
  title?: string;
  subtitle?: string;
  pageTitle?: string;
};

export const SplunkOnCallPage = ({
  title,
  subtitle,
  pageTitle,
}: SplunkOnCallPageProps): JSX.Element => {
  const classes = useStyles();

  return (
    <Page themeId="tool">
      <Header title={title} subtitle={subtitle} />
      <Content className={classes.overflowXScroll}>
        <ContentHeader title={pageTitle}>
          <SupportButton>
            This is used to help you automate incident management.
          </SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="row">
          <Grid item xs={12} sm={6} md={4}>
            <EntitySplunkOnCallCard />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

SplunkOnCallPage.defaultProps = {
  title: 'Splunk On-Call',
  subtitle: 'Automate incident management',
  pageTitle: 'Dashboard',
};
