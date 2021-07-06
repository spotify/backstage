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
import React, { useCallback, useEffect } from 'react';
import { FieldProps } from '@rjsf/core';
import { scaffolderApiRef } from '../../../api';
import { useAsync } from 'react-use';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import { useApi } from '@backstage/core-plugin-api';
import { Progress } from '@backstage/core-components';

function splitFormData(url: string | undefined) {
  let host = undefined;
  let owner = undefined;
  let repo = undefined;
  let organization = undefined;

  try {
    if (url) {
      const parsed = new URL(`https://${url}`);
      host = parsed.host;
      owner = parsed.searchParams.get('owner') || undefined;
      repo = parsed.searchParams.get('repo') || undefined;
      // This is azure dev ops specific. not used for any other provider.
      organization = parsed.searchParams.get('organization') || undefined;
    }
  } catch {
    /* ok */
  }

  return { host, owner, repo, organization };
}

function serializeFormData(data: {
  host?: string;
  owner?: string;
  repo?: string;
  organization?: string;
}) {
  if (!data.host) {
    return undefined;
  }
  const params = new URLSearchParams();
  if (data.owner) {
    params.set('owner', data.owner);
  }
  if (data.repo) {
    params.set('repo', data.repo);
  }
  if (data.organization) {
    params.set('organization', data.organization);
  }

  return `${data.host}?${params.toString()}`;
}

export const RepoUrlPicker = ({
  onChange,
  uiSchema,
  rawErrors,
  formData,
}: FieldProps<string>) => {
  const api = useApi(scaffolderApiRef);
  const allowedHosts = uiSchema['ui:options']?.allowedHosts as string[];

  const { value: integrations, loading } = useAsync(async () => {
    return await api.getIntegrationsList({ allowedHosts });
  });

  const { host, owner, repo, organization } = splitFormData(formData);
  const updateHost = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      onChange(
        serializeFormData({
          host: evt.target.value as string,
          owner,
          repo,
          organization,
        }),
      ),
    [onChange, owner, repo, organization],
  );

  const updateOwner = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      onChange(
        serializeFormData({
          host,
          owner: evt.target.value as string,
          repo,
          organization,
        }),
      ),
    [onChange, host, repo, organization],
  );

  const updateRepo = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      onChange(
        serializeFormData({
          host,
          owner,
          repo: evt.target.value as string,
          organization,
        }),
      ),
    [onChange, host, owner, organization],
  );

  const updateOrganization = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      onChange(
        serializeFormData({
          host,
          owner,
          repo,
          organization: evt.target.value as string,
        }),
      ),
    [onChange, host, owner, repo],
  );

  useEffect(() => {
    if (host === undefined && integrations?.length) {
      onChange(
        serializeFormData({
          host: integrations[0].host,
          owner,
          repo,
          organization,
        }),
      );
    }
  }, [onChange, integrations, host, owner, repo, organization]);

  if (loading) {
    return <Progress />;
  }

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !host}
      >
        <InputLabel htmlFor="hostInput">Host</InputLabel>
        <Select native id="hostInput" onChange={updateHost} value={host}>
          {integrations ? (
            integrations
              .filter(i => allowedHosts?.includes(i.host))
              .map(i => (
                <option key={i.host} value={i.host}>
                  {i.title}
                </option>
              ))
          ) : (
            <p>loading</p>
          )}
        </Select>
        <FormHelperText>
          The host where the repository will be created
        </FormHelperText>
      </FormControl>
      {host === 'dev.azure.com' && (
        <FormControl
          margin="normal"
          required
          error={rawErrors?.length > 0 && !organization}
        >
          <InputLabel htmlFor="repoInput">Organization</InputLabel>
          <Input
            id="repoInput"
            onChange={updateOrganization}
            value={organization}
          />
          <FormHelperText>The name of the organization</FormHelperText>
        </FormControl>
      )}
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !owner}
      >
        <InputLabel htmlFor="ownerInput">Owner</InputLabel>
        <Input id="ownerInput" onChange={updateOwner} value={owner} />
        <FormHelperText>
          The organization, user or project that this repo will belong to
        </FormHelperText>
      </FormControl>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !repo}
      >
        <InputLabel htmlFor="repoInput">Repository</InputLabel>
        <Input id="repoInput" onChange={updateRepo} value={repo} />
        <FormHelperText>The name of the repository</FormHelperText>
      </FormControl>
    </>
  );
};
