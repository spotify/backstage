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

import { Button, Grid, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import {
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  InfoCard,
  Page,
  SimpleStepper,
  SimpleStepperStep,
  StructuredMetadataTable,
  SupportButton,
} from '@backstage/core-components';

export const Project = () => {
  const [projectName, setProjectName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [disabled, setDisabled] = useState(true);

  const metadata = {
    ProjectName: projectName,
    ProjectId: projectId,
  };

  return (
    <Content>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InfoCard title="Create new GCP Project">
            <SimpleStepper>
              <SimpleStepperStep title="Project Name">
                <TextField
                  variant="outlined"
                  name="projectName"
                  label="Project Name"
                  helperText="The name of the new project."
                  inputProps={{ 'aria-label': 'Project Name' }}
                  onChange={e => setProjectName(e.target.value)}
                  value={projectName}
                  fullWidth
                />
              </SimpleStepperStep>
              <SimpleStepperStep title="Project ID">
                <TextField
                  variant="outlined"
                  name="projectId"
                  label="projectId"
                  onChange={e => setProjectId(e.target.value)}
                  value={projectId}
                  fullWidth
                />
              </SimpleStepperStep>

              <SimpleStepperStep
                title="Review"
                actions={{
                  nextText: 'Confirm',
                  onNext: () => setDisabled(false),
                }}
              >
                <StructuredMetadataTable metadata={metadata} />
              </SimpleStepperStep>
            </SimpleStepper>
            <Button
              variant="text"
              data-testid="cancel-button"
              color="primary"
              href="/gcp-projects"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={disabled}
              href={`newProject?projectName=${encodeURIComponent(
                projectName,
              )},projectId=${encodeURIComponent(projectId)}`}
            >
              Create
            </Button>
          </InfoCard>
        </Grid>
      </Grid>
    </Content>
  );
};

const labels = (
  <>
    <HeaderLabel label="Owner" value="Spotify" />
    <HeaderLabel label="Lifecycle" value="Production" />
  </>
);

export const NewProjectPage = () => (
  <Page themeId="service">
    <Header title="New GCP Project" type="tool">
      {labels}
    </Header>
    <Content>
      <ContentHeader title="">
        <SupportButton>
          This plugin allows you to view and interact with your gcp projects.
        </SupportButton>
      </ContentHeader>
      <Project />
    </Content>
  </Page>
);
