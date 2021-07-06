---
id: configuring-plugin-databases
title: Configuring Plugin Databases
# prettier-ignore
description: Guide on how to configure Backstage databases.
---

This guide covers a variety of production persistence use cases which are
supported out of the box by Backstage. The database manager allows the developer
to set the client and database connection details on a per plugin basis in
addition to the base client and connection configuration. This means that you
can use a SQLite 3 in-memory database for a specific plugin whilst using
PostgreSQL for everything else and so on.

By default, Backstage uses automatically created databases for each plugin whose
names follow the `backstage_plugin_<pluginId>` pattern, e.g.
`backstage_plugin_auth`. You can configure a different database name prefix for
use cases where you have multiple deployments running on a shared database
instance or cluster.

With infrastructure defined as code or data (Terraform, AWS CloudFormation,
etc.), you may have database credentials which lack permissions to create new
databases or you do not have control over the database names. In these
instances, you can set the database name and connection information on a per
plugin basis as mentioned earlier.

Backstage supports all of these use cases with the `DatabaseManager` provided by
`@backstage/backend-common`. We will now cover how to use and configure
Backstage's databases.

## Prerequisites

### Dependencies

Please ensure the appropriate database drivers are installed in your `backend`
package. If you intend to use both `postgres` and `sqlite3`, you can install
both of them.

```sh
cd packages/backend

# install pg if you need postgres
yarn add pg

# install sqlite3 if you intend to set it as the client
yarn add sqlite3
```

From an operational perspective, you only need to install drivers for clients
that are actively used.

### Database Manager

Existing Backstage instances should be updated to use `DatabaseManager` from
`@backstage/backend-common` in your `packages/backend/src/index.ts` file, the
`SingleConnectionDatabaseManager` has been deprecated. Import the manager and
update the references as shown below if this is not the case:

```diff
import {
-  SingleConnectionDatabaseManager,
+  DatabaseManager,
} from '@backstage/backend-common';

// ...

function makeCreateEnv(config: Config) {
  // ...
-  const databaseManager = SingleConnectionDatabaseManager.fromConfig(config);
+  const databaseManager = DatabaseManager.fromConfig(config);
  // ...
}
```

## Configuration

You should set the base database client and connection information in your
`app-config.yaml` (or equivalent) file. The base client and configuration is
used as the default which is extended for each plugin with the same or unset
client type. If a client type is specified for a specific plugin which does not
match the base client, the configuration set for the plugin will be used as is
without extending the base configuration.

Client type and configuration for plugins need to be defined under
**`backend.database.plugin.<pluginId>`**. As an example, `catalog` is the
`pluginId` for the catalog plugin and any configuration defined under that block
is specific to that plugin. We will now explore more detailed example
configurations below.

### Minimal In-Memory Configuration

In the example below, we are using `sqlite3` in-memory databases for all
plugins. You may want to use this configuration for testing or other non-durable
use cases.

```yaml
backend:
  database:
    client: sqlite3
    connection: ':memory:'
```

### PostgreSQL

The example below uses PostgreSQL (`pg`) as the database client for all plugins.
The `auth` plugin uses a user defined database name instead of the automatically
generated one which would have been `backstage_plugin_auth`.

```yaml
backend:
  database:
    client: pg
    connection:
      host: some.example-pg-instance.tld
      user: postgres
      password: password
      port: 5432
    plugin:
      auth:
        connection:
          database: pg_auth_set_by_user
```

### Custom Database Name Prefix

The configuration below uses `example_prefix_` as the database name prefix
instead of `backstage_plugin_`. Plugins such as `auth` and `catalog` will use
databases named `example_prefix_auth` and `example_prefix_catalog` respectively.

```yaml
backend:
  database:
    client: pg
    connection:
      host: some.example-pg-instance.tld
      user: postgres
      password: password
      port: 5432
    prefix: 'example_prefix_'
```

### Connection Configuration Per Plugin

Both `auth` and `catalog` use connection configuration with different
credentials and database names. This type of configuration can be useful for
environments with infrastructure as code or data which may provide randomly
generated credentials and/or database names.

```yaml
backend:
  database:
    client: pg
    connection: 'postgresql://some.example-pg-instance.tld:5432'
    plugin:
      auth:
        connection: 'postgresql://fort:knox@some.example-pg-instance.tld:5432/unwitting_fox_jumps'
      catalog:
        connection: 'postgresql://bank:reserve@some.example-pg-instance.tld:5432/shuffle_ransack_playback'
```

### PostgreSQL and SQLite 3

The example below uses PostgreSQL (`pg`) as the database client for all plugins
except the `auth` plugin which uses `sqlite3`. As the `auth` plugin's client
type is different from the base client type, the connection configuration for
`auth` is used verbatim without extending the base configuration for PostgreSQL.

```yaml
backend:
  database:
    client: pg
    connection: 'postgresql://foo:bar@some.example-pg-instance.tld:5432'
    plugin:
      auth:
        client: sqlite3
        connection: ':memory:'
```

## Check Your Databases

The `DatabaseManager` will attempt to create the databases if they do not exist.
If you have set credentials per plugin because the credentials in the base
configuration do not have permissions to create databases, you must ensure they
exist before starting the service. The service will not be able to create them,
it can only use them.

### Privileges

As Backstage attempts to check if the database exists, you may need to grant
privileges to list or show databases for a given user. For PostgreSQL, you would
grant the following:

```postgres
GRANT SELECT ON pg_database TO some_user;
```

MySQL:

```mysql
GRANT SHOW DATABASES ON *.* TO some_user;
```

The mechanisms in this guide should help you tackle different database
deployment situations. Good luck!
