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

import { Box, Typography } from '@material-ui/core';
import { Schema } from 'jsonschema';
import React from 'react';
import { ChildView } from './ChildView';
import { MetadataView } from './MetadataView';
import { SchemaViewProps } from './types';

export function ArrayView({ path, depth, schema }: SchemaViewProps) {
  const itemDepth = depth + 1;
  const itemPath = path ? `${path}[]` : '[]';
  const itemSchema = schema.items;

  return (
    <>
      <Box marginBottom={4}>
        {schema.description && (
          <Box marginBottom={4}>
            <Typography variant="body1">{schema.description}</Typography>
          </Box>
        )}
        <MetadataView schema={schema} />
      </Box>
      <Typography variant="overline">Items</Typography>
      <ChildView
        lastChild
        path={itemPath}
        depth={itemDepth}
        schema={itemSchema as Schema | undefined}
      />
      {schema.additionalItems && schema.additionalItems !== true && (
        <>
          <Typography variant="overline">Additional Items</Typography>
          <ChildView
            path={itemPath}
            depth={itemDepth}
            schema={schema.additionalItems}
            lastChild
          />
        </>
      )}
    </>
  );
}
