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

import { ResponseError } from '@backstage/errors';
import { Divider, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import React from 'react';
import { CodeSnippet } from '../CodeSnippet';
import { CopyTextButton } from '../CopyTextButton';
import { ErrorPanel, ErrorPanelProps } from '../ErrorPanel';

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

/**
 * Renders a warning panel as the effect of a failed server request.
 *
 * Has special treatment for ResponseError errors, to display rich
 * server-provided information about what happened.
 */
export const ResponseErrorPanel = ({
  title,
  error,
  defaultExpanded,
}: ErrorPanelProps) => {
  const classes = useStyles();

  if (error.name !== 'ResponseError') {
    return (
      <ErrorPanel
        title={title ?? error.message}
        defaultExpanded={defaultExpanded}
        error={error}
      />
    );
  }

  const { data, cause } = error as ResponseError;
  const { request, response } = data;

  const errorString = `${response.statusCode}: ${cause.name}`;
  const requestString = request && `${request.method} ${request.url}`;
  const messageString = cause.message.replace(/\\n/g, '\n');
  const stackString = cause.stack?.replace(/\\n/g, '\n');
  const jsonString = JSON.stringify(data, undefined, 2);

  return (
    <ErrorPanel
      title={title ?? error.message}
      defaultExpanded={defaultExpanded}
      error={{ name: errorString, message: messageString, stack: stackString }}
    >
      {requestString && (
        <ListItem alignItems="flex-start">
          <ListItemText
            classes={{ secondary: classes.text }}
            primary="Request"
            secondary={request ? `${requestString}` : undefined}
          />
          <CopyTextButton text={requestString} />
        </ListItem>
      )}
      <>
        <Divider component="li" className={classes.divider} />
        <ListItem alignItems="flex-start">
          <ListItemText
            classes={{ secondary: classes.text }}
            primary="Full Error as JSON"
          />
        </ListItem>
        <CodeSnippet language="json" text={jsonString} showCopyCodeButton />
      </>
    </ErrorPanel>
  );
};
