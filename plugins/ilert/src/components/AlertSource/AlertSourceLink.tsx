/*
 * Copyright 2021 The Backstage Authors
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
import Grid from '@material-ui/core/Grid';
import { AlertSource } from '../../types';
import { ilertApiRef } from '../../api';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useApi } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    maxWidth: '100%',
  },
  image: {
    height: 22,
    paddingRight: 4,
  },
  link: {
    lineHeight: '22px',
  },
});

export const AlertSourceLink = ({
  alertSource,
}: {
  alertSource: AlertSource | null;
}) => {
  const ilertApi = useApi(ilertApiRef);
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  if (!alertSource) {
    return null;
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={2}>
        <img
          src={prefersDarkMode ? alertSource.lightIconUrl : alertSource.iconUrl}
          alt={alertSource.name}
          className={classes.image}
        />
      </Grid>
      <Grid item xs={10}>
        <Link
          className={classes.link}
          to={ilertApi.getAlertSourceDetailsURL(alertSource)}
        >
          {alertSource.name}
        </Link>
      </Grid>
    </Grid>
  );
};
