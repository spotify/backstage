---
id: external-integrations
title: External integrations
# prettier-ignore
description: Documentation on External integrations to integrate systems with Backstage
---

Backstage natively supports importing catalog data through the use of
[entity descriptor YAML files](descriptor-format.md). However, companies that
already have an existing system for keeping track of software and its owners can
leverage those systems by integrating them with Backstage. This article shows
the most common way of doing that integration: by adding a custom catalog
_processor_.

## Background

The catalog has a frontend plugin part, that communicates via a service API to
the backend plugin part. The backend has a processing loop that repeatedly
ingests data from the sources you specify, to store them in its database.

As a Backstage adopter, you would be able to customize or extend the catalog in
several ways - by replacing the entire backend API, or by replacing entire
implementation classes at certain points in the backend, or by leveraging the
ingestion process to fetch data from your own authoritative source. Each method
has benefits and drawbacks, but this article will focus on the last one of the
above. It is the one that is the most straight forward and future proof, and
leverages a lot of benefits that come with the builtin catalog.

## Processors and the Ingestion Loop

The catalog holds a number of registered locations, that were added either by
site admins or by individual Backstage users. Their purpose is to reference some
sort of data that the catalog shall keep itself up to date with. Each location
has a `type`, and a `target` that are both strings.

```yaml
# Example location
type: url
target: https://github.com/backstage/backstage/blob/master/catalog-info.yaml
```

The builtin catalog backend has an ingestion loop that periodically goes through
all of these registered locations, and pushes them and their resulting output
through the list of _processors_.

Processors are classes that the site admin has registered with the catalog at
startup. They are at the heart of all catalog logic, and have the ability to
read the contents of locations, modify in-flight entities that were read out of
a location, perform validation, and more. The catalog comes with a set of
builtin processors, that have the ability to read from a list of well known
location types, to perform the basic processing needs, etc, but more can be
added by the organization that adopts Backstage.

We will now show the process of creating a new processor and location type,
which enables the ingestion of catalog data from an existing external API.

## Deciding on the New Locations

The first step is to decide how we want to point at the system that holds our
data. Let's assume that it is internally named System-X and can be reached
through HTTP REST calls to its API.

Let's decide that our locations shall take the following form:

```yaml
type: system-x
target: http://systemx.services.example.net/api/v2
```

It got its own made-up `type`, and the `target` conveniently points to the
actual API endpoint to talk to.

So now we have to make the catalog aware of such a location so that it can start
feeding it into the ingestion loop. For this kind of an integration, you'd
typically want to add it to the list of statically always-available locations in
the config.

```yaml
# In app-config.yaml
catalog:
  locations:
    - type: system-x
      target: http://systemx.services.example.net/api/v2
```

If you start up the backend now, it will start to periodically say that it could
not find a processor that supports that location. So let's make a processor that
does so!

## Creating a Catalog Data Reader Processor

The recommended way of instantiating the catalog backend classes is to use the
[`CatalogBuilder`](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/src/service/CatalogBuilder.ts),
as illustrated in the
[example backend here](https://github.com/backstage/backstage/blob/master/packages/backend/src/plugins/catalog.ts).
We will create a new
[`CatalogProcessor`](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/src/ingestion/processors/types.ts)
subclass that can be added to this catalog builder.

It is up to you where you put the code for this new processor class. For quick
experimentation you could place it in your backend package, but we recommend
putting all extensions like this in a backend plugin package of their own in the
`plugins` folder of your Backstage repo.

The class will have this basic structure:

```ts
import { UrlReader } from '@backstage/backend-common';
import { LocationSpec } from '@backstage/catalog-model';
import {
  results,
  CatalogProcessor,
  CatalogProcessorEmit,
} from '@backstage/plugin-catalog-backend';

// A processor that reads from the fictional System-X
export class SystemXReaderProcessor implements CatalogProcessor {
  constructor(private readonly reader: UrlReader) {}

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    // Pick a custom location type string. A location will be
    // registered later with this type.
    if (location.type !== 'system-x') {
      return false;
    }

    try {
      // Use the builtin reader facility to grab data from the
      // API. If you prefer, you can just use plain fetch here
      // (from the cross-fetch package), or any other method of
      // your choosing.
      const data = await this.reader.read(location.target);
      const json = JSON.parse(data.toString());
      // Repeatedly call emit(results.entity(location, <entity>))
    } catch (error) {
      const message = `Unable to read ${location.type}, ${error}`;
      emit(results.generalError(location, message));
    }

    return true;
  }
}
```

The key points to note are:

- Make a class that implements `CatalogProcessor`
- Only act on location types that you care about, and leave the rest alone by
  returning `false`
- Read the data from the external system in any way you see fit. Use the
  location `target` field if you designed it as mentioned above
- Call `emit` any number of times with the results of that process
- Finally return `true`

You should now be able to add this class to your backend in
`packages/backend/src/plugins/catalog.ts`:

```diff
+ import { SystemXReaderProcessor } from '../path/to/class';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = new CatalogBuilder(env);
+  builder.addProcessor(new SystemXReaderProcessor(env.reader));
```

Start up the backend - it should now start reading from the previously
registered location and you'll see your entities start to appear in Backstage.
