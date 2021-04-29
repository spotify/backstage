/*
 * Copyright 2021 Spotify AB
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

import {
  ContentHeader,
  Content,
  Header,
  HeaderLabel,
  Progress,
  Page,
  SupportButton,
  useApi,
} from '@backstage/core';
import { Alert } from '@material-ui/lab';
import { BackstageTheme } from '@backstage/theme';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { MonitorTable } from '../MonitorTable';
import { uptimerobotApiRef } from '../../api';
import { useAutoUpdatingRequest } from '../../hooks';
import LaunchIcon from '@material-ui/icons/Launch';
import React from 'react';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  button: {
    marginTop: `${theme.spacing(2)}px`,
  },
}));

export const HomePage = () => {
  const classes = useStyles();

  const uptimerobotApi = useApi(uptimerobotApiRef);
  const { value, loading, error } = useAutoUpdatingRequest(() =>
    uptimerobotApi.getAllMonitors(),
  );

  return (
    <Page themeId="tool">
      <Header
        title="UptimeRobot"
        subtitle="UptimeRobots monitors if your site is available."
      >
        <HeaderLabel label="Owner" value="@simonknittel" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>

      <Content>
        <ContentHeader
          title="Overview"
          description={`This table lists all monitors accessible by your API keys. It automatically refreshes every ${uptimerobotApi.getUpdateInterval()} seconds.`}
        >
          <SupportButton>
            UptimeRobots monitors if your site is available.
          </SupportButton>
        </ContentHeader>

        {loading && <Progress />}
        {error && <Alert severity="error">{error.message}</Alert>}

        {value && (
          <Grid container spacing={3} direction="column">
            <Grid item>
              <MonitorTable monitors={value.monitors} />
            </Grid>
          </Grid>
        )}

        <Button
          href="https://uptimerobot.com/dashboard.php#mainDashboard"
          endIcon={<LaunchIcon />}
          rel="noopener"
          color="primary"
          variant="contained"
          className={classes.button}
        >
          Open UptimeRobot's dashboard
        </Button>
      </Content>
    </Page>
  );
};
