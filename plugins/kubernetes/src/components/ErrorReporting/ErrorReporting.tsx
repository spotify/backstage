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
import * as React from 'react';
import { DetectedError, DetectedErrorsByCluster } from '../../error-detection';
import { Chip, Typography, Grid } from '@material-ui/core';
import EmptyStateImage from '../../assets/emptystate.svg';
import { Table, TableColumn, InfoCard } from '@backstage/core-components';

type ErrorReportingProps = {
  detectedErrors: DetectedErrorsByCluster;
};

const columns: TableColumn<DetectedError>[] = [
  {
    title: 'cluster',
    width: '15%',
    render: (detectedError: DetectedError) => detectedError.cluster,
  },
  {
    title: 'kind',
    width: '15%',
    render: (detectedError: DetectedError) => detectedError.kind,
  },
  {
    title: 'name',
    width: '30%',
    render: (detectedError: DetectedError) => {
      const errorCount = detectedError.names.length;

      if (errorCount === 0) {
        // This shouldn't happen
        return null;
      }

      const displayName = detectedError.names[0];

      const otherErrorCount = errorCount - 1;

      return (
        <>
          {displayName}{' '}
          {otherErrorCount > 0 && (
            <Chip
              label={`+ ${otherErrorCount} other${
                otherErrorCount > 1 ? 's' : ''
              }`}
              size="small"
            />
          )}
        </>
      );
    },
  },
  {
    title: 'messages',
    width: '40%',
    render: (detectedError: DetectedError) => (
      <>
        {detectedError.message.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </>
    ),
  },
];

const sortBySeverity = (a: DetectedError, b: DetectedError) => {
  if (a.severity < b.severity) {
    return 1;
  } else if (b.severity < a.severity) {
    return -1;
  }
  return 0;
};

export const ErrorEmptyState = () => {
  return (
    <Grid
      container
      justify="space-around"
      direction="row"
      alignItems="center"
      spacing={2}
    >
      <Grid item xs={4}>
        <Typography variant="h5">
          Nice! There are no errors to report!
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <img
          src={EmptyStateImage}
          alt="EmptyState"
          data-testid="emptyStateImg"
        />
      </Grid>
    </Grid>
  );
};

export const ErrorReporting = ({ detectedErrors }: ErrorReportingProps) => {
  const errors = Array.from(detectedErrors.values())
    .flat()
    .sort(sortBySeverity);

  return (
    <>
      {errors.length === 0 ? (
        <InfoCard title="Error Reporting">
          <ErrorEmptyState />
        </InfoCard>
      ) : (
        <Table
          title="Error Reporting"
          data={errors}
          columns={columns}
          options={{ paging: true, search: false }}
        />
      )}
    </>
  );
};
