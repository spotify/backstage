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

import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import { Theme, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    gridArea: 'pageContent',
    minWidth: 0,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    ...theme.mixins.gutters({}),
  },
  stretch: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  noPadding: {
    padding: 0,
  },
}));

type Props = {
  stretch?: boolean;
  noPadding?: boolean;
  className?: string;
};

export const Content = ({
  className,
  stretch,
  noPadding,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const classes = useStyles();
  return (
    <article
      {...props}
      className={classNames(classes.root, className, {
        [classes.stretch]: stretch,
        [classes.noPadding]: noPadding,
      })}
    >
      {children}
    </article>
  );
};
