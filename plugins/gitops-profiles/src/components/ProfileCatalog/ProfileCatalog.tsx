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

import React, { useEffect, useState } from 'react';
import { TextField, List, ListItem, Link } from '@material-ui/core';

import ClusterTemplateCardList from '../ClusterTemplateCardList';
import ProfileCardList from '../ProfileCardList';
import { useLocalStorage } from 'react-use';
import { gitOpsApiRef, Status } from '../../api';

import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  SimpleStepper,
  SimpleStepperStep,
  InfoCard,
  Progress,
  Table,
  StatusWarning,
  StatusOK,
  StatusRunning,
  StatusError,
  StatusPending,
  StatusAborted,
} from '@backstage/core-components';

import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';

// OK = (completed, success)
// Error = (?,failure)
// Aborted = (?,cancelled)
// Error = (?,timed_out)
// Warning = (?, skipped)
// Running = (queued, ?)
// Running = (in_progress,?)
export const transformStatus = (value: Status): JSX.Element => {
  let status: JSX.Element = <StatusRunning>Unknown</StatusRunning>;
  if (value.status === 'completed' && value.conclusion === 'success') {
    status = <StatusOK>Success</StatusOK>;
  } else if (value.conclusion === 'failure') {
    status = <StatusError>Failure</StatusError>;
  } else if (value.conclusion === 'cancelled') {
    status = <StatusAborted>Cancelled</StatusAborted>;
  } else if (value.conclusion === 'timed_out') {
    status = <StatusError>Timed out</StatusError>;
  } else if (value.conclusion === 'skipped') {
    status = <StatusWarning>Skipped</StatusWarning>;
  } else if (value.status === 'queued') {
    status = <StatusPending>Queued</StatusPending>;
  } else if (value.status === 'in_progress') {
    status = <StatusRunning>In Progress</StatusRunning>;
  }
  return status;
};

export const transformRunStatus = (x: Status[]) => {
  return x.map(value => {
    return {
      status: transformStatus(value),
      message: value.message,
    };
  });
};

const ProfileCatalog = () => {
  // TODO: get data from REST API
  const [clusterTemplates] = React.useState([
    {
      platformName: '15m',
      title: 'EKS 2 workers',
      repository: 'chanwit/eks-cluster-template',
      description: 'EKS with Kubernetes 1.16 / 2 nodes of m5.xlarge (15 mins)',
    },
    {
      platformName: '15m',
      title: 'EKS 1 worker',
      repository: 'chanwit/template-2',
      description: 'EKS with Kubernetes 1.16 / 1 node of m5.xlarge (15 mins)',
    },
  ]);

  const [profileTemplates] = React.useState([
    {
      shortName: 'ml',
      title: 'MLOps',
      repository: 'https://github.com/weaveworks/mlops-profile',
      description: 'Kubeflow-based Machine Learning pipeline',
    },
    {
      shortName: 'ai',
      title: 'COVID ML',
      repository: 'https://github.com/weaveworks/covid-ml-profile',
      description: 'Fk-covid Application profile',
    },
  ]);

  const [templateRepo] = useLocalStorage<string>('gitops-template-repo');
  const [gitopsProfiles] = useLocalStorage<string[]>('gitops-profiles');

  const [showProgress, setShowProgress] = useState(false);
  const [pollingLog, setPollingLog] = useState(false);
  const [gitHubOrg, setGitHubOrg] = useState(String);
  const [gitHubRepo, setGitHubRepo] = useState('new-cluster');
  const [awsAccessKeyId, setAwsAccessKeyId] = useState(String);
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState(String);
  const [runStatus, setRunStatus] = useState<Status[]>([]);
  const [runLink, setRunLink] = useState<string>('');

  const api = useApi(gitOpsApiRef);
  const githubAuth = useApi(githubAuthApiRef);
  const [githubAccessToken, setGithubAccessToken] = useState(String);
  const [githubUsername, setGithubUsername] = useState(String);

  useEffect(() => {
    const fetchGithubUserInfo = async () => {
      const accessToken = await githubAuth.getAccessToken(['repo', 'user']);
      const userInfo = await api.fetchUserInfo({ accessToken });
      setGithubAccessToken(accessToken);
      setGithubUsername(userInfo.login);
      setGitHubOrg(userInfo.login);
    };

    if (!githubAccessToken || !githubUsername) {
      fetchGithubUserInfo();
    } else {
      if (pollingLog) {
        const interval = setInterval(async () => {
          const resp = await api.fetchLog({
            gitHubToken: githubAccessToken,
            gitHubUser: githubUsername,
            targetOrg: gitHubOrg,
            targetRepo: gitHubRepo,
          });

          setRunStatus(resp.result);
          setRunLink(resp.link);
          if (resp.status === 'completed') {
            setPollingLog(false);
            setShowProgress(false);
          }
        }, 10000);
        return () => clearInterval(interval);
      }
    }

    return () => {};
  }, [
    pollingLog,
    api,
    gitHubOrg,
    gitHubRepo,
    githubAuth,
    githubAccessToken,
    githubUsername,
  ]);

  const showFailureMessage = (msg: string) => {
    setRunStatus(
      runStatus.concat([
        {
          status: 'completed',
          message: msg,
          conclusion: 'failure',
        },
      ]),
    );
  };

  const showSuccessMessage = (msg: string) => {
    setRunStatus(
      runStatus.concat([
        {
          status: 'completed',
          message: msg,
          conclusion: 'success',
        },
      ]),
    );
  };

  const doCreateCluster = async () => {
    setShowProgress(true);
    setRunStatus([]);

    const cloneResponse = await api.cloneClusterFromTemplate({
      templateRepository: templateRepo!,
      gitHubToken: githubAccessToken,
      gitHubUser: githubUsername,
      targetOrg: gitHubOrg,
      targetRepo: gitHubRepo,
      secrets: {
        awsAccessKeyId: awsAccessKeyId,
        awsSecretAccessKey: awsSecretAccessKey,
      },
    });

    if (cloneResponse.error === undefined) {
      showSuccessMessage('Forked new cluster repo');
    } else {
      setShowProgress(false);
      showFailureMessage(cloneResponse.error);
    }

    const applyProfileResp = await api.applyProfiles({
      gitHubToken: githubAccessToken,
      gitHubUser: githubUsername,
      targetOrg: gitHubOrg,
      targetRepo: gitHubRepo,
      profiles: gitopsProfiles!,
    });

    if (applyProfileResp.error === undefined) {
      showSuccessMessage('Applied profiles to the repo');
    } else {
      setShowProgress(false);
      showFailureMessage(applyProfileResp.error);
    }

    const clusterStateResp = await api.changeClusterState({
      gitHubToken: githubAccessToken,
      gitHubUser: githubUsername,
      targetOrg: gitHubOrg,
      targetRepo: gitHubRepo,
      clusterState: 'present',
    });

    if (clusterStateResp.error === undefined) {
      // cluster creation start, so start pulling log
      setPollingLog(true);
      showSuccessMessage('Changed desired cluster state to present');
    } else {
      setPollingLog(false);
      setShowProgress(false);
      showFailureMessage(clusterStateResp.error);
    }
  };

  const columns = [
    { field: 'status', title: 'Status' },
    { field: 'message', title: 'Message' },
  ];

  return (
    <Page themeId="tool">
      <Header
        title="Create GitOps-managed Cluster"
        subtitle="Kubernetes cluster with ready-to-use profiles"
      >
        <HeaderLabel label="Welcome" value={githubUsername} />
      </Header>
      <Content>
        <ContentHeader title="Create Cluster">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <SimpleStepper>
          <SimpleStepperStep title="Choose Cluster Template">
            <ClusterTemplateCardList template={clusterTemplates} />
          </SimpleStepperStep>
          <SimpleStepperStep title="Select GitOps Profile">
            <ProfileCardList profileTemplates={profileTemplates} />
          </SimpleStepperStep>
          <SimpleStepperStep
            title="Create Cluster"
            actions={{ nextText: 'Create', onNext: () => doCreateCluster() }}
          >
            <InfoCard>
              <List>
                <ListItem>
                  <TextField
                    name="github-org-tf"
                    label="GitHub Organization"
                    defaultValue={gitHubOrg}
                    required
                    onChange={e => {
                      setGitHubOrg(e.target.value);
                    }}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    name="github-repo-tf"
                    label="New Repository"
                    defaultValue={gitHubRepo}
                    required
                    onChange={e => {
                      setGitHubRepo(e.target.value);
                    }}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    name="aws-access-key-id-tf"
                    label="Access Key ID"
                    required
                    type="password"
                    onChange={e => {
                      setAwsAccessKeyId(e.target.value);
                    }}
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    name="aws-secret-access-key-tf"
                    label="Secret Access Key"
                    required
                    type="password"
                    onChange={e => {
                      setAwsSecretAccessKey(e.target.value);
                    }}
                  />
                </ListItem>
              </List>
            </InfoCard>
          </SimpleStepperStep>
        </SimpleStepper>
        <div>
          <Progress hidden={!showProgress} />
          <Table
            options={{ search: false, paging: false, toolbar: false }}
            data={transformRunStatus(runStatus)}
            columns={columns}
          />
          <Link
            hidden={runLink === ''}
            rel="noopener noreferrer"
            href={`${runLink}?check_suite_focus=true`}
            target="_blank"
          >
            Details
          </Link>
        </div>
      </Content>
    </Page>
  );
};

export default ProfileCatalog;
