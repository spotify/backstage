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

import React, { ReactNode, useState, useEffect } from 'react';
import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import { useObservable } from 'react-use';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  root: {
    padding: theme.spacing(0),
    marginBottom: theme.spacing(0),
    marginTop: theme.spacing(0),
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  // showing on top
  topPosition: {
    position: 'relative',
    marginBottom: theme.spacing(6),
    marginTop: -theme.spacing(3),
    zIndex: 'unset',
  },
  icon: {
    fontSize: 20,
  },
  content: {
    width: '100%',
    maxWidth: 'inherit',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.banner.text,
    '& a': {
      color: theme.palette.banner.link,
    },
  },
  info: {
    backgroundColor: theme.palette.banner.info,
  },
  error: {
    backgroundColor: theme.palette.banner.error,
  },
}));

type Props = {
  variant: 'info' | 'error';
  message: ReactNode;
  id: string;
  fixed?: boolean;
};

export const DismissableBanner = ({
  variant,
  message,
  id,
  fixed = false,
}: Props) => {
  const classes = useStyles();
  const storageApi = useApi(storageApiRef);
  const notificationsStore = storageApi.forBucket('notifications');
  const rawDismissedBanners =
    notificationsStore.get<string[]>('dismissedBanners') ?? [];

  const [dismissedBanners, setDismissedBanners] = useState(
    new Set(rawDismissedBanners),
  );

  const observedItems = useObservable(
    notificationsStore.observe$<string[]>('dismissedBanners'),
  );

  useEffect(() => {
    if (observedItems?.newValue) {
      const currentValue = observedItems?.newValue ?? [];
      setDismissedBanners(new Set(currentValue));
    }
  }, [observedItems?.newValue]);

  const handleClick = () => {
    notificationsStore.set('dismissedBanners', [...dismissedBanners, id]);
  };

  return (
    <Snackbar
      anchorOrigin={
        fixed
          ? { vertical: 'bottom', horizontal: 'center' }
          : { vertical: 'top', horizontal: 'center' }
      }
      open={!dismissedBanners.has(id)}
      classes={{
        root: classNames(classes.root, !fixed && classes.topPosition),
      }}
    >
      <SnackbarContent
        classes={{
          root: classNames(classes.content, classes[variant]),
          message: classes.message,
        }}
        message={message}
        action={[
          <IconButton
            key="dismiss"
            title="Permanently dismiss this message"
            color="inherit"
            onClick={handleClick}
          >
            <Close className={classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};
