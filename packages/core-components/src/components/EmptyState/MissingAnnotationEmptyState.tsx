/*
 * Copyright 2020 Spotify AB
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
import { Button, makeStyles, Typography } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import { EmptyState } from './EmptyState';
import { CodeSnippet } from '../CodeSnippet';

const COMPONENT_YAML = `apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example
  description: example.com
  annotations:
    ANNOTATION: value
spec:
  type: website
  lifecycle: production
  owner: user:guest`;

type Props = {
  annotation: string;
};

const useStyles = makeStyles<BackstageTheme>(theme => ({
  code: {
    borderRadius: 6,
    margin: `${theme.spacing(2)}px 0px`,
    background: theme.palette.type === 'dark' ? '#444' : '#fff',
  },
}));

export const MissingAnnotationEmptyState = ({ annotation }: Props) => {
  const classes = useStyles();
  const description = (
    <>
      The <code>{annotation}</code> annotation is missing. You need to add the
      annotation to your component if you want to enable this tool.
    </>
  );
  return (
    <EmptyState
      missing="field"
      title="Missing Annotation"
      description={description}
      action={
        <>
          <Typography variant="body1">
            Add the annotation to your component YAML as shown in the
            highlighted example below:
          </Typography>
          <div className={classes.code}>
            <CodeSnippet
              text={COMPONENT_YAML.replace('ANNOTATION', annotation)}
              language="yaml"
              showLineNumbers
              highlightedNumbers={[6, 7]}
              customStyle={{ background: 'inherit', fontSize: '115%' }}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            href="https://backstage.io/docs/features/software-catalog/well-known-annotations"
          >
            Read more
          </Button>
        </>
      }
    />
  );
};
