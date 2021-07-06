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
import { Alert } from '@material-ui/lab';
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { getMappedReleases } from './helpers/getMappedReleases';

import { getReleaseStats } from './helpers/getReleaseStats';
import { Info } from './Info/Info';
import { ReleaseStatsContext } from './contexts/ReleaseStatsContext';
import { Row } from './Row/Row';
import { useGetStats } from './hooks/useGetStats';
import { useProjectContext } from '../../contexts/ProjectContext';
import { Warn } from './Warn';
import { Progress } from '@backstage/core-components';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export function DialogBody() {
  const classes = useStyles();
  const { stats } = useGetStats();
  const { project } = useProjectContext();

  if (stats.error) {
    return (
      <Alert severity="error">Unexpected error: {stats.error.message}</Alert>
    );
  }

  if (stats.loading) {
    return <Progress />;
  }

  if (!stats.value) {
    return <Alert severity="error">Couldn't find any stats :(</Alert>;
  }

  const { allReleases, allTags } = stats.value;
  const { mappedReleases } = getMappedReleases({ allReleases, project });
  const { releaseStats } = getReleaseStats({
    mappedReleases,
    allTags,
    project,
  });

  return (
    <ReleaseStatsContext.Provider value={{ releaseStats }}>
      <Info />

      <TableContainer>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Release</TableCell>
              <TableCell>Created at</TableCell>
              <TableCell># candidate patches</TableCell>
              <TableCell># release patches</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.entries(releaseStats.releases).map(
              ([baseVersion, releaseStat], index) => {
                return (
                  <Row
                    key={`row-${index}`}
                    baseVersion={baseVersion}
                    releaseStat={releaseStat}
                  />
                );
              },
            )}
          </TableBody>
        </Table>

        {(releaseStats.unmappableTags.length > 0 ||
          releaseStats.unmatchedTags.length > 0 ||
          releaseStats.unmatchedReleases.length > 0) && <Warn />}
      </TableContainer>
    </ReleaseStatsContext.Provider>
  );
}
