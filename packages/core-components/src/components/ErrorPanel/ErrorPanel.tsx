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

import { List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';
import { CopyTextButton } from '../CopyTextButton';
import { WarningPanel } from '../WarningPanel';

const useStyles = makeStyles(theme => ({
  text: {
    fontFamily: 'monospace',
    whiteSpace: 'pre',
    overflowX: 'auto',
    marginRight: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(2),
  },
}));

type ErrorListProps = {
  error: string;
  message: string;
  request?: string;
  stack?: string;
  json?: string;
};

const ErrorList = ({
  error,
  message,
  stack,
  children,
}: PropsWithChildren<ErrorListProps>) => {
  const classes = useStyles();

  return (
    <List dense>
      <ListItem alignItems="flex-start">
        <ListItemText
          classes={{ secondary: classes.text }}
          primary="Error"
          secondary={error}
        />
        <CopyTextButton text={error} />
      </ListItem>

      <ListItem alignItems="flex-start">
        <ListItemText
          classes={{ secondary: classes.text }}
          primary="Message"
          secondary={message}
        />
        <CopyTextButton text={message} />
      </ListItem>

      {stack && (
        <ListItem alignItems="flex-start">
          <ListItemText
            classes={{ secondary: classes.text }}
            primary="Stack Trace"
            secondary={stack}
          />
          <CopyTextButton text={stack} />
        </ListItem>
      )}

      {children}
    </List>
  );
};

export type ErrorPanelProps = {
  error: Error;
  defaultExpanded?: boolean;
  title?: string;
};

/**
 * Renders a warning panel as the effect of an error.
 */
export const ErrorPanel = ({
  title,
  error,
  defaultExpanded,
  children,
}: PropsWithChildren<ErrorPanelProps>) => {
  return (
    <WarningPanel
      title={title ?? error.message}
      defaultExpanded={defaultExpanded}
    >
      <ErrorList
        error={error.name}
        message={error.message}
        stack={error.stack}
        children={children}
      />
    </WarningPanel>
  );
};
