# e2e-test

End-to-end test for verifying Backstage packages.

## Usage

This package is only meant for usage within the Backstage monorepo.

All packages need to be installed and built before running the test. In a fresh clone of this repo you first need to run the following from the repo root:

```sh
yarn install
yarn tsc
yarn build:all
```

Once those tasks have completed, you can now run the test using `yarn e2e-test run`. The created app uses Yarn by default. Pass `--package-manager pnpm` to test an app that uses pnpm instead. This requires pnpm 11.28 or a later 11.x release, or pnpm 12.7 or later, to be installed. A pnpm app uses the `hoisted` node linker of the template, and `--node-linker isolated` switches it to the `isolated` linker.

If you make changes to other packages you will need to rerun `yarn tsc && yarn build`. Changes to this package do not require a rebuild.

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://backstage.io/docs)
