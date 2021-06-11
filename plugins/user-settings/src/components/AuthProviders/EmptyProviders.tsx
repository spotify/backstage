/*
 * Copyright 2020 Spotify AB
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
import { CodeSnippet, EmptyState } from '@backstage/core';
import { Button, Typography } from '@material-ui/core';

const EXAMPLE = `auth:
  providers:
    google:
      development:
        clientId: \${AUTH_GOOGLE_CLIENT_ID}
        clientSecret: \${AUTH_GOOGLE_CLIENT_SECRET}
`;

export const EmptyProviders = () => (
  <EmptyState
    missing="content"
    title="No Authentication Providers"
    description="You can add Authentication Providers to Backstage which allows you to use these providers to authenticate yourself."
    action={
      <>
        <Typography variant="body1">
          Open <code>app-config.yaml</code> and make the changes as highlighted
          below:
        </Typography>
        <CodeSnippet
          text={EXAMPLE}
          language="yaml"
          showLineNumbers
          highlightedNumbers={[3, 4, 5, 6, 7, 8]}
          customStyle={{ background: 'inherit', fontSize: '115%' }}
        />
        <Button
          variant="contained"
          color="primary"
          href="https://backstage.io/docs/auth/add-auth-provider"
        >
          Read More
        </Button>
      </>
    }
  />
);
