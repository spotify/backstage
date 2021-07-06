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

import { BackstageTheme } from '@backstage/theme';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { CodeSnippet } from '@backstage/core-components';

const ENTITY_YAML = `apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example
  description: example.com
  annotations:
    ilert.com/integration-key: [INTEGRATION_KEY]
spec:
  type: website
  lifecycle: production
  owner: guest`;

const useStyles = makeStyles<BackstageTheme>(theme => ({
  code: {
    borderRadius: 6,
    margin: theme.spacing(2, 0),
    background: theme.palette.type === 'dark' ? '#444' : '#fff',
  },
  header: {
    display: 'inline-block',
    padding: theme.spacing(2, 2, 2, 2.5),
  },
}));

export const ILertCardEmptyState = () => {
  const classes = useStyles();

  return (
    <Card data-testid="ilert-empty-card">
      <CardHeader title="iLert" className={classes.header} />
      <Divider />
      <CardContent>
        <Typography variant="body1">
          No integration key defined for this entity. You can add integration
          key to your entity YAML as shown in the highlighted example below:
        </Typography>
        <div className={classes.code}>
          <CodeSnippet
            text={ENTITY_YAML}
            language="yaml"
            showLineNumbers
            highlightedNumbers={[6, 7]}
            customStyle={{ background: 'inherit', fontSize: '115%' }}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          target="_blank"
          href="https://github.com/backstage/backstage/blob/master/plugins/ilert/README.md"
        >
          Read more
        </Button>
      </CardContent>
    </Card>
  );
};
