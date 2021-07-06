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

import React, {
  ChangeEvent,
  useEffect,
  useState,
  forwardRef,
  FormEventHandler,
} from 'react';
import { DateTime } from 'luxon';
import {
  Box,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
} from '@material-ui/core';
import {
  Alert,
  AlertFormProps,
  Duration,
  DEFAULT_DATE_FORMAT,
  Maybe,
  AlertSnoozeFormData,
  AlertSnoozeOptions,
} from '../types';
import { useAlertDialogStyles as useStyles } from '../utils/styles';
import { intervalsOf } from '../utils/duration';

export type AlertSnoozeFormProps = AlertFormProps<Alert, AlertSnoozeFormData>;

export const AlertSnoozeForm = forwardRef<
  HTMLFormElement,
  AlertSnoozeFormProps
>(({ onSubmit, disableSubmit }, ref) => {
  const classes = useStyles();
  const [duration, setDuration] = useState<Maybe<Duration>>(Duration.P7D);

  useEffect(() => disableSubmit(false), [disableSubmit]);

  const onFormSubmit: FormEventHandler = e => {
    e.preventDefault();
    if (duration) {
      const repeatInterval = 1;
      const today = DateTime.now().toFormat(DEFAULT_DATE_FORMAT);
      onSubmit({
        intervals: intervalsOf(duration, today, repeatInterval),
      });
    }
  };

  const onSnoozeDurationChange = (
    _: ChangeEvent<HTMLInputElement>,
    value: string,
  ) => {
    setDuration(value as Duration);
  };

  return (
    <form ref={ref} onSubmit={onFormSubmit}>
      <FormControl component="fieldset" fullWidth>
        <Typography color="textPrimary">
          <b>For how long?</b>
        </Typography>
        <Box mb={1}>
          <RadioGroup
            name="snooze-alert-options"
            value={duration}
            onChange={onSnoozeDurationChange}
          >
            {AlertSnoozeOptions.map(option => (
              <FormControlLabel
                key={`snooze-alert-option-${option.duration}`}
                label={option.label}
                value={option.duration}
                control={<Radio className={classes.radio} />}
              />
            ))}
          </RadioGroup>
        </Box>
      </FormControl>
    </form>
  );
});
