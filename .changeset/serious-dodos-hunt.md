---
'@backstage/plugin-auth-backend': minor
'@backstage/plugin-catalog-backend': patch
---

Allow adopters to issue auth tokens to enable search

This change breaks how IdentityClient is instantiated. Adopters already using IdentityClient needs to modify their code from

```
  const discovery = SingleHostDiscovery.fromConfig(config);
  const identity = new IdentityClient({
    discovery,
    issuer: await discovery.getExternalBaseUrl('auth'),
  });
```

to

```
  const identity = await IdentityClient.create(authEnv);
```

See https://github.com/backstage/backstage/blob/master/contrib/docs/tutorials/authenticate-api-requests.md for full instructions.
