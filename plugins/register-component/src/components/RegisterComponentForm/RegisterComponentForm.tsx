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
import {
  Button,
  FormControl,
  FormHelperText,
  LinearProgress,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ComponentIdValidators } from '../../util/validate';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  form: {
    alignItems: 'flex-start',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  buttonSpacing: {
    marginLeft: theme.spacing(1),
  },
  buttons: {
    marginTop: theme.spacing(2),
  },
  select: {
    minWidth: 120,
  },
}));

export type Props = {
  onSubmit: (formData: Record<string, string>) => Promise<void>;
  submitting?: boolean;
};

export const RegisterComponentForm = ({ onSubmit, submitting }: Props) => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onChange',
  });
  const classes = useStyles();
  const hasErrors = !!errors.entityLocation;
  const dirty = formState?.isDirty;

  const onSubmitValidate = handleSubmit(data => {
    data.mode = 'validate';
    onSubmit(data);
  });

  const onSubmitRegister = handleSubmit(data => {
    data.mode = 'register';
    onSubmit(data);
  });

  return submitting ? (
    <LinearProgress data-testid="loading-progress" />
  ) : (
    <form
      autoComplete="off"
      className={classes.form}
      data-testid="register-form"
    >
      <FormControl>
        <TextField
          id="registerComponentInput"
          variant="outlined"
          label="Entity file URL"
          error={hasErrors}
          placeholder="https://example.com/user/some-service/blob/master/catalog-info.yaml"
          name="entityLocation"
          required
          margin="normal"
          helperText="Enter the full path to the catalog-info.yaml file in GitHub, GitLab, Bitbucket or Azure to start tracking your component."
          inputRef={register({
            required: true,
            validate: ComponentIdValidators,
          })}
        />

        {errors.entityLocation && (
          <FormHelperText error={hasErrors} id="register-component-helper-text">
            {errors.entityLocation.message}
          </FormHelperText>
        )}
      </FormControl>

      <div className={classes.buttons}>
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          disabled={!dirty || hasErrors}
          onClick={onSubmitValidate}
        >
          Validate
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.buttonSpacing}
          disabled={!dirty || hasErrors}
          onClick={onSubmitRegister}
        >
          Register
        </Button>
      </div>
    </form>
  );
};
