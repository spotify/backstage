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
import { BitriseBuildResult } from '../../api/bitriseApi.model';
import { Alert } from '@material-ui/lab';
import { BitriseDownloadArtifactComponent } from '../BitriseDownloadArtifactComponent';
import { useBitriseArtifacts } from '../useBitriseArtifacts';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import { Progress } from '@backstage/core-components';

type BitriseArtifactsComponentComponentProps = {
  build: BitriseBuildResult;
};

export const BitriseArtifactsComponent = (
  props: BitriseArtifactsComponentComponentProps,
) => {
  const { value, loading, error } = useBitriseArtifacts(
    props.build.appSlug,
    props.build.buildSlug,
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  } else if (!value || !value.length) {
    return <Alert severity="info">No artifacts</Alert>;
  }

  return (
    <List>
      {value.map(row => (
        <ListItem key={row.slug}>
          <ListItemText primary={row.title} secondary={row.artifact_type} />
          <ListItemSecondaryAction>
            <BitriseDownloadArtifactComponent
              appSlug={props.build.appSlug}
              buildSlug={props.build.buildSlug}
              artifactSlug={row.slug}
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};
