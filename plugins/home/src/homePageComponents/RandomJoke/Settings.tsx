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
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import React from 'react';
import { useRandomJoke, JokeType } from './Context';

export const Settings = () => {
  const { type, handleChangeType } = useRandomJoke();
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Joke Type</FormLabel>
      <RadioGroup
        aria-label="joke type"
        value={type}
        onChange={e => handleChangeType(e.target.value)}
      >
        {Object.values(JokeType).map(t => (
          <FormControlLabel
            key={t}
            value={t}
            control={<Radio />}
            label={`${t.slice(0, 1).toUpperCase()}${t.slice(1)}`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
