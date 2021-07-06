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
import { useAsync } from 'react-use';
import { scaffolderApiRef } from '../../api';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  Box,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { JSONSchema } from '@backstage/catalog-model';
import { JSONSchema7Definition } from 'json-schema';
import classNames from 'classnames';

import { useApi } from '@backstage/core-plugin-api';
import {
  Progress,
  Content,
  Header,
  Page,
  ErrorPage,
} from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  code: {
    fontFamily: 'Menlo, monospace',
    padding: theme.spacing(1),
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[300],
    display: 'inline-block',
    borderRadius: 5,
    border: `1px solid ${theme.palette.grey[500]}`,
    position: 'relative',
  },

  codeRequired: {
    '&::after': {
      position: 'absolute',
      content: '"*"',
      top: 0,
      right: theme.spacing(0.5),
      fontWeight: 'bolder',
      color: theme.palette.error.light,
    },
  },
}));

export const ActionsPage = () => {
  const api = useApi(scaffolderApiRef);
  const classes = useStyles();
  const { loading, value, error } = useAsync(async () => {
    return api.listActions();
  });

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <ErrorPage
        statusMessage="Failed to load installed actions"
        status="500"
      />
    );
  }

  const formatRows = (input: JSONSchema) => {
    const properties = input.properties;
    if (!properties) {
      return undefined;
    }

    return Object.entries(properties).map(entry => {
      const [key] = entry;
      const props = (entry[1] as unknown) as JSONSchema;
      const codeClassname = classNames(classes.code, {
        [classes.codeRequired]: input.required?.includes(key),
      });

      return (
        <TableRow key={key}>
          <TableCell>
            <div className={codeClassname}>{key}</div>
          </TableCell>
          <TableCell>{props.title}</TableCell>
          <TableCell>{props.description}</TableCell>
          <TableCell>
            <span className={classes.code}>{props.type}</span>
          </TableCell>
        </TableRow>
      );
    });
  };

  const renderTable = (input: JSONSchema) => {
    if (!input.properties) {
      return undefined;
    }
    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{formatRows(input)}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderTables = (name: string, input?: JSONSchema7Definition[]) => {
    if (!input) {
      return undefined;
    }

    return (
      <>
        <Typography variant="h6">{name}</Typography>
        {input.map((i, index) => (
          <div key={index}>{renderTable((i as unknown) as JSONSchema)}</div>
        ))}
      </>
    );
  };

  const items = value?.map(action => {
    if (action.id.startsWith('legacy:')) {
      return undefined;
    }

    const oneOf = renderTables('oneOf', action.schema?.input?.oneOf);
    return (
      <Box pb={4} key={action.id}>
        <Typography variant="h4" className={classes.code}>
          {action.id}
        </Typography>
        <Typography>{action.description}</Typography>
        {action.schema?.input && (
          <Box pb={2}>
            <Typography variant="h5">Input</Typography>
            {renderTable(action.schema.input)}
            {oneOf}
          </Box>
        )}
        {action.schema?.output && (
          <Box pb={2}>
            <Typography variant="h5">Output</Typography>
            {renderTable(action.schema.output)}
          </Box>
        )}
      </Box>
    );
  });

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride="Create a New Component"
        title="Installed actions"
        subtitle="This is the collection of all installed actions"
      />
      <Content>{items}</Content>
    </Page>
  );
};
