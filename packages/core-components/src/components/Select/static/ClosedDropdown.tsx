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
import React from 'react';
import { SvgIcon, makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    icon: {
      position: 'absolute',
      right: '4px',
      pointerEvents: 'none',
    },
  }),
);

const ClosedDropdown = () => {
  const classes = useStyles();
  return (
    <SvgIcon
      className={classes.icon}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 8L6 9.5L12.0703 15.5703L18.1406 9.5L16.6406 8L12.0703 12.5703L7.5 8Z"
        fill="#616161"
      />
    </SvgIcon>
  );
};

export default ClosedDropdown;
