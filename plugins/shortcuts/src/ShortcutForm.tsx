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

import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  Button,
  CardActions,
  CardContent,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { FormValues } from './types';

const useStyles = makeStyles(theme => ({
  field: {
    marginBottom: theme.spacing(2),
  },
  actionRoot: {
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    justifyContent: 'flex-start',
  },
}));

type Props = {
  formValues?: FormValues;
  onSave: SubmitHandler<FormValues>;
  onClose: () => void;
};

export const ShortcutForm = ({ formValues, onSave, onClose }: Props) => {
  const classes = useStyles();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      url: formValues?.url ?? '',
      title: formValues?.title ?? '',
    },
  });

  useEffect(() => {
    reset(formValues);
  }, [reset, formValues]);

  return (
    <>
      <CardContent>
        <Controller
          name="url"
          control={control}
          rules={{
            required: true,
            pattern: {
              value: /^\//,
              message: 'Must be a relative URL (starts with a /)',
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.url}
              helperText={errors.url?.message}
              type="text"
              placeholder="Enter a URL"
              InputLabelProps={{
                shrink: true,
              }}
              className={classes.field}
              fullWidth
              label="Shortcut URL"
              variant="outlined"
              autoComplete="off"
            />
          )}
        />
        <Controller
          name="title"
          control={control}
          rules={{
            required: true,
            minLength: {
              value: 2,
              message: 'Must be at least 2 characters',
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.title}
              helperText={errors.title?.message}
              type="text"
              placeholder="Enter a display name"
              InputLabelProps={{
                shrink: true,
              }}
              className={classes.field}
              fullWidth
              label="Display Name"
              variant="outlined"
              autoComplete="off"
            />
          )}
        />
      </CardContent>
      <CardActions classes={{ root: classes.actionRoot }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit(onSave)}
        >
          Save
        </Button>
        <Button variant="outlined" size="large" onClick={onClose}>
          Cancel
        </Button>
      </CardActions>
    </>
  );
};
