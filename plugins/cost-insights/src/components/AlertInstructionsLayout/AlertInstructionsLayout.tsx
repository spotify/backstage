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
import { Box, Button, Container, makeStyles } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { CostInsightsThemeProvider } from '../CostInsightsPage/CostInsightsThemeProvider';
import { ConfigProvider, CurrencyProvider } from '../../hooks';
import { Header, Page } from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  root: {
    gridArea: 'pageContent',
    padding: theme.spacing(4),
  },
}));

type AlertInstructionsLayoutProps = {
  title: string;
};

export const AlertInstructionsLayout = ({
  title,
  children,
}: PropsWithChildren<AlertInstructionsLayoutProps>) => {
  const classes = useStyles();
  return (
    <CostInsightsThemeProvider>
      <ConfigProvider>
        <CurrencyProvider>
          <Page themeId="tool">
            <Header
              title="Cost Insights"
              pageTitleOverride={title}
              type="Tool"
            />
            <Container maxWidth="md" disableGutters className={classes.root}>
              <Box mb={3}>
                <Button
                  variant="outlined"
                  startIcon={<ChevronLeftIcon />}
                  href="/cost-insights"
                >
                  Back to Cost Insights
                </Button>
              </Box>
              {children}
            </Container>
          </Page>
        </CurrencyProvider>
      </ConfigProvider>
    </CostInsightsThemeProvider>
  );
};
