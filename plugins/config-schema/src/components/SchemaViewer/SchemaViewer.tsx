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

import { Box, Paper } from '@material-ui/core';
import { Schema } from 'jsonschema';
import React from 'react';
import { SchemaView } from '../SchemaView';
import { SchemaBrowser } from '../SchemaBrowser';
import { ScrollTargetsProvider } from '../ScrollTargetsContext/ScrollTargetsContext';

export interface SchemaViewerProps {
  schema: Schema;
}

export const SchemaViewer = ({ schema }: SchemaViewerProps) => {
  return (
    <Box flex="1" position="relative">
      <Box
        clone
        position="absolute"
        display="flex"
        flexDirection="row"
        flexWrap="nowrap"
        maxHeight="100%"
      >
        <Paper elevation={3}>
          <ScrollTargetsProvider>
            <Box padding={1} overflow="auto" width={300}>
              <SchemaBrowser schema={schema} />
            </Box>

            <Box flex="1" overflow="auto">
              <SchemaView schema={schema} path="" depth={0} />
            </Box>
          </ScrollTargetsProvider>
        </Paper>
      </Box>
    </Box>
  );
};
