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
import { Box, Chip, Divider, makeStyles, Typography } from '@material-ui/core';
import { Schema } from 'jsonschema';
import React, { useEffect, useRef } from 'react';
import { useScrollTargets } from '../ScrollTargetsContext/ScrollTargetsContext';
import { SchemaView } from './SchemaView';

export interface MetadataViewRowProps {
  label: string;
  text?: string;
  data?: JsonValue;
}

function titleVariant(depth: number) {
  if (depth <= 1) {
    return 'h2';
  } else if (depth === 2) {
    return 'h3';
  } else if (depth === 3) {
    return 'h4';
  } else if (depth === 4) {
    return 'h5';
  }
  return 'h6';
}

const useChildViewStyles = makeStyles(theme => ({
  title: {
    marginBottom: 0,
  },
  chip: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
    marginBottom: 0,
  },
}));

export function ChildView({
  path,
  depth,
  schema,
  required,
  lastChild,
}: {
  path: string;
  depth: number;
  schema?: Schema;
  required?: boolean;
  lastChild?: boolean;
}) {
  const classes = useChildViewStyles();
  const titleRef = useRef<HTMLElement>(null);
  const scroll = useScrollTargets();

  useEffect(() => {
    return scroll?.setScrollListener(path, () => {
      titleRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [scroll, path]);

  const chips = new Array<JSX.Element>();
  const chipProps = { size: 'small' as const, classes: { root: classes.chip } };

  if (required) {
    chips.push(
      <Chip label="required" color="default" key="required" {...chipProps} />,
    );
  }

  const visibility = (schema as { visibility?: string })?.visibility;
  if (visibility === 'frontend') {
    chips.push(
      <Chip label="frontend" color="primary" key="visibility" {...chipProps} />,
    );
  } else if (visibility === 'secret') {
    chips.push(
      <Chip label="secret" color="secondary" key="visibility" {...chipProps} />,
    );
  }

  return (
    <Box paddingBottom={lastChild ? 4 : 8} display="flex" flexDirection="row">
      <Divider orientation="vertical" flexItem />
      <Box paddingLeft={2} flex={1}>
        <Box
          display="flex"
          flexDirection="row"
          marginBottom={2}
          alignItems="center"
        >
          <Typography
            ref={titleRef}
            variant={titleVariant(depth)}
            classes={{ root: classes.title }}
          >
            {path}
          </Typography>
          {chips.length > 0 && <Box marginLeft={1} />}
          {chips}
        </Box>
        {schema && (
          <SchemaView path={path} depth={depth} schema={schema as Schema} />
        )}
      </Box>
    </Box>
  );
}
