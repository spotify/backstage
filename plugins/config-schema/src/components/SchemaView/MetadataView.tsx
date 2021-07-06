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

import { JsonValue } from '@backstage/config';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Schema } from 'jsonschema';
import React from 'react';

export interface MetadataViewRowProps {
  label: string;
  text?: string;
  data?: JsonValue;
}

export function MetadataViewRow({ label, text, data }: MetadataViewRowProps) {
  if (text === undefined && data === undefined) {
    return null;
  }
  return (
    <TableRow>
      <TableCell style={{ width: 160 }}>
        <Typography variant="body1" noWrap style={{ fontWeight: 900 }}>
          {label}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1">
          {data ? JSON.stringify(data) : text}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export function MetadataView({ schema }: { schema: Schema }) {
  return (
    <Paper variant="outlined" square style={{ width: '100%' }}>
      <Table size="small">
        <TableBody>
          <MetadataViewRow label="Type" data={schema.type} />
          <MetadataViewRow label="Allowed values" data={schema.enum} />
          {schema.additionalProperties === true && (
            <MetadataViewRow label="Additional Properties" text="true" />
          )}
          {schema.additionalItems === true && (
            <MetadataViewRow label="Additional Items" text="true" />
          )}
          <MetadataViewRow label="Format" text={schema.format} />
          <MetadataViewRow
            label="Pattern"
            text={schema.pattern && String(schema.pattern)}
          />
          <MetadataViewRow label="Minimum" data={schema.minimum} />
          <MetadataViewRow label="Maximum" data={schema.maximum} />
          <MetadataViewRow
            label="Exclusive minimum"
            data={schema.exclusiveMinimum}
          />
          <MetadataViewRow
            label="Exclusive maximum"
            data={schema.exclusiveMaximum}
          />
          <MetadataViewRow label="Multiple of" data={schema.multipleOf} />
          <MetadataViewRow
            label="Maximum number of items"
            data={schema.maxItems}
          />
          <MetadataViewRow
            label="Minimum number of items"
            data={schema.minItems}
          />
          <MetadataViewRow
            label="Maximum number of properties"
            data={schema.maxProperties}
          />
          <MetadataViewRow
            label="Minimum number of properties"
            data={schema.minProperties}
          />
          <MetadataViewRow label="Maximum Length" data={schema.maxLength} />
          <MetadataViewRow label="Minimum Length" data={schema.minLength} />
          <MetadataViewRow
            label="Items must be unique"
            data={schema.uniqueItems}
          />
        </TableBody>
      </Table>
    </Paper>
  );
}
