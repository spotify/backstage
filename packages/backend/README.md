# example-backend

This package is an EXAMPLE of a Backstage backend.

The main purpose of this package is to provide a test bed for Backstage plugins
that have a backend part. Feel free to experiment locally or within your fork
by adding dependencies and routes to this backend, to try things out.

By running the `@backstage/create-app` script, you get your own separate Backstage backend.

## Development

To run the example backend, first go to the project root and run

```bash
yarn install
yarn tsc
yarn build
```

You should only need to do this once.

After that, go to the `packages/backend` directory and run

```bash
AUTH_GOOGLE_CLIENT_ID=x AUTH_GOOGLE_CLIENT_SECRET=x \
AUTH_GITHUB_CLIENT_ID=x AUTH_GITHUB_CLIENT_SECRET=x \
AUTH_OAUTH2_CLIENT_ID=x AUTH_OAUTH2_CLIENT_SECRET=x \
AUTH_OAUTH2_AUTH_URL=x AUTH_OAUTH2_TOKEN_URL=x \
ROLLBAR_ACCOUNT_TOKEN=x \
SENTRY_TOKEN=x \
LOG_LEVEL=debug \
yarn start
```

Substitute `x` for actual values, or leave them as
dummy values just to try out the backend without using the auth or sentry features.
You can also, instead of using dummy values for a huge number of environment variables, remove those config directly from app-config.yaml file located in the root folder.

The backend starts up on port 7000 per default.

## Populating The Catalog

If you want to use the catalog functionality, you need to add so called
locations to the backend. These are places where the backend can find some
entity descriptor data to consume and serve. For more information, see
[Software Catalog Overview - Adding Components to the Catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview#adding-components-to-the-catalog).

For convenience we already include some statically configured example locations
in `app-config.yaml` under `catalog.locations`. For local development you can override these in your own `app-config.local.yaml`.

## Authentication

We chose [Passport](http://www.passportjs.org/) as authentication platform due to its comprehensive set of supported authentication [strategies](http://www.passportjs.org/packages/).

Read more about the [auth-backend](https://github.com/backstage/backstage/blob/master/plugins/auth-backend/README.md) and [how to add a new provider](https://github.com/backstage/backstage/blob/master/docs/auth/add-auth-provider.md)

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://github.com/backstage/backstage/blob/master/docs/README.md)
