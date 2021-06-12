# Using AWS Application Load Balancer with Azure Active Directory to authenticate requests

Backstage allows offloading the responsibility of authenticating users to an AWS Application Load Balancer (**ALB**), leveraging the authentication support on ALB.
This tutorial shows how to use authentication on an ALB sitting in front of Backstage.
Azure Active Directory (**AAD**) is used as identity provider but any identity provider supporting OpenID Connect (OIDC) can be used.

It is assumed an ALB is already serving traffic in front of a Backstage instance configured to serve the frontend app from the backend.

## Infrastructure setup

## Backstage changes

### Frontend

The Backstage App needs a SignInPage when authentication is required.
When using ALB authentication Backstage will only be loaded once the user has successfully authenticated; we won't need to display a SignIn page, however we will need to create a dummy SignIn component that can refresh the token.

- edit `packages/app/src/App.tsx`
- import the following two additional definitions from `@backstage/core`: `useApi`, `configApiRef`; these will be used to check whether Backstage is running locally or behind an ALB
- add the following definition just before the app is created (`const app = createApp`):

```ts
const refreshToken = async ({ props, discoveryApiConfig, config }) => {
  const baseUrl = await discoveryApiConfig.getBaseUrl("auth");
  const shouldAuth = !!config.getOptionalConfig('auth.providers.gcp-iap');

  if (!shouldAuth) {
    props.onResult({
      userId: 'guest',
      profile: {
        email: 'guest@example.com',
        displayName: 'Guest',
        picture: '',
      },
    });
    return;
  }
  try {

    const request = await fetch(`${baseUrl}/gcp-iap/refresh`, {
      headers: {
        "x-requested-with": "XMLHttpRequest"
      },
      credentials: "include"
    });
    const data = await request.json()

    props.onResult({
      userId: data.backstageIdentity.id ?? "nouser@ms.at",
      profile: data.profile ?? "nouser@ms.at",
    });
  } catch (e) {
    props.onResult({
      userId: 'guest',
      profile: {
        email: 'guest@example.com',
        displayName: 'Guest',
        picture: '',
      },
    });
  }
};
const DummySignInComponent: any = (props: any) => {
  try {
    const config = useApi(configApiRef);
    const discoveryApiConfig = useApi(discoveryApiRef);
    refreshToken({ props, discoveryApiConfig, config })
    return <div />;
  } catch (err) {
    return <div>{err.message}</div>;
  }
};
```

### Backend

When using ALB auth it is not possible to leverage the built-in auth config discovery mechanism implemented in the app created by default; bespoke logic needs to be implemented.

- replace the content of `packages/backend/plugin/auth.ts` with the below

```ts
// imports are relative - as this was tested out in repo directly
import { createGcpIAPProvider } from './../providers/gcp-iap/provider';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {
  createRouter,
  AuthResponse,
  AuthProviderFactoryOptions,
} from '@backstage/plugin-auth-backend';

export default async function createPlugin({
  logger,
  database,
  config,
  discovery,
}: PluginEnvironment): Promise<Router> {
  const identityResolver = (payload: any): Promise<AuthResponse<any>> => {
    return Promise.resolve({
      providerInfo: {},
      profile: {
        email: payload.email,
        displayName: payload.name,
        picture: payload.picture,
      },
      backstageIdentity: {
        id: payload.email,
      },
    });
  };
  return await createRouter({
    logger, config, database, discovery, providerFactories: {
      "gcp-iap": (options: AuthProviderFactoryOptions) => {
        return createGcpIAPProvider({ ...options, identityResolver })({ ...options, identityResolver })
      }
    },
  });
}
```

### Configuration

Use the following `auth` configuration when running Backstage on AWS:

```yaml
auth:
  providers:
    gcp-iap:
      audience: "/projects/0123456/global/backendServices/1242345678765434567"
```


## Conclusion

Once it's deployed, after going through the AAD authentication flow, Backstage should display the AAD user details.

<!-- links -->

[monorepo-app-setup-with-auth-ms]: https://backstage.io/docs/auth/microsoft/provider
