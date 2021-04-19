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
import { Field } from '@rjsf/core';
import { useApi, Progress } from '@backstage/core';
import { scaffolderApiRef } from '../../../api';
import { useAsync } from 'react-use';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { BitbucketIntegration } from '@backstage/integration';

function splitFormData(url: string | undefined) {
  let host = undefined;
  let workspace = undefined;
  let project = undefined;
  let repo = undefined;

  try {
    if (url) {
      const parsed = new URL(`https://${url}`);
      host = parsed.host;
      workspace = parsed.searchParams.get('workspace') || undefined;
      project = parsed.searchParams.get('project') || undefined;
      repo = parsed.searchParams.get('repo') || undefined;
    }
  } catch {
    /* ok */
  }

  return { host, workspace, project, repo };
}

function serializeFormData(data: {
  host?: string;
  workspace?: string;
  project?: string;
  repo?: string;
}) {
  if (!data.host) {
    return undefined;
  }
  const params = new URLSearchParams();
  if (data.workspace) {
    params.set('workspace', data.workspace);
  }
  if (data.project) {
    params.set('project', data.project);
  }
  if (data.repo) {
    params.set('repo', data.repo);
  }

  return `${data.host}?${params.toString()}`;
}

export const RepoUrlPickerBitbucketCloud: Field = ({
  onChange,
  rawErrors,
  formData,
}) => {

  const api = useApi(scaffolderApiRef);
  const allowedHosts: string[] = ['bitbucket.org'];

  const { value: integrations, loading: loadingIntegrations } = useAsync(async () => {
    return await api.getIntegrationsList({ allowedHosts });
  });

  const { value: data, loading: loadingData } = useAsync(async () => {
    const bitbucketIntegrations: BitbucketIntegration[] =  await api.getIntegration({ type: 'bitbucket' }) as BitbucketIntegration[];
    const bitbucketIntegration = bitbucketIntegrations.filter(element => element.config.host === 'bitbucket.org')[0];
    const workspaces = bitbucketIntegration.config.workspaces;
    const projects = workspaces?.[0]?.projects;

    return { workspaces, projects };
  });

  const { host, workspace, project, repo } = splitFormData(formData);
  const updateHost = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      onChange(
        serializeFormData({
          host: evt.target.value as string,
          workspace,
          project,
          repo,
        }),
      ),
    [onChange, workspace, project, repo],
  );

  const updateWorkspace = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      if (data) {
        data.projects = data?.workspaces?.find(w => w.name === evt.target.value)?.projects;
      }
      onChange(
        serializeFormData({
          host,
          workspace: evt.target.value as string,
          project,
          repo,
        }),
      );
    },
    [onChange, data, host, project, repo],
  );

  const updateProject = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      onChange(
        serializeFormData({
          host,
          workspace,
          project: evt.target.value as string,
          repo,
        }),
      );
    },
    [onChange, host, workspace, repo],
  );

  const updateRepo = useCallback(
    (evt: React.ChangeEvent<{ name?: string; value: unknown }>) =>
      onChange(
        serializeFormData({
          host,
          workspace,
          project,
          repo: evt.target.value as string,
        }),
      ),
    [onChange, host, workspace, project],
  );

  useEffect(() => {
    onChange(
      serializeFormData({
        host: (host === undefined ? (integrations?.[0]?.host) : undefined),
        workspace: workspace === undefined ? (data?.workspaces?.[0]?.name) : undefined,
        project: project === undefined ? (data?.workspaces?.[0]?.projects?.[0]?.key) : undefined,
        repo,
      }),
    );
  }, [onChange, integrations, data, host, workspace, project, repo]);

  if (loadingIntegrations || loadingData) {
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
        <FormControl
          margin="normal"
          required
          error={rawErrors?.length > 0 && !workspace}
        >
          <InputLabel htmlFor="workspaceInput">Workspace</InputLabel>
          <Select native id="workspaceInput" onChange={updateWorkspace} value={workspace}>
          {data?.workspaces? (
              data.workspaces.map((w, index) => (
                <option key={index} value={w.name}>{w.description?w.description:w.name}</option>
              ))
            ) : (
              <p>loading</p>
            )}
          </Select>
          <FormHelperText>
            The workspace where the repository will be created
          </FormHelperText>
        </FormControl>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !project}
        >
          <InputLabel htmlFor="projectInput">Project</InputLabel>
          <Select native id="projectInput" onChange={updateProject} value={project}>
          {data?.projects ? (
              data.projects.map((p, index) => (
                <option key={index} value={p.key}>{p.description?p.description:p.name}</option>
              ))
          ) : (
            <p>loading</p>
          )}
          </Select>
          <FormHelperText>The bitbucket project this repo should be added to</FormHelperText>
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
