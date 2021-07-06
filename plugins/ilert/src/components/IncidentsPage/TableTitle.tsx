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
import React from 'react';
import { PENDING, ACCEPTED, RESOLVED, IncidentStatus } from '../../types';
import { incidentStatusLabels } from '../Incident/IncidentStatus';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  label: {
    marginTop: 8,
    marginRight: 4,
  },
  formControl: {
    minWidth: 120,
    maxWidth: 300,
  },
  grow: {
    flexGrow: 1,
  },
});

export const TableTitle = ({
  incidentStates,
  onIncidentStatesChange,
}: {
  incidentStates: IncidentStatus[];
  onIncidentStatesChange: (states: IncidentStatus[]) => void;
}) => {
  const classes = useStyles();
  const handleIncidentStatusSelectChange = (event: any) => {
    onIncidentStatesChange(event.target.value);
  };

  return (
    <div className={classes.root}>
      <Typography noWrap className={classes.label}>
        Status:
      </Typography>
      <FormControl
        className={classes.formControl}
        variant="outlined"
        size="small"
      >
        <Select
          id="incidents-status-select"
          multiple
          value={incidentStates}
          onChange={handleIncidentStatusSelectChange}
          renderValue={(selected: any) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {[PENDING, ACCEPTED, RESOLVED].map(state => (
            <MenuItem key={state} value={state}>
              <Checkbox
                checked={incidentStates.indexOf(state as IncidentStatus) > -1}
              />
              <ListItemText primary={incidentStatusLabels[state]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
