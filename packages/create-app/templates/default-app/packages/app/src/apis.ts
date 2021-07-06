import {
  ScmIntegrationsApi, scmIntegrationsApiRef
} from '@backstage/integration-react';
import { AnyApiFactory, configApiRef, createApiFactory } from '@backstage/core-plugin-api';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
];
