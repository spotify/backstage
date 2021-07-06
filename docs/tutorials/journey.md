---
id: journey
title: Future developer journey
description: This document describes a possible journey of a future Backstage
---

> This document describes a possible journey of a **_future_** Backstage plugin
> developer as they build a plugin that touches many different aspects of a
> Backstage. The story invents many new things that are not part of Backstage
> today, but are things that I'm suggesting we should add as long term or north
> star goals. The idea is to discuss what parts of the story makes sense to aim
> for, and what we'd want to do differently or not at all. The "chapters" are
> numbered to make it a bit easier to comment on parts of the story.

# The Protagonist

Sam is an experienced developer that has worked with Backstage for a while, and
knows the best practices and tools available to build plugins. Sam also likes
music and wants to have a theme tune for every service in Backstage.

# The End

Sam built a Spotify plugin for Backstage that allows service owners to define a
theme tune for their service. The theme tune plays whenever a user visits the
service page in Backstage. The plugin is published to npm and available for any
organization to easily install and add to their Backstage installation.

# 1. A New Plugin

Sam chooses to develop this plugin in a standalone project and creates a new
plugin using `npx @backstage/cli create-plugin`, which detects that it's not
being run in an existing project and therefore creates a separate plugin repo.

Spinning up the frontend with `yarn start`, Sam goes to work with getting the
base functionality of a Spotify web player going. By installing a couple of
dependencies and whipping together a nice UI, the player is pretty much done.

# 2. The Auth Menace

Sam realizes users need to be authenticated towards the Spotify API to be able
to play music, and Backstage doesn't support Spotify login yet. Sam adds the
`@backstage/plugin-auth-backend` as local development middleware in the project,
and provides the necessary wrapping logic and configuration for the
`passport-spotify` strategy. The Spotify auth provider is now available in the
local development backend, and by adding a frontend `SpotifyAuth` Utility API
that implements the `OAuthApi` type, it's now working in the frontend too.

```ts
const spotifyAuthApiRef = createApiRef<OAuthApi>({
  id: 'core.auth.spotify',
  description: 'Provides authentication towards Spotify APIs',
});
```

Sam realizes that Spotify auth might be useful to others, and that it would be
more convenient if it was a part of the Backstage Core. After submitting and
merging a Pull Request with the additions to the
`@backstage/plugin-auth-backend` and `@backstage/core-plugin-api` packages,
Spotify auth is now available for everyone to use. Since the Backstage Core team
also adds it to the public demo server, Sam can now get rid of it in the local
setup and rely on the shared development auth providers instead.

The only thing left now is making sure that users of the plugin provide Spotify
auth in the app. Sam ensures this by adding `spotifyAuthApiRef` to the plugin's
list of required APIs, as well as listing it in the requirements section in the
README.

```md
## Requirements

This plugin requires the following APIs to function:

- `spotifyAuthApiRef` from `@@backstage/core-plugin-api@^1.1.0`
```

# 3. The Catalog Awakens

Sam now has a working player and a method for users to log in to listen to
music, but the goal is to provide theme songs for services. Sam adds this
functionality by defining a new metadata annotation called
`sam.wise/spotify-track-id`. The annotation's value is a Spotify track ID and
can be defined in a component like this:

```yaml
apiVersion: backstage.io/v1
kind: Component
metadata:
  name: my-component
  annotations:
    sam.wise/spotify-track-id: '4uLU6hMCjMI75M1A2tKUQC'
spec:
  type: service
```

Sam creates a JSON schema that documents the annotation and allows it to be used
in validation and documentation for organizations that choose to adopt the
plugin.

```json
{
  "sam.wise/spotify-track-id": {
    "$id": "https://raw.githubusercontent.com/sam/backstage-spotify-theme/master/annotation.json#/sam.wise/spotify-track-id",
    "type": "string",
    "title": "Spotify Track Annotation",
    "description": "Spotify track ID to associated with the entity",
    "examples": ["4uLU6hMCjMI75M1A2tKUQC"]
  }
}
```

# 4. The Rise of Widgets

Sam also wraps the music player in an entity page widget. This allows anyone
that wants to use the plugin to add the player to any of their entity layout
templates, which will make it show up for every entity of that kind.

```tsx
export const PlayerWidget = plugin.createEntityWidget({
  component: WebPlayer,
  locations: ['header', 'card', 'footer'],
  cardSize: [2, 4],
});
```

The widget receives information about the entity in whose page it's being
embedded, which makes it simple to grab the track id from the annotations and
hook up the player.

Sam also modifies the standalone plugin development setup to include this new
widget inside a basic entity page, adding it to a couple of different places
where users of the plugin may want to put the player, just to make sure they all
work.

# 5. The First User

At this point the only things that anyone that wants to use Sam's plugin needs
to do are to add
https://raw.githubusercontent.com/sam/backstage-spotify-theme/master/annotation.json#/sam.wise/spotify-track-id
to their catalog schema, import and add the `PlayerWidget` on the desired entity
template pages, and make sure they're providing Spotify auth.

Sam soon sees the first "Used by" show up on GitHub, and feedback starts rolling
in. Users really like the plugin, and some a requesting the possibility to
select a theme tune when creating a new component. Sam jumps on the idea and
adds a new creation hook that is exported by the plugin. The hook can be
installed either in a single, all, or component templates that match a label. It
adds a field as a part of the component creation process with a nice search box
that allows users to search for a track that they want to use as the theme tune.

# 6. Return to the Repo

Sam is pretty content at this point, but would like to make it easier for users
to change the track after creation, preferable using the same search box that
was made for the creation form. By adding an edit button to the `PlayerWidget`,
and a nice empty state, Sam is able to provide the appropriate hooks in the GUI
to open up a search dialog.

To save the selected track, Sam uses the `RepoApi` to suggest a change to the
entity definition file. This will create a Pull Request for organizations that
use GitHub, a Merge Request for users of GitLab, and so on.

```ts
const repoApi = useApi(repoApiRef);
const alertApi = useApi(alertApiRef);

const onSave = async () => {
  const { url } = await repoApi.createChangeRequest({
    title: `Change theme tune to ${track.title} by ${track.artist}`,
    changes: [
      {
        path: entityYamlPath,
        content: newEntityYamlContent,
      },
    ],
  });

  alertApi.post({ message: `Requested change, ${url}` });
};
```

Now it's much simpler for users to change the theme tune, as they no longer need
to go look up a track ID and edit a YAML file. Instead, they can now stay inside
Backstage and search for the track and request the change from there. In
addition, the requested change can be reviewed by the regular process of each
organization.

# 7. The User Strikes Back

Sam's plugin is pretty popular at this point, and has been picked up and used by
many organizations. But some users start voicing concerns that they have too
many different hand-crafted annotations in their entity descriptions, and would
like to be able to avoid some of them. They really like the theme tunes though,
and wish they could keep them without having to put them in the entity
description, even if that means it won't go through the regular source control
review process.

One day Sam receives a Pull Request for the plugin. It adds an option to use the
Database provided by `@backstage/backend-common` to store the track ID. It's all
packaged into a new backend plugin that will also extend the catalog backend
with schema and functionality to automatically load the value of the
`sam.wise/spotify-track-id` annotation from the backend plugin and database. The
backend plugin also extends the common GraphQL schema with a mutation that
updates the track ID in the database.

On the frontend the Pull Request doesn't change much. It defines the save action
the was previously using the `RepoApi` in its own API.

```ts
type ThemeTuneStorageApi = {
  save(entity: Entity, trackId: string): Promise<void>;
};
```

The plugin also provides two different implementations of the API, one that uses
the old behavior of the `RepoApi`, and a new one that calls the `GraphQL` API.
The new API relies on the `IdentityApi` as a mechanism for authorizing changes,
instead of source control reviews. The `IdentityApi` provides a token that is
included in the request to the backend, which then must match the owner of the
component for which the user is trying to change the theme tune.

> Author breaking the 4th wall here. I actually think every GraphQL request
> should include the ID token of the user, but invented a reason to include it
> here anyway.

The API is selected based on a configuration parameter for the plugin, but
defaults to the original `RepoApi` behavior.

```ts
if (config.getBoolean('storeTrackInDatabase')) {
  return new GraphQLThemeTuneStore(graphqlClient, identityApi, alertApi);
} else {
  return new RepoThemeTuneStore(repoApi, alertApi);
}
```

Sam is amazed by the pure awesomeness of this change, replies with a "👍" and
hits merge.

# 8. Attack of the Clones

Sam just released v1.8.4 of the plugin, and at this point it's so popular that a
couple of other plugins have started depending on the
`sam.wise/spotify-track-id` annotation. One such plugin being the
`spotify-album-art` plugin that can display the album art of the theme tune as
the background of the entity header. Sam thinks it's all pretty cool, but
doesn't like that the annotation that was once an internal concern of the plugin
is now becoming a standard in the community.

In order to standardize the annotation in Backstage, Sam submits a Pull Request
to the Backstage Core repo. The request suggests a new well-known metadata
annotation called `spotify.com/track-id`, with the same schema definition as
Sam's label, and refers to Sam's own plugin and the `spotify-album-art` plugin
as existing usages. The Backstage maintainers merge the Pull Request, after
checking with the folks over at Spotify that they're cool with the annotation,
and faffing about over some minor grammar mistake in the annotation description.

With the annotation now available inside Backstage Core, Sam releases v2 of the
plugin, which uses the new annotation. It can still consume the old annotation
for backwards compatibility, but new users of the plugin no longer need to add
the
https://raw.githubusercontent.com/sam/backstage-spotify-theme/master/annotation.json#/sam.wise/spotify-track-id
extension to their catalog schema, as it's now part of the core schema. The new
release of Sam's plugin specifies a dependency on Backstage with a minimum
version set to the same release as the one were the annotation was added to the
core schema.

# 9. Revenge of the Sam

Sam, now in full control of all theme tunes in Backstage, releases v2.0.1, which
switches all tracks to 4uLU6hMCjMI75M1A2tKUQC. Sam wanted to do something more
nefarious, but since Backstage sandboxes sensitive actions and is mostly
read-only with strict CSP, Sam's hands were tied.
