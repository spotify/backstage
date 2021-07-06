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

import { useEntity } from '@backstage/plugin-catalog-react';
import { makeStyles, Paper } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useAsync } from 'react-use';
import { codeCoverageApiRef } from '../../api';
import { FileEntry } from '../../types';
import { CodeRow } from './CodeRow';
import { highlightLines } from './Highlighter';

import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

type Props = {
  filename: string;
  coverage: FileEntry;
};

const useStyles = makeStyles(theme => ({
  paper: {
    margin: 'auto',
    top: '2em',
    width: '80%',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: 'scroll',
  },
  coverageFileViewTable: {
    borderSpacing: '0px',
    width: '80%',
    marginTop: theme.spacing(2),
  },
}));

type FormattedLinesProps = {
  highlightedLines: string[];
  lineHits: Record<number, number>;
};
const FormattedLines = ({
  highlightedLines,
  lineHits,
}: FormattedLinesProps) => {
  return (
    <>
      {highlightedLines.map((lineContent, idx) => {
        const line = idx + 1;
        return (
          <CodeRow
            key={line}
            lineNumber={line}
            lineContent={lineContent}
            lineHits={lineHits[line]}
          />
        );
      })}
    </>
  );
};

export const FileContent = ({ filename, coverage }: Props) => {
  const { entity } = useEntity();
  const codeCoverageApi = useApi(codeCoverageApiRef);
  const { loading, error, value } = useAsync(
    async () =>
      await codeCoverageApi.getFileContentFromEntity(
        {
          kind: entity.kind,
          namespace: entity.metadata.namespace || 'default',
          name: entity.metadata.name,
        },
        filename,
      ),
    [entity],
  );

  const classes = useStyles();

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ResponseErrorPanel error={error} />;
  }
  if (!value) {
    return (
      <Alert severity="warning">
        Unable to retrieve file content for {filename}
      </Alert>
    );
  }

  const [language] = filename.split('.').slice(-1);
  const highlightedLines = highlightLines(language, value.split('\n'));

  // List of formatted nodes containing highlighted code
  // lineHits array where lineHits[i] is number of hits for line i + 1
  const lineHits = Object.entries(coverage.lineHits).reduce(
    (acc: Record<string, number>, next: [string, number]) => {
      acc[next[0]] = next[1];
      return acc;
    },
    {},
  );

  return (
    <Paper variant="outlined" className={classes.paper}>
      <table className={classes.coverageFileViewTable}>
        <tbody>
          <FormattedLines
            highlightedLines={highlightedLines}
            lineHits={lineHits}
          />
        </tbody>
      </table>
    </Paper>
  );
};
