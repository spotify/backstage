---
id: identity-resolver
title: Identity resolver
description: Identity resolvers of Backstage users after they sign-in
---

This guide explains how the identity of a Backstage user is stored inside their
Backstage Identity Token and how you can customize the Sign-In resolvers to
include identity and group membership information of the user from other
external systems. This ultimately helps with determining the ownership of a
Backstage entity by a user. The ideas here were originally proposed in the RFC
[#4089](https://github.com/backstage/backstage/issues/4089).

When a user signs in to Backstage, inside the `claims` field of their Backstage
Token (which are standard JWT tokens) a special `ent` claim is set. `ent`
contains a list of
[entity references](../features/software-catalog/references.md), each of which
denotes an identity or a membership that is relevant to the user. There is no
guarantee that these correspond to actual existing catalog entities.

Let's take an example sign-in resolver for the Google auth provider and explore
how the `ent` field inside `claims` can be set.

Inside your `packages/backend/src/plugins/auth.ts` file, you can provide custom
sign-in resolvers and set them for any of the Authentication providers inside
`providerFactories` of the `createRouter` imported from the
`@backstage/plugin-auth-backend` plugin.

```ts
export default async function createPlugin({
  ...
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    ...
    providerFactories: {
      google: createGoogleProvider({
        signIn: {
          resolver: async ({ profile: { email } }, ctx) => {
            // Call a custom validator function that checks that the email is
            // valid and on our own company's domain, and throws an Error if it
            // isn't
            validateEmail(email);

            // List of entity references that denote the identity and
            // membership of the user
            const ent = [];

            // Let's use the username in the email ID as the user's default
            // unique identifier inside Backstage.
            const [id] = email.split('@');
            ent.push(`User:default/${id}`)

            // Let's call the internal LDAP provider to get a list of groups
            // that the user belongs to, and add those to the list as well
            const ldapGroups = await getLdapGroups(email);
            ldapGroups.forEach(group => ent.push(`Group:default/${group}`))

            // Issue the token containing the entity claims
            const token = await ctx.tokenIssuer.issueToken({
              claims: { sub: id, ent },
            });
            return { id, token };
          },
        },
      }),
    },
  });
}
```

As you can see, the generated Backstage Token now contains all the claims about
the identity and membership of the user. Once the sign-in process is complete,
and we need to find out if a user owns an Entity in the Software Catalog, these
`ent` claims can be used to determine the ownership.

According to the RFC, the definition of the ownership of an entity E, for a user
U, is as follows:

- Get all the `ownedBy` relations of E, and call them O
- Get all the claims of the user U and call them C
- If any C matches any O, return `true`
- Get all Group entities that U is a member of, using the regular
  `memberOf`/`hasMember` relation mechanism, and call them G
- If any G matches any O, return `true`
- Otherwise, return `false`

## Default sign-in resolvers

Of course you don't have to customize the sign-in resolver if you don't need to.
The Auth backend plugin comes with a set of default sign-in resolvers which you
can use. For example - the Google provider has a default email-based sign-in
resolver, which will search the catalog for a single user entity that has a
matching `google.com/email` annotation.

It can be enabled like this

```tsx
// File: packages/backend/src/plugins/auth.ts
import { googleEmailSignInResolver } from '@backstage/plugin-auth-backend';

export default async function createPlugin({
  ...
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    ...
    providerFactories: {
      google: createGoogleProvider({
        signIn: {
          resolver: googleEmailSignInResolver
        }
...
```

## AuthHandler

Similar to a custom sign-in resolver, you can also write a custom auth handler
function which is used to verify and convert the auth response into the profile
that will be presented to the user. This is where you can customize things like
display name and profile picture.

This is also the place where you can do authorization and validation of the user
and throw errors if the user should not be allowed access in Backstage.

```tsx
// File: packages/backend/src/plugins/auth.ts
export default async function createPlugin({
  ...
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    ...
    providerFactories: {
      google: createGoogleProvider({
        authHandler: async ({
          fullProfile  // Type: passport.Profile,
          idToken      // Type: (Optional) string,
        }) => {
          // Custom validation code goes here
          return {
            profile: {
              email,
              picture,
              displayName,
            }
          };
        }
      })
    }
  })
}
```
