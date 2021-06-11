---
id: configuring-ci-cd
title: Configuring CI/CD to generate and publish TechDocs sites
# prettier-ignore
description: Configuring CI/CD to generate and publish TechDocs sites to cloud storage
---

In the [Recommended deployment setup](./architecture.md#recommended-deployment),
TechDocs reads the static generated documentation files from a cloud storage
bucket (GCS, AWS S3, etc.). The documentation site is generated on the CI/CD
workflow associated with the repository containing the documentation files. This
document explains the steps needed to generate docs on CI and publish to a cloud
storage using [`techdocs-cli`](https://github.com/backstage/techdocs-cli).

The steps here target all kinds of CI providers (GitHub Actions, CircleCI,
Jenkins, etc.). Specific tools for individual providers will also be made
available here for simplicity (e.g. a GitHub Actions runner, CircleCI orb,
etc.).

A summary of the instructions below looks like this -

```sh
# This is an example script

# Prepare
REPOSITORY_URL='https://github.com/org/repo'
git clone $REPOSITORY_URL
cd repo

# Install @techdocs/cli, mkdocs and mkdocs plugins
npm install -g @techdocs/cli
pip install mkdocs-techdocs-core==0.*

# Generate
techdocs-cli generate --no-docker

# Publish
techdocs-cli publish --publisher-type awsS3 --storage-name <bucket/container> --entity <Namespace/Kind/Name>
```

That's it!

Take a look at
[`techdocs-cli` README](https://github.com/backstage/techdocs-cli) for the
complete command reference, details, and options.

## Steps

### 1. Setup a workflow

The TechDocs workflow should trigger on CI when any changes are made in the
repository containing the documentation files. You can be specific and configure
the workflow to be triggered only when files inside the `docs/` directory or
`mkdocs.yml` are changed.

### 2. Prepare step

The first step on the CI is to clone your documentation source repository in a
working directory. This is almost always the first step in most CI workflows.

On GitHub Actions, you can add a step

[`- uses: actions@checkout@v2`](https://github.com/actions/checkout).

On CircleCI, you can add a special
[`checkout`](https://circleci.com/docs/2.0/configuration-reference/#checkout)
step.

Eventually we are trying to do a `git clone <https://path/to/docs-repository/>`.

### 3. Generate step

Install [`npx`](https://www.npmjs.com/package/npx) to use it for running
`techdocs-cli`. Or you can install using `npm install -g @techdocs/cli`.

We are going to use the
[`techdocs-cli generate`](https://github.com/backstage/techdocs-cli#generate-techdocs-site-from-a-documentation-project)
command in this step.

```sh
npx @techdocs/cli generate --no-docker --source-dir PATH_TO_REPO --output-dir ./site
```

`PATH_TO_REPO` should be the location in the file path where the prepare step
above clones the repository.

### 4. Publish step

Depending on your cloud storage provider (AWS, Google Cloud, or Azure), set the
necessary authentication environment variables.

- [Google Cloud authentication](https://cloud.google.com/storage/docs/authentication#libauth)
- [AWS authentication](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-environment.html)

And then run the
[`techdocs-cli publish`](https://github.com/backstage/techdocs-cli#publish-generated-techdocs-sites)
command.

```sh
npx @techdocs/cli publish --publisher-type <awsS3|googleGcs> --storage-name <bucket/container> --entity <namespace/kind/name> --directory ./site
```

The updated TechDocs site built in this workflow is now ready to be served by
the TechDocs plugin in your Backstage app.

## Example: GitHub Actions CI and AWS S3

Here is an example workflow using GitHub Actions CI and AWS S3 storage. You can
use any CI and any other
[TechDocs supported cloud storage providers](README.md#platforms-supported).

Add a `.github/workflows/techdocs.yml` file in your
[Software Template(s)](../software-templates/index.md) like this -

```yaml
name: Publish TechDocs Site

on:
  push:
    branches: [main]
    # You can even set it to run only when TechDocs related files are updated.
    # paths:
    #   - "docs/**"
    #   - "mkdocs.yml"

jobs:
  publish-techdocs-site:
    runs-on: ubuntu-latest

    # The following secrets are required in your CI environment for publishing files to AWS S3.
    # e.g. You can use GitHub Organization secrets to set them for all existing and new repositories.
    env:
      TECHDOCS_S3_BUCKET_NAME: ${{ secrets.TECHDOCS_S3_BUCKET_NAME }}
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      AWS_REGION: ${{ secrets.AWS_REGION }}
      ENTITY_NAMESPACE: 'default'
      ENTITY_KIND: 'Component'
      ENTITY_NAME: 'my-doc-entity'
      # In a Software template, Scaffolder will replace {{cookiecutter.component_id | jsonify}}
      # with the correct entity name. This is same as metadata.name in the entity's catalog-info.yaml
      # ENTITY_NAME: '{{ cookiecutter.component_id | jsonify }}'

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - uses: actions/setup-node@v2
      - uses: actions/setup-python@v2

      # the 2 steps below can be removed if you aren't using plantuml in your documentation
      - name: setup java
        uses: actions/setup-java@v2
        with:
          distribution: 'zulu'
          java-version: '11'
      - name: download, validate, install plantuml and its dependencies
        run: |
          curl -o plantuml.jar -L http://sourceforge.net/projects/plantuml/files/plantuml.1.2021.4.jar/download
          echo "be498123d20eaea95a94b174d770ef94adfdca18  plantuml.jar" | sha1sum -c -
          mv plantuml.jar /opt/plantuml.jar
          mkdir -p "$HOME/.local/bin"
          echo $'#!/bin/sh\n\njava -jar '/opt/plantuml.jar' ${@}' >> "$HOME/.local/bin/plantuml"
          chmod +x "$HOME/.local/bin/plantuml"
          echo "$HOME/.local/bin" >> $GITHUB_PATH
          sudo apt-get install -y graphviz

      - name: Install techdocs-cli
        run: sudo npm install -g @techdocs/cli

      - name: Install mkdocs and mkdocs plugins
        run: python -m pip install mkdocs-techdocs-core==0.*

      - name: Generate docs site
        run: techdocs-cli generate --no-docker --verbose

      - name: Publish docs site
        run:
          techdocs-cli publish --publisher-type awsS3 --storage-name
          $TECHDOCS_S3_BUCKET_NAME --entity
          $ENTITY_NAMESPACE/$ENTITY_KIND/$ENTITY_NAME
```

When the new repository is scaffolded or new documentation updates are
committed, the GitHub Action workflow will publish the TechDocs site, which can
be viewed in your Backstage app.
