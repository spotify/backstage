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

import { Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { ComponentProps } from 'react';

const useStyles = makeStyles(theme => ({
  wrapper: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

export const NextButton = (
  props: ComponentProps<typeof Button> & { loading?: boolean },
) => {
  const { loading, ...buttonProps } = props;
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Button
        color="primary"
        variant="contained"
        {...buttonProps}
        disabled={props.disabled || props.loading}
      />
      {props.loading && (
        <CircularProgress size="1.5rem" className={classes.buttonProgress} />
      )}
      {props.loading}
    </div>
  );
};

export const BackButton = (props: ComponentProps<typeof Button>) => {
  const classes = useStyles();

  return (
    <Button variant="outlined" className={classes.button} {...props}>
      {props.children || 'Back'}
    </Button>
  );
};
