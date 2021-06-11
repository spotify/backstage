# @backstage/plugin-org

## 0.3.14

### Patch Changes

- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [d597a50c6]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/core-api@0.2.20
  - @backstage/plugin-catalog-react@0.2.0

## 0.3.13

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- f59a945b7: Paginate group members to only display 50 members maximum.
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/core-api@0.2.18
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/catalog-model@0.7.9

## 0.3.12

### Patch Changes

- 97d53f686: Optimize data fetched for the `OwnershipCard`.
- Updated dependencies [1279a3325]
- Updated dependencies [4a4681b1b]
- Updated dependencies [97b60de98]
- Updated dependencies [b051e770c]
- Updated dependencies [98dd5da71]
  - @backstage/core@0.7.4
  - @backstage/core-api@0.2.16
  - @backstage/catalog-model@0.7.6

## 0.3.11

### Patch Changes

- 7c6e1463b: Correctly route to namespaced group members
- 87171d57d: Correctly include group members via matching namespace relation
- baa39809e: Fixed MembersList showing members from a previous group when navigating to a new group
- 9f48b548c: Some cleanup in how types and components are used; leverage `EntityRefLinks`
- Updated dependencies [9f48b548c]
- Updated dependencies [8488a1a96]
  - @backstage/plugin-catalog-react@0.1.4
  - @backstage/catalog-model@0.7.5

## 0.3.10

### Patch Changes

- 9ca0e4009: use local version of lowerCase and upperCase methods
- Updated dependencies [a51dc0006]
- Updated dependencies [e7f9b9435]
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
- Updated dependencies [d88dd219e]
- Updated dependencies [c8b54c370]
  - @backstage/core-api@0.2.14
  - @backstage/core@0.7.2
  - @backstage/plugin-catalog-react@0.1.2

## 0.3.9

### Patch Changes

- Updated dependencies [12d8f27a6]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [9d455f69a]
- Updated dependencies [4c049a1a1]
- Updated dependencies [02816ecd7]
  - @backstage/catalog-model@0.7.3
  - @backstage/core-api@0.2.12
  - @backstage/core@0.7.0
  - @backstage/plugin-catalog-react@0.1.1

## 0.3.8

### Patch Changes

- e3bc5aad7: Use the `pageTheme` to colour the OwnershipCard boxes with their respective theme colours.
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [88f1f1b60]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [5c2e2863f]
- Updated dependencies [b6c4f485d]
- Updated dependencies [3a58084b6]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core-api@0.2.11
  - @backstage/core@0.6.3
  - @backstage/plugin-catalog-react@0.1.0
  - @backstage/catalog-model@0.7.2

## 0.3.7

### Patch Changes

- f4c2bcf54: Use a more strict type for `variant` of cards.
- e8692df4a: - Fixes padding in `MembersListCard`
  - Fixes email icon size in `GroupProfileCard`
  - Uniform sizing across `GroupProfileCard` and `UserProfileCard`
- Updated dependencies [f10950bd2]
- Updated dependencies [fd3f2a8c0]
- Updated dependencies [d34d26125]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [10a0124e0]
- Updated dependencies [07e226872]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/core-api@0.2.10
  - @backstage/core@0.6.2
  - @backstage/plugin-catalog-react@0.0.4

## 0.3.6

### Patch Changes

- 14aef4b94: Visual updates to User and Group pages
- Updated dependencies [19d354c78]
- Updated dependencies [b51ee6ece]
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.3.5

### Patch Changes

- 7fc89bae2: Display owner and system as entity page links in the tables of the `api-docs`
  plugin.

  Move `isOwnerOf` and `getEntityRelations` from `@backstage/plugin-catalog` to
  `@backstage/plugin-catalog-react` and export it from there to use it by other
  plugins.

- 0269f4fd9: Migrate to new composability API, exporting the plugin instance as `orgPlugin`, and the entity cards as `EntityGroupProfileCard`, `EntityMembersListCard`, `EntityOwnershipCard`, and `EntityUserProfileCard`.
- 019fe39a0: Switch dependency from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [54c7d02f7]
- Updated dependencies [11cb5ef94]
  - @backstage/core@0.6.0
  - @backstage/plugin-catalog-react@0.0.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.3.4

### Patch Changes

- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [593632f07]
- Updated dependencies [33846acfc]
- Updated dependencies [a187b8ad0]
- Updated dependencies [f04db53d7]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/plugin-catalog@0.2.12

## 0.3.3

### Patch Changes

- f573cf368: Fixed - normalizing strings for comparison when ignoring when one is in low case.
- Updated dependencies [f3b064e1c]
- Updated dependencies [c00488983]
- Updated dependencies [265a7ab30]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/catalog-model@0.6.1
  - @backstage/plugin-catalog@0.2.11
  - @backstage/core@0.4.4

## 0.3.2

### Patch Changes

- c0fac6163: Wrap entity cards on smaller screens
- ab805860a: Ensure a name is always displayed for user entities in the org plugin. This can happen when there is no profile
  displayName provided (e.g. a GitHub user that has not added a name to their profile)
- 8ef71ed32: Add a `<Avatar>` component to `@backstage/core`.
- c5297baeb: Display the new `profile` fields (`displayName`, `email`, and `picture`) for
  groups on the `GroupProfileCard`.

  This also resolves some cases where `profile` fields are missing for users or
  groups and for example falls back to displaying the entity name. Adds additional test data to the ACME Corp dataset.

- Updated dependencies [c911061b7]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/core@0.4.1
  - @backstage/plugin-catalog@0.2.7

## 0.3.1

### Patch Changes

- 2b71db211: Support transitive ownerships of users and groups.
- Updated dependencies [2527628e1]
- Updated dependencies [6011b7d3e]
- Updated dependencies [1c69d4716]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/plugin-catalog@0.2.6
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2
