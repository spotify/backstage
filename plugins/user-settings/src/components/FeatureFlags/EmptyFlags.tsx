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
import { Button, Typography } from '@material-ui/core';
import { CodeSnippet, EmptyState } from '@backstage/core-components';

const EXAMPLE = `import { createPlugin } from '@backstage/core';

export default createPlugin({
  id: 'plugin-name',
  register({ router, featureFlags }) {
    featureFlags.register('enable-example-feature');
  },
});
`;

export const EmptyFlags = () => (
  <EmptyState
    missing="content"
    title="No Feature Flags"
    description="Feature Flags make it possible for plugins to register features in Backstage for users to opt into. You can use this to split out logic in your code for manual A/B testing, etc."
    action={
      <>
        <Typography variant="body1">
          An example for how to add a feature flag is highlighted below:
        </Typography>
        <CodeSnippet
          text={EXAMPLE}
          language="typescript"
          showLineNumbers
          highlightedNumbers={[6]}
          customStyle={{ background: 'inherit', fontSize: '115%' }}
        />
        <Button
          variant="contained"
          color="primary"
          href="https://backstage.io/docs/api/utility-apis"
        >
          Read More
        </Button>
      </>
    }
  />
);
