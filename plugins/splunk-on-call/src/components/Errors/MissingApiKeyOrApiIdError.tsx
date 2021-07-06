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
import React from 'react';
import { Button } from '@material-ui/core';
import { EmptyState } from '@backstage/core-components';

export const MissingApiKeyOrApiIdError = () => (
  <EmptyState
    missing="info"
    title="Missing or invalid Splunk On-Call API key and/or API id"
    description="The request to fetch data needs a valid api id and a valid api key. See README for more details."
    action={
      <Button
        color="primary"
        variant="contained"
        href="https://github.com/backstage/backstage/blob/master/plugins/splunk-on-call/README.md"
      >
        Read More
      </Button>
    }
  />
);
