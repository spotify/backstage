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
import { Button, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { CodeSnippet } from '@backstage/core-components';

const ENTITY_YAML = `metadata:
  name: example
  links:
    - url: https://dashboard.example.com
      title: My Dashboard
      icon: dashboard`;

const useStyles = makeStyles<BackstageTheme>(theme => ({
  code: {
    borderRadius: 6,
    margin: `${theme.spacing(2)}px 0px`,
    background: theme.palette.type === 'dark' ? '#444' : '#fff',
  },
}));

export const EntityLinksEmptyState = () => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="body1">
        No links defined for this entity. You can add links to your entity YAML
        as shown in the highlighted example below:
      </Typography>
      <div className={classes.code}>
        <CodeSnippet
          text={ENTITY_YAML}
          language="yaml"
          showLineNumbers
          highlightedNumbers={[3, 4, 5, 6]}
          customStyle={{ background: 'inherit', fontSize: '115%' }}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        target="_blank"
        href="https://backstage.io/docs/features/software-catalog/descriptor-format#links-optional"
      >
        Read more
      </Button>
    </>
  );
};
