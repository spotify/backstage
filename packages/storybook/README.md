# storybook

This package provides a Storybook build for Backstage. See https://backstage.io/storybook/.

## Why is this not part of `@backstage/core-components`?

This separate storybook package exists because of dependency conflicts with `@backstage/cli`. It uses `nohoist` to avoid the conflicts, and since you can only use that in private packages it has to be separated out of `@backstage/core-components`.
