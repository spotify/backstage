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
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { ErrorPage } from '@backstage/core-components';

type Props = {
  errorMessage?: string;
};

export const TechDocsNotFound = ({ errorMessage }: Props) => {
  const techdocsBuilder = useApi(configApiRef).getOptionalString(
    'techdocs.builder',
  );

  let additionalInfo = '';
  if (techdocsBuilder !== 'local') {
    additionalInfo =
      "Note that techdocs.builder is not set to 'local' in your config, which means this Backstage app will not " +
      "generate docs if they are not found. Make sure the project's docs are generated and published by some external " +
      "process (e.g. CI/CD pipeline). Or change techdocs.builder to 'local' to generate docs from this Backstage " +
      'instance.';
  }

  return (
    <ErrorPage
      status="404"
      statusMessage={errorMessage || 'Documentation not found'}
      additionalInfo={additionalInfo}
    />
  );
};
