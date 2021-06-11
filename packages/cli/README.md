# @backstage/cli

This package provides a CLI for developing Backstage plugins and apps.

## Installation

Install the package via Yarn:

```sh
yarn add @backstage/cli
```

## Development

For local development the cli can be used directly, even from other packages in this repo. The `bin/backstage-cli` entrypoint contains a switch that will load the implementation from the `src` directory when executed inside this repo.

To run the cli in watch mode, use `yarn start <args>`. For example `yarn start lint --help`.

To try out the command locally, you can execute the following from the parent directory of this repo:

```bash
./backstage/packages/cli/bin/backstage-cli --help
```

## Documentation

- [Backstage Readme](https://github.com/backstage/backstage/blob/master/README.md)
- [Backstage Documentation](https://github.com/backstage/backstage/blob/master/docs/README.md)
