# @backstage/create-app

This package provides a CLI for creating a copy of the Backstage app.

You can use the flag `--skip-install` to skip the install.

Apps use Yarn by default. Pass `--package-manager pnpm` to create a pnpm workspace instead, with a `pnpm-workspace.yaml` file in place of the Yarn configuration. pnpm is also selected when the command runs through pnpm, as with `pnpm create @backstage/app`. pnpm 11.28 or a later 11.x release, or pnpm 12.7 or later, is required.

## Usage

With `npx`:

```sh
npx @backstage/create-app
```

With a local clone of this repo, from the main `create-app/` folder, run:

```sh
yarn install
yarn backstage-create-app
```

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs/)
