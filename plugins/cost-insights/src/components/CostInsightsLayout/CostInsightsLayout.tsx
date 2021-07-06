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
import React, { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import { Group } from '../../types';
import { CostInsightsTabs } from '../CostInsightsTabs';
import { Header, Page } from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  root: {
    gridArea: 'pageContent',
  },
  header: {
    boxShadow: 'none',
  },
  content: {
    padding: theme.spacing(4),
  },
}));

type CostInsightsLayoutProps = {
  title?: string;
  groups: Group[];
};

export const CostInsightsLayout = ({
  groups,
  children,
}: PropsWithChildren<CostInsightsLayoutProps>) => {
  const classes = useStyles();
  return (
    <Page themeId="tool">
      <Header
        style={{ boxShadow: 'none' }}
        title="Cost Insights"
        pageTitleOverride="Cost Insights"
        type="Tool"
      />
      <div className={classes.root}>
        <CostInsightsTabs groups={groups} />
        <div className={classes.content}>{children}</div>
      </div>
    </Page>
  );
};
