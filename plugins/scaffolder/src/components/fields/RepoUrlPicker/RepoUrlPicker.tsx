/*
 * Copyright 2021 Spotify AB
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
import { useApi, Progress } from '@backstage/core';
import { scaffolderApiRef } from '../../../api';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { useAsync } from 'react-use';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

function splitFormData(url: string | undefined) {
  let host = undefined;
  let owner = undefined;
  let repo = undefined;
  let organization = undefined;
  let workspace = undefined;
  let project = undefined;

  try {
    if (url) {
      const parsed = new URL(`https://${url}`);
      host = parsed.host;
      owner = parsed.searchParams.get('owner') || undefined;
      repo = parsed.searchParams.get('repo') || undefined;
      // This is azure dev ops specific. not used for any other provider.
      organization = parsed.searchParams.get('organization') || undefined;
      // These are bitbucket specific, not used for any other provider.
      workspace = parsed.searchParams.get('workspace') || undefined;
      project = parsed.searchParams.get('project') || undefined;
    }
  } catch {
    /* ok */
  }

  return { host, owner, repo, organization, workspace, project };
}

function serializeFormData(data: {
  host?: string;
  owner?: string;
  repo?: string;
  organization?: string;
  workspace?: string;
  project?: string;
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
  if (data.workspace) {
    params.set('workspace', data.workspace);
  }
  if (data.project) {
    params.set('project', data.project);
  }

  return `${data.host}?${params.toString()}`;
}

export const RepoUrlPicker = ({
  onChange,
  uiSchema,
  rawErrors,
  formData,
}: FieldProps<string>) => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const integrationApi = useApi(scmIntegrationsApiRef);
  const allowedHosts = uiSchema['ui:options']?.allowedHosts as string[];

  const { value: integrations, loading } = useAsync(async () => {
    return await scaffolderApi.getIntegrationsList({ allowedHosts });
  });

  const { host, owner, repo, organization, workspace, project } = splitFormData(
    formData,
  );
  const updateHost = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      onChange(
        serializeFormData({
          host: evt.target.value as string,
          owner,
          repo,
          organization,
          workspace,
          project,
        }),
      );
    },
    [onChange, owner, repo, organization, workspace, project],
  );

  const updateOwner = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      onChange(
        serializeFormData({
          host,
          owner: evt.target.value as string,
          repo,
          organization,
          workspace,
          project,
        }),
      ),
    [onChange, host, repo, organization, workspace, project],
  );

  const updateRepo = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      onChange(
        serializeFormData({
          host,
          owner,
          repo: evt.target.value as string,
          organization,
          workspace,
          project,
        }),
      ),
    [onChange, host, owner, organization, workspace, project],
  );

  const updateOrganization = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      onChange(
        serializeFormData({
          host,
          owner,
          repo,
          organization: evt.target.value as string,
          workspace,
          project,
        }),
      ),
    [onChange, host, owner, repo, workspace, project],
  );

  const updateWorkspace = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      onChange(
        serializeFormData({
          host,
          owner,
          repo,
          organization,
          workspace: evt.target.value as string,
          project,
        }),
      ),
    [onChange, host, owner, repo, organization, project],
  );

  const updateProject = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      onChange(
        serializeFormData({
          host,
          owner,
          repo,
          organization,
          workspace,
          project: evt.target.value as string,
        }),
      ),
    [onChange, host, owner, repo, organization, workspace],
  );

  useEffect(() => {
    if (host === undefined && integrations?.length) {
      onChange(
        serializeFormData({
          host: integrations[0].host,
          owner,
          repo,
          organization,
          workspace,
          project,
        }),
      );
    }
  }, [
    onChange,
    integrations,
    host,
    owner,
    repo,
    organization,
    workspace,
    project,
  ]);

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
      {/* Show this for dev.azure.com only */}
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
      {host && integrationApi.byHost(host)?.type === 'bitbucket' && (
        <>
          {/* Show this for bitbucket.org only */}
          {host === 'bitbucket.org' && (
            <FormControl
              margin="normal"
              required
              error={rawErrors?.length > 0 && !workspace}
            >
              <InputLabel htmlFor="wokrspaceInput">Workspace</InputLabel>
              <Input
                id="wokrspaceInput"
                onChange={updateWorkspace}
                value={workspace}
              />
              <FormHelperText>
                The workspace where the repository will be created
              </FormHelperText>
            </FormControl>
          )}
          <FormControl
            margin="normal"
            required
            error={rawErrors?.length > 0 && !project}
          >
            <InputLabel htmlFor="wokrspaceInput">Project</InputLabel>
            <Input
              id="wokrspaceInput"
              onChange={updateProject}
              value={project}
            />
            <FormHelperText>
              The project where the repository will be created
            </FormHelperText>
          </FormControl>
        </>
      )}
      {/* Show this for all hosts except bitbucket */}
      {host && integrationApi.byHost(host)?.type !== 'bitbucket' && (
        <>
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
        </>
      )}
      {/* Show this for all hosts */}
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
