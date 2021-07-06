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
};

export const GraphQlDefinitionWidget = ({ definition }: Props) => {
  const classes = useStyles();
  const schema = buildSchema(definition);

  return (
    <Suspense fallback={<Progress />}>
      <div className={classes.root}>
        <div className={classes.graphiQlWrapper}>
          <GraphiQL
            fetcher={() => Promise.resolve(null) as any}
            schema={schema}
            docExplorerOpen
            defaultSecondaryEditorOpen={false}
          />
        </div>
      </div>
    </Suspense>
  );
};
