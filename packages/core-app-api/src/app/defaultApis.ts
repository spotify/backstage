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
  AlertApiForwarder,
  ErrorApiForwarder,
  ErrorAlerter,
  GoogleAuth,
  GithubAuth,
  OAuth2,
  OktaAuth,
  GitlabAuth,
  Auth0Auth,
  MicrosoftAuth,
  OAuthRequestManager,
  WebStorage,
  UrlPatternDiscovery,
  SamlAuth,
  OneLoginAuth,
  UnhandledErrorForwarder,
} from '../apis';

import {
  createApiFactory,
  alertApiRef,
  errorApiRef,
  discoveryApiRef,
  oauthRequestApiRef,
  googleAuthApiRef,
  githubAuthApiRef,
  oauth2ApiRef,
  oktaAuthApiRef,
  gitlabAuthApiRef,
  auth0AuthApiRef,
  microsoftAuthApiRef,
  storageApiRef,
  configApiRef,
  samlAuthApiRef,
  oneloginAuthApiRef,
  oidcAuthApiRef,
} from '@backstage/core-plugin-api';

import OAuth2Icon from '@material-ui/icons/AcUnit';

export const defaultApis = [
  createApiFactory({
    api: discoveryApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) =>
      UrlPatternDiscovery.compile(
        `${configApi.getString('backend.baseUrl')}/api/{{ pluginId }}`,
      ),
  }),
  createApiFactory(alertApiRef, new AlertApiForwarder()),
  createApiFactory({
    api: errorApiRef,
    deps: { alertApi: alertApiRef },
    factory: ({ alertApi }) => {
      const errorApi = new ErrorAlerter(alertApi, new ErrorApiForwarder());
      UnhandledErrorForwarder.forward(errorApi, { hidden: false });
      return errorApi;
    },
  }),
  createApiFactory({
    api: storageApiRef,
    deps: { errorApi: errorApiRef },
    factory: ({ errorApi }) => WebStorage.create({ errorApi }),
  }),
  createApiFactory(oauthRequestApiRef, new OAuthRequestManager()),
  createApiFactory({
    api: googleAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      GoogleAuth.create({
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: microsoftAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      MicrosoftAuth.create({
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: githubAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      GithubAuth.create({
        discoveryApi,
        oauthRequestApi,
        defaultScopes: ['read:user'],
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: oktaAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      OktaAuth.create({
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: gitlabAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      GitlabAuth.create({
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: auth0AuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      Auth0Auth.create({
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: oauth2ApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      OAuth2.create({
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: samlAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, configApi }) =>
      SamlAuth.create({
        discoveryApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: oneloginAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      OneLoginAuth.create({
        discoveryApi,
        oauthRequestApi,
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
  createApiFactory({
    api: oidcAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      OAuth2.create({
        discoveryApi,
        oauthRequestApi,
        provider: {
          id: 'oidc',
          title: 'Your Identity Provider',
          icon: OAuth2Icon,
        },
        environment: configApi.getOptionalString('auth.environment'),
      }),
  }),
];
