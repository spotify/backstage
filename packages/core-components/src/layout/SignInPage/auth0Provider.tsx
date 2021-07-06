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
import { Grid, Typography, Button } from '@material-ui/core';
import { InfoCard } from '../InfoCard/InfoCard';
import { ProviderComponent, ProviderLoader, SignInProvider } from './types';
import {
  useApi,
  auth0AuthApiRef,
  errorApiRef,
} from '@backstage/core-plugin-api';

const Component: ProviderComponent = ({ onResult }) => {
  const auth0AuthApi = useApi(auth0AuthApiRef);
  const errorApi = useApi(errorApiRef);

  const handleLogin = async () => {
    try {
      const identity = await auth0AuthApi.getBackstageIdentity({
        instantPopup: true,
      });

      const profile = await auth0AuthApi.getProfile();

      onResult({
        userId: identity!.id,
        profile: profile!,
        getIdToken: () =>
          auth0AuthApi.getBackstageIdentity().then(i => i!.idToken),
        signOut: async () => {
          await auth0AuthApi.signOut();
        },
      });
    } catch (error) {
      errorApi.post(error);
    }
  };

  return (
    <Grid item>
      <InfoCard
        title="Auth0"
        actions={
          <Button color="primary" variant="outlined" onClick={handleLogin}>
            Sign In
          </Button>
        }
      >
        <Typography variant="body1">Sign In using Auth0</Typography>
      </InfoCard>
    </Grid>
  );
};

const loader: ProviderLoader = async apis => {
  const auth0AuthApi = apis.get(auth0AuthApiRef)!;

  const identity = await auth0AuthApi.getBackstageIdentity({
    optional: true,
  });

  if (!identity) {
    return undefined;
  }

  const profile = await auth0AuthApi.getProfile();

  return {
    userId: identity.id,
    profile: profile!,
    getIdToken: () => auth0AuthApi.getBackstageIdentity().then(i => i!.idToken),
    signOut: async () => {
      await auth0AuthApi.signOut();
    },
  };
};

export const auth0Provider: SignInProvider = { Component, loader };
