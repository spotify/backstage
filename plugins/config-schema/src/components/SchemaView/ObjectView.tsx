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
import React from 'react';
import { ChildView } from './ChildView';
import { MetadataView } from './MetadataView';
import { SchemaViewProps } from './types';

function isRequired(name: string, required?: boolean | string[]) {
  if (required === true) {
    return true;
  }
  if (Array.isArray(required)) {
    return required.includes(name);
  }
  return false;
}

export function ObjectView({ path, depth, schema }: SchemaViewProps) {
  const properties = Object.entries(schema.properties ?? {});
  const patternProperties = Object.entries(schema.patternProperties ?? {});

  return (
    <>
      {depth > 0 && (
        <Box marginBottom={4}>
          {schema.description && (
            <Box marginBottom={4}>
              <Typography variant="body1">{schema.description}</Typography>
            </Box>
          )}
          <MetadataView schema={schema} />
        </Box>
      )}
      {properties.length > 0 && (
        <>
          {depth > 0 && <Typography variant="overline">Properties</Typography>}
          {properties.map(([name, propSchema], index) => (
            <ChildView
              key={name}
              path={path ? `${path}.${name}` : name}
              depth={depth + 1}
              schema={propSchema}
              lastChild={index === properties.length - 1}
              required={isRequired(name, schema.required)}
            />
          ))}
        </>
      )}
      {patternProperties.length > 0 && (
        <>
          {depth > 0 && (
            <Typography variant="overline">Pattern Properties</Typography>
          )}
          {patternProperties.map(([name, propSchema], index) => (
            <ChildView
              key={name}
              path={path ? `${path}.<${name}>` : name}
              depth={depth + 1}
              schema={propSchema}
              lastChild={index === patternProperties.length - 1}
              required={isRequired(name, schema.required)}
            />
          ))}
        </>
      )}
      {schema.additionalProperties && schema.additionalProperties !== true && (
        <>
          <Typography variant="overline">Additional Properties</Typography>
          <ChildView
            path={`${path}.*`}
            depth={depth + 1}
            schema={schema.additionalProperties}
            lastChild
          />
        </>
      )}
    </>
  );
}
