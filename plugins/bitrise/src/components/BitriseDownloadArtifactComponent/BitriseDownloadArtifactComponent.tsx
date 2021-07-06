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
import CloudDownload from '@material-ui/icons/CloudDownload';
import { CircularProgress, IconButton, Tooltip } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import { useBitriseArtifactDetails } from '../useBitriseArtifactDetails';
import { Alert } from '@material-ui/lab';

type BitriseDownloadArtifactComponentProps = {
  appSlug: string;
  buildSlug: string;
  artifactSlug: string;
};

export const BitriseDownloadArtifactComponent = ({
  appSlug,
  buildSlug,
  artifactSlug,
}: BitriseDownloadArtifactComponentProps) => {
  const { value, loading, error } = useBitriseArtifactDetails(
    appSlug,
    buildSlug,
    artifactSlug,
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!value?.public_install_page_url && !value?.expiring_download_url) {
    return <Alert severity="warning">Cannot be installed/downloaded.</Alert>;
  }

  return (
    <>
      {!!value.public_install_page_url && (
        <Tooltip title="Install">
          <IconButton
            href={value.public_install_page_url}
            target="_blank"
            rel="noopener"
          >
            <LinkIcon />
          </IconButton>
        </Tooltip>
      )}

      {!!value.expiring_download_url && (
        <Tooltip title="Download">
          <IconButton
            href={value.expiring_download_url}
            target="_blank"
            rel="noopener"
          >
            <CloudDownload />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};
