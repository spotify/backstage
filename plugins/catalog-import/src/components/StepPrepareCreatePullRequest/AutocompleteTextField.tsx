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

import { CircularProgress, TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseControllerOptions,
} from 'react-hook-form';

type Props<TFieldValue extends string> = {
  name: TFieldValue;
  options: string[];
  required?: boolean;

  control?: Control<Record<string, any>>;
  errors?: FieldErrors<Record<TFieldValue, string>>;
  rules?: UseControllerOptions<Record<TFieldValue, any>>['rules'];

  loading?: boolean;
  loadingText?: string;

  helperText?: React.ReactNode;
  errorHelperText?: string;

  textFieldProps?: Omit<TextFieldProps, 'required' | 'fullWidth'>;
};

export const AutocompleteTextField = <TFieldValue extends string>({
  name,
  options,
  required,
  control,
  errors,
  rules,
  loading = false,
  loadingText,
  helperText,
  errorHelperText,
  textFieldProps = {},
}: Props<TFieldValue>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ value, onChange, onBlur }) => (
        <Autocomplete
          loading={loading}
          loadingText={loadingText}
          options={options || []}
          onChange={(_: any, v: string | null) => onChange(v || '')}
          onBlur={onBlur}
          value={value}
          autoSelect
          freeSolo
          renderInput={params => (
            <TextField
              {...params}
              helperText={(errors?.[name] && errorHelperText) || helperText}
              error={Boolean(errors?.[name])}
              margin="normal"
              variant="outlined"
              required={required}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size="1em" />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              {...textFieldProps}
            />
          )}
        />
      )}
    />
  );
};
