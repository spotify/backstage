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
import {
  Box,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import { getDecimalNumber } from '../helpers/getDecimalNumber';
import { getSummary } from '../helpers/getSummary';
import { useReleaseStatsContext } from '../contexts/ReleaseStatsContext';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export function Summary() {
  const { releaseStats } = useReleaseStatsContext();
  const { summary } = getSummary({ releaseStats });
  const classes = useStyles();

  return (
    <Box margin={1}>
      <Typography variant="h4">Summary</Typography>

      <Typography variant="body2">
        <strong>Total releases</strong>: {summary.totalReleases}
      </Typography>

      <TableContainer>
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Patches</TableCell>
              <TableCell>Patches per release</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Release Candidate
              </TableCell>
              <TableCell>{summary.totalCandidatePatches}</TableCell>
              <TableCell>
                {getDecimalNumber(
                  summary.totalCandidatePatches / summary.totalReleases,
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row">
                Release Version
              </TableCell>
              <TableCell>{summary.totalVersionPatches}</TableCell>
              <TableCell>
                {getDecimalNumber(
                  summary.totalVersionPatches / summary.totalReleases,
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row">
                Total
              </TableCell>
              <TableCell>
                {summary.totalCandidatePatches + summary.totalVersionPatches}
              </TableCell>
              <TableCell>
                {getDecimalNumber(
                  (summary.totalCandidatePatches +
                    summary.totalVersionPatches) /
                    summary.totalReleases,
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
