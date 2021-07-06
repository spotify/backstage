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
  useEffect,
  useState,
  forwardRef,
  FormEventHandler,
  ChangeEvent,
} from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@material-ui/core';
import { AlertFormProps, Entity } from '../../types';
import { KubernetesMigrationAlert } from '../alerts';
import { findAlways } from '../../utils/assert';

export type KubernetesMigrationDismissFormData = {
  services: Entity[];
};

export type KubernetesMigrationDismissFormProps = AlertFormProps<
  KubernetesMigrationAlert,
  KubernetesMigrationDismissFormData
>;

export const KubernetesMigrationDismissForm = forwardRef<
  HTMLFormElement,
  KubernetesMigrationDismissFormProps
>(({ onSubmit, disableSubmit, alert }, ref) => {
  const [services, setServices] = useState<Entity[]>(alert.data.services);

  const onFormSubmit: FormEventHandler = e => {
    /* Remember to prevent default form behavior */
    e.preventDefault();
    onSubmit({ services: services });
  };

  const onCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (checked) {
      const service = findAlways(
        alert.data.services,
        s => s.id === e.target.value,
      );
      setServices(prevServices => prevServices.concat(service));
    } else {
      setServices(prevServices =>
        prevServices.filter(p => p.id !== e.target.value),
      );
    }
  };

  /* Submit button is disabled by default. Use props.disableSubmit to toggle disabled state. */
  useEffect(() => {
    if (services.length) {
      disableSubmit(false);
    } else {
      disableSubmit(true);
    }
  }, [services, disableSubmit]);

  return (
    /* All custom forms must accept a ref and implement an onSubmit handler. */
    <form ref={ref} onSubmit={onFormSubmit}>
      <FormControl component="fieldset" fullWidth>
        <Typography color="textPrimary">
          <b>Or choose which services to dismiss this alert for.</b>
        </Typography>
        <FormGroup>
          {alert.data.services.map((service, index) => (
            <FormControlLabel
              key={`example-option-${index}`}
              label={service.id}
              value={service.id}
              control={
                <Checkbox
                  color="primary"
                  checked={services.some(p => p.id === service.id)}
                  onChange={onCheckboxChange}
                />
              }
            />
          ))}
        </FormGroup>
      </FormControl>
    </form>
  );
});
