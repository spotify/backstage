/*
 * Copyright 2024 The Backstage Authors
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

import { useApi } from '@backstage/core-plugin-api';
import {
  scmIntegrationsApiRef,
  scmAuthApiRef,
} from '@backstage/integration-react';
import { useEffect, useState, useCallback } from 'react';
import useDebounce from 'react-use/esm/useDebounce';
import { useTemplateSecrets } from '@backstage/plugin-scaffolder-react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { RepoBranchPickerProps } from './schema';
import { RepoBranchPickerState } from './types';
import { BitbucketRepoBranchPicker } from './BitbucketRepoBranchPicker';
import { DefaultRepoBranchPicker } from './DefaultRepoBranchPicker';
import { GitHubRepoBranchPicker } from './GitHubRepoBranchPicker';
import { GitLabRepoBranchPicker } from './GitLabRepoBranchPicker';
import { MarkdownContent } from '@backstage/core-components';
import { useScaffolderTheme } from '@backstage/plugin-scaffolder-react/alpha';
import { Flex, Text } from '@backstage/ui';

/**
 * The underlying component that is rendered in the form for the `RepoBranchPicker`
 * field extension.
 *
 * @public
 */
export const RepoBranchPicker = (props: RepoBranchPickerProps) => {
  const scaffolderTheme = useScaffolderTheme();
  const {
    uiSchema,
    onChange,
    rawErrors,
    formData,
    schema,
    formContext,
    required,
  } = props;
  const {
    formData: { repoUrl },
  } = formContext;

  const [state, setState] = useState<RepoBranchPickerState>({
    branch: formData || '',
  });
  const { host, branch } = state;

  const integrationApi = useApi(scmIntegrationsApiRef);
  const scmAuthApi = useApi(scmAuthApiRef);

  const { secrets, setSecrets } = useTemplateSecrets();

  useDebounce(
    async () => {
      const { requestUserCredentials } = uiSchema?.['ui:options'] ?? {};

      if (!requestUserCredentials || !host) {
        return;
      }

      // don't show login prompt if secret value is already in state
      if (secrets[requestUserCredentials.secretsKey]) {
        return;
      }

      // user has requested that we use the users credentials
      // so lets grab them using the scmAuthApi and pass through
      // any additional scopes from the ui:options
      const { token } = await scmAuthApi.getCredentials({
        url: `https://${host}`,
        additionalScope: {
          repoWrite: true,
          customScopes: requestUserCredentials.additionalScopes,
        },
      });

      // set the secret using the key provided in the ui:options for use
      // in the templating the manifest with ${{ secrets[secretsKey] }}
      setSecrets({ [requestUserCredentials.secretsKey]: token });
    },
    500,
    [host, uiSchema],
  );

  useEffect(() => {
    if (repoUrl) {
      const url = new URL(`https://${repoUrl}`);

      setState(prevState => ({
        ...prevState,
        host: url.host,
        workspace: url.searchParams.get('workspace') || '',
        repository: url.searchParams.get('repo') || '',
        owner: url.searchParams.get('owner') || '',
      }));
    }
  }, [repoUrl]);

  useEffect(() => {
    onChange(branch);
  }, [branch, onChange]);

  const updateLocalState = useCallback(
    (newState: RepoBranchPickerState) => {
      setState(prevState => ({ ...prevState, ...newState }));
    },
    [setState],
  );

  const hostType = (host && integrationApi.byHost(host)?.type) ?? null;

  const accessToken =
    uiSchema?.['ui:options']?.requestUserCredentials?.secretsKey &&
    secrets[uiSchema['ui:options'].requestUserCredentials.secretsKey];
  const isDisabled = uiSchema?.['ui:disabled'] ?? false;

  const renderRepoBranchPicker = () => {
    switch (hostType) {
      case 'bitbucket':
      case 'bitbucketCloud':
      case 'bitbucketServer':
        return (
          <BitbucketRepoBranchPicker
            onChange={updateLocalState}
            state={state}
            rawErrors={rawErrors}
            accessToken={accessToken}
            isDisabled={isDisabled}
            required={required}
          />
        );
      case 'github':
        return (
          <GitHubRepoBranchPicker
            onChange={updateLocalState}
            state={state}
            rawErrors={rawErrors}
            accessToken={accessToken}
            isDisabled={isDisabled}
            required={required}
          />
        );
      case 'gitlab':
        return (
          <GitLabRepoBranchPicker
            onChange={updateLocalState}
            state={state}
            rawErrors={rawErrors}
            accessToken={accessToken}
            isDisabled={isDisabled}
            required={required}
          />
        );
      default:
        return (
          <DefaultRepoBranchPicker
            onChange={updateLocalState}
            state={state}
            rawErrors={rawErrors}
            isDisabled={isDisabled}
            required={required}
          />
        );
    }
  };

  const description = uiSchema['ui:description'] ?? schema.description;

  if (scaffolderTheme === 'bui') {
    return (
      <Flex direction="column" gap="4">
        {schema.title && (
          <Text as="h5" variant="title-small" weight="bold">
            {schema.title}
          </Text>
        )}
        {description && <MarkdownContent content={description} />}
        {renderRepoBranchPicker()}
      </Flex>
    );
  }

  return (
    <>
      {schema.title && (
        <Box my={1}>
          <Typography variant="h5">{schema.title}</Typography>
          <Divider />
        </Box>
      )}
      {description && (
        <Typography variant="body1">
          <MarkdownContent content={description} />
        </Typography>
      )}
      {renderRepoBranchPicker()}
    </>
  );
};
