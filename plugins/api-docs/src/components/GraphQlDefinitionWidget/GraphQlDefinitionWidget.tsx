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

import { BackstageTheme } from '@backstage/theme';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import 'graphiql/graphiql.css';
import { buildSchema } from 'graphql';
import React, { Suspense } from 'react';
import { Progress } from '@backstage/core-components';

const GraphiQL = React.lazy(() => import('graphiql'));

const useStyles = makeStyles<BackstageTheme>(() => ({
  root: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  graphiQlWrapper: {
    flex: 1,
    '@global': {
      '.graphiql-container': {
        boxSizing: 'initial',
        height: '100%',
        minHeight: '600px',
        flex: '1 1 auto',
      },
    },
  },
}));

type Props = {
  definition: any;
  graphqlLink: any;
};

export const GraphQlDefinitionWidget = ({ definition, graphqlLink }: Props) => {
  const classes = useStyles();
  const schema = buildSchema(definition);
  const readOnly = graphqlLink ? false : true;

  const warningMessage = graphqlLink ? null : (
    <Alert severity="warning">
      Read-Only Mode. Please add the annotation for the graphql endpoint with
      the key "graphql/endpoint".
    </Alert>
  );

  const fetcher = graphqlLink
    ? async graphQLParams => {
        const data = await fetch(graphqlLink, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphQLParams),
          credentials: 'same-origin',
        });
        return data.json().catch(() => data.text());
      }
    : () =>
        Promise.resolve(
          'Read-Only Mode. Please add the annotation for the graphql endpoint.',
        ) as any;

  return (
    <Suspense fallback={<Progress />}>
      <div className={classes.root}>
        <div className={classes.graphiQlWrapper}>
          {warningMessage}
          <GraphiQL
            fetcher={fetcher}
            schema={schema}
            docExplorerOpen
            defaultSecondaryEditorOpen={false}
            readOnly={readOnly}
          />
        </div>
      </div>
    </Suspense>
  );
};
