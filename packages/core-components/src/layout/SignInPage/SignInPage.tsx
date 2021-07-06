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

import {
  configApiRef,
  SignInPageProps,
  useApi,
} from '@backstage/core-plugin-api';
import { Button, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Progress } from '../../components/Progress';
import { Content } from '../Content/Content';
import { ContentHeader } from '../ContentHeader/ContentHeader';
import { Header } from '../Header';
import { InfoCard } from '../InfoCard';
import { Page } from '../Page';
import { getSignInProviders, useSignInProviders } from './providers';
import { GridItem, useStyles } from './styles';
import { IdentityProviders, SignInProviderConfig } from './types';

type MultiSignInPageProps = SignInPageProps & {
  providers: IdentityProviders;
  title?: string;
  align?: 'center' | 'left';
};

type SingleSignInPageProps = SignInPageProps & {
  provider: SignInProviderConfig;
  auto?: boolean;
};

export type Props = MultiSignInPageProps | SingleSignInPageProps;

export const MultiSignInPage = ({
  onResult,
  providers = [],
  title,
  align = 'left',
}: MultiSignInPageProps) => {
  const configApi = useApi(configApiRef);
  const classes = useStyles();

  const signInProviders = getSignInProviders(providers);
  const [loading, providerElements] = useSignInProviders(
    signInProviders,
    onResult,
  );

  if (loading) {
    return <Progress />;
  }

  return (
    <Page themeId="home">
      <Header title={configApi.getString('app.title')} />
      <Content>
        {title && <ContentHeader title={title} textAlign={align} />}
        <Grid
          container
          justify={align === 'center' ? align : 'flex-start'}
          spacing={2}
          component="ul"
          classes={classes}
        >
          {providerElements}
        </Grid>
      </Content>
    </Page>
  );
};

export const SingleSignInPage = ({
  onResult,
  provider,
  auto,
}: SingleSignInPageProps) => {
  const classes = useStyles();
  const authApi = useApi(provider.apiRef);
  const configApi = useApi(configApiRef);

  const [autoShowPopup, setAutoShowPopup] = useState<boolean>(auto ?? false);
  // Defaults to true so that an initial check for existing user session is made
  const [retry, setRetry] = useState<{} | boolean | undefined>(undefined);
  const [error, setError] = useState<Error>();

  // The SignIn component takes some time to decide whether the user is logged-in or not.
  // showLoginPage is used to prevent a glitch-like experience where the sign-in page is
  // displayed for a split second when the user is already logged-in.
  const [showLoginPage, setShowLoginPage] = useState<boolean>(false);

  useEffect(() => {
    const login = async () => {
      try {
        let identity;
        // Do an initial check if any logged-in session exists
        identity = await authApi.getBackstageIdentity({
          optional: true,
        });

        // If no session exists, show the sign-in page
        if (!identity && autoShowPopup) {
          // Unless auto is set to true, this step should not happen.
          // When user intentionally clicks the Sign In button, autoShowPopup is set to true
          setShowLoginPage(true);
          identity = await authApi.getBackstageIdentity({
            instantPopup: true,
          });
        }

        if (!identity) {
          setShowLoginPage(true);
          return;
        }

        const profile = await authApi.getProfile();
        onResult({
          userId: identity!.id,
          profile: profile!,
          getIdToken: () => {
            return authApi.getBackstageIdentity().then(i => i!.idToken);
          },
          signOut: async () => {
            await authApi.signOut();
          },
        });
      } catch (err) {
        // User closed the sign-in modal
        setError(err);
        setShowLoginPage(true);
      }
    };

    login();
  }, [onResult, authApi, retry, autoShowPopup]);

  return showLoginPage ? (
    <Page themeId="home">
      <Header title={configApi.getString('app.title')} />
      <Content>
        <Grid
          container
          justify="center"
          spacing={2}
          component="ul"
          classes={classes}
        >
          <GridItem>
            <InfoCard
              variant="fullHeight"
              title={provider.title}
              actions={
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    setRetry({});
                    setAutoShowPopup(true);
                  }}
                >
                  Sign In
                </Button>
              }
            >
              <Typography variant="body1">{provider.message}</Typography>
              {error && error.name !== 'PopupRejectedError' && (
                <Typography variant="body1" color="error">
                  {error.message}
                </Typography>
              )}
            </InfoCard>
          </GridItem>
        </Grid>
      </Content>
    </Page>
  ) : (
    <Progress />
  );
};

export const SignInPage = (props: Props) => {
  if ('provider' in props) {
    return <SingleSignInPage {...props} />;
  }

  return <MultiSignInPage {...props} />;
};
