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
import {
  Box,
  Collapse,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import {
  Alert,
  AlertFormProps,
  AlertDismissReason,
  AlertDismissOptions,
  AlertDismissFormData,
  Maybe,
} from '../types';
import { useAlertDialogStyles as useStyles } from '../utils/styles';

export type AlertDismissFormProps = AlertFormProps<Alert, AlertDismissFormData>;

export const AlertDismissForm = forwardRef<
  HTMLFormElement,
  AlertDismissFormProps
>(({ onSubmit, disableSubmit }, ref) => {
  const classes = useStyles();
  const [other, setOther] = useState<Maybe<string>>(null);
  const [feedback, setFeedback] = useState<Maybe<string>>(null);
  const [reason, setReason] = useState<AlertDismissReason>(
    AlertDismissReason.Resolved,
  );

  const onFormSubmit: FormEventHandler = e => {
    e.preventDefault();
    if (reason) {
      onSubmit({
        other: other,
        reason: reason,
        feedback: feedback,
      });
    }
  };

  const onReasonChange = (_: ChangeEvent<HTMLInputElement>, value: string) => {
    if (other) {
      setOther(null);
    }
    setReason(value as AlertDismissReason);
  };

  const onOtherChange = (e: ChangeEvent<HTMLInputElement>) => {
    return e.target.value
      ? setOther(e.target.value as AlertDismissReason)
      : setOther(null);
  };

  const onFeedbackChange = (e: ChangeEvent<HTMLInputElement>) => {
    return e.target.value
      ? setFeedback(e.target.value as AlertDismissReason)
      : setFeedback(null);
  };

  useEffect(() => {
    function validateDismissForm() {
      if (reason === AlertDismissReason.Other) {
        if (other) {
          disableSubmit(false);
        } else {
          disableSubmit(true);
        }
      } else if (reason) {
        disableSubmit(false);
      } else {
        disableSubmit(true);
      }
    }

    validateDismissForm();
  }, [reason, other, disableSubmit]);

  return (
    <form ref={ref} onSubmit={onFormSubmit}>
      <FormControl component="fieldset" fullWidth>
        <Typography color="textPrimary">
          <b>Reason for dismissing?</b>
        </Typography>
        <Box mb={1}>
          <RadioGroup
            name="dismiss-alert-reasons"
            value={reason}
            onChange={onReasonChange}
          >
            {AlertDismissOptions.map(option => (
              <FormControlLabel
                key={`dismiss-alert-option-${option.reason}`}
                label={option.label}
                value={option.reason}
                control={<Radio className={classes.radio} />}
              />
            ))}
          </RadioGroup>
          <Collapse in={reason === AlertDismissReason.Other}>
            <Box ml={4}>
              <TextField
                id="dismiss-alert-option-other"
                variant="outlined"
                multiline
                fullWidth
                rows={4}
                value={other ?? ''}
                onChange={onOtherChange}
              />
            </Box>
          </Collapse>
        </Box>
        <Typography gutterBottom>
          <b>Any other feedback you can provide?</b>
        </Typography>
        <TextField
          id="dismiss-alert-feedback"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={feedback ?? ''}
          onChange={onFeedbackChange}
        />
      </FormControl>
    </form>
  );
});
