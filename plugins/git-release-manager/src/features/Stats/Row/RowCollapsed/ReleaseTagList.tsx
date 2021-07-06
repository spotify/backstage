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
import { Box, Typography } from '@material-ui/core';

import { ReleaseStats } from '../../contexts/ReleaseStatsContext';

export function ReleaseTagList({
  releaseStat,
}: {
  releaseStat: ReleaseStats['releases']['0'];
}) {
  return (
    <Box
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {releaseStat.versions.length > 0 && (
        <Box style={{ position: 'relative' }}>
          {releaseStat.versions.map(version => (
            <Typography variant="body1" key={version.tagName}>
              {version.tagName}
            </Typography>
          ))}
        </Box>
      )}

      {releaseStat.versions.length > 0 && (
        <Box
          margin={1}
          style={{
            position: 'relative',
            transform: 'rotate(-45deg)',
            fontSize: 30,
          }}
        >
          {' 🚀 '}
        </Box>
      )}

      <Box style={{ position: 'relative' }}>
        {releaseStat.candidates.map(candidate => (
          <Typography variant="body1" key={candidate.tagName}>
            {candidate.tagName}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
