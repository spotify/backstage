### Source repo: https://github.com/johnson-jesse/simple-backstage-app-plugin

ExampleComponent.tsx reference

```tsx
import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { ExampleFetchComponent } from '../ExampleFetchComponent';

export const ExampleComponent = () => {
  const identityApi = useApi(identityApiRef);
  const userId = identityApi.getUserId();
  const profile = identityApi.getProfile();

  return (
    <Page themeId="tool">
      <Header
        title="Welcome to github-playground!"
        subtitle="Optional subtitle"
      >
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Plugin title">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title={userId}>
              <Typography variant="body1">
                {`${profile.displayName} | ${profile.email}`}
              </Typography>
            </InfoCard>
          </Grid>
          <Grid item>
            <ExampleFetchComponent />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
```
