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

import React, { useState } from 'react';
import { DateTime } from 'luxon';
import {
  Collapse,
  IconButton,
  makeStyles,
  TableCell,
  TableRow,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { ReleaseStats } from '../contexts/ReleaseStatsContext';

import { RowCollapsed } from './RowCollapsed/RowCollapsed';
import { Link } from '@backstage/core-components';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

interface RowProps {
  baseVersion: string;
  releaseStat: ReleaseStats['releases']['0'];
}

export function Row({ baseVersion, releaseStat }: RowProps) {
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowDownIcon /> : <ChevronRightIcon />}
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row">
          <Link to={releaseStat.htmlUrl} target="_blank">
            {baseVersion}
            {releaseStat.versions.length === 0 ? ' (prerelease)' : ''}
          </Link>
        </TableCell>

        <TableCell>
          {releaseStat.createdAt
            ? DateTime.fromISO(releaseStat.createdAt).toFormat('yyyy-MM-dd')
            : '-'}
        </TableCell>

        <TableCell>{releaseStat.candidates.length}</TableCell>

        <TableCell>{Math.max(0, releaseStat.versions.length - 1)}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <RowCollapsed releaseStat={releaseStat} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
