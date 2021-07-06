# @backstage/integration

## 0.5.7

### Patch Changes

- 22a60518c: Support ingesting multiple GitHub organizations via a new `GithubMultiOrgReaderProcessor`.

  This new processor handles namespacing created groups according to the org of the associated GitHub team to prevent potential name clashes between organizations. Be aware that this processor is considered alpha and may not be compatible with future org structures in the catalog.

  NOTE: This processor only fully supports auth via GitHub Apps

  To install this processor, import and add it as follows:

  ```typescript
  // Typically in packages/backend/src/plugins/catalog.ts
  import { GithubMultiOrgReaderProcessor } from '@backstage/plugin-catalog-backend';
  // ...
  export default async function createPlugin(env: PluginEnvironment) {
    const builder = new CatalogBuilder(env);
    builder.addProcessor(
      GithubMultiOrgReaderProcessor.fromConfig(env.config, {
        logger: env.logger,
      }),
    );
    // ...
  }
  ```

  Configure in your `app-config.yaml` by pointing to your GitHub instance and optionally list which GitHub organizations you wish to import. You can also configure what namespace you want to set for teams from each org. If unspecified, the org name will be used as the namespace. If no organizations are listed, by default this processor will import from all organizations accessible by all configured GitHub Apps:

  ```yaml
  catalog:
    locations:
      - type: github-multi-org
        target: https://github.myorg.com

    processors:
      githubMultiOrg:
        orgs:
          - name: fooOrg
            groupNamespace: foo
          - name: barOrg
            groupNamespace: bar
          - name: awesomeOrg
          - name: anotherOrg
  ```

## 0.5.6

### Patch Changes

- eda9dbd5f: Download archives as compressed tar files for Bitbucket to keep executable permissions.

## 0.5.5

### Patch Changes

- 49d7ec169: GitHub App ID can be a string too for environment variables otherwise it will fail validation

## 0.5.4

### Patch Changes

- 0fd4ea443: Updates the `GithubCredentialsProvider` to return the token type, it can either be `token` or `app` depending on the authentication method.

  Update the `GithubOrgReaderProcessor` NOT to query for email addresses if GitHub Apps is used for authentication, this is due to inconsistencies in the GitHub API when using server to server communications and installation tokens. https://github.community/t/api-v4-unable-to-retrieve-email-resource-not-accessible-by-integration/13831/4 for more info.

  **Removes** deprecated GithubOrgReaderProcessor provider configuration(`catalog.processors.githubOrg`). If you're using the deprecated config section make sure to migrate to [integrations](https://backstage.io/docs/integrations/github/locations) instead.

## 0.5.3

### Patch Changes

- 65e6c4541: Remove circular dependencies

## 0.5.2

### Patch Changes

- 38ca05168: The default `@octokit/rest` dependency was bumped to `"^18.5.3"`.
- Updated dependencies [d8b81fd28]
  - @backstage/config@0.1.5

## 0.5.1

### Patch Changes

- 277644e09: Include missing fields in GitLab config schema. This sometimes prevented loading config on the frontend specifically, when using self-hosted GitLab.
- 52f613030: Support GitHub `tree` URLs in `getGitHubFileFetchUrl`.
- 905cbfc96: Add `resolveEditUrl` to integrations to resolve a URL that can be used to edit
  a file in the web interfaces of an SCM.
- d4e77ec5f: Add option to `resolveUrl` that allows for linking to a specific line number when resolving a file URL.

## 0.5.0

### Minor Changes

- 491f3a0ec: Make `ScmIntegration.resolveUrl` mandatory.

## 0.4.0

### Minor Changes

- ffffea8e6: Update the `GitLabIntegrationConfig` to require the fields `apiBaseUrl` and `baseUrl`. The `readGitLabIntegrationConfig` function is now more strict and has better error reporting. This change mirrors actual reality in code more properly - the fields are actually necessary for many parts of code to actually function, so they should no longer be optional.

  Some checks that used to happen deep inside code that consumed config, now happen upfront at startup. This means that you may encounter new errors at backend startup, if you had actual mistakes in config but didn't happen to exercise the code paths that actually would break. But for most users, no change will be necessary.

  An example minimal GitLab config block that just adds a token to public GitLab would look similar to this:

  ```yaml
  integrations:
    gitlab:
      - host: gitlab.com
        token:
          $env: GITLAB_TOKEN
  ```

  A full fledged config that points to a locally hosted GitLab could look like this:

  ```yaml
  integrations:
    gitlab:
      - host: gitlab.my-company.com
        apiBaseUrl: https://gitlab.my-company.com/api/v4
        baseUrl: https://gitlab.my-company.com
        token:
          $env: OUR_GITLAB_TOKEN
  ```

  In this case, the only optional field is `baseUrl` which is formed from the `host` if needed.

## 0.3.2

### Patch Changes

- c4abcdb60: Fix GitLab handling of paths with spaces
- 064c513e1: Properly forward errors that occur when looking up GitLab project IDs.
- 3149bfe63: Add a `resolveUrl` method to integrations, that works like the two-argument URL
  constructor. The reason for using this is that Azure have their paths in a
  query parameter, rather than the pathname of the URL.

  The implementation is optional (when not present, the URL constructor is used),
  so this does not imply a breaking change.

- 2e62aea6f: #4322 Bitbucket own hosted v5.11.1 branchUrl fix and enabled error tracing… #4347

## 0.3.1

### Patch Changes

- 6800da78d: Fix default branch API url for custom hosted Bitbucket server
- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.

## 0.3.0

### Minor Changes

- ed6baab66: - Deprecating the `scaffolder.${provider}.token` auth duplication and favoring `integrations.${provider}` instead. If you receive deprecation warnings your config should change like the following:

  ```yaml
  scaffolder:
    github:
      token:
        $env: GITHUB_TOKEN
      visibility: public
  ```

  To something that looks like this:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
  scaffolder:
    github:
      visibility: public
  ```

  You can also configure multiple different hosts under the `integration` config like the following:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
      - host: ghe.mycompany.com
        token:
          $env: GITHUB_ENTERPRISE_TOKEN
  ```

  This of course is the case for all the providers respectively.

  - Adding support for cross provider scaffolding, you can now create repositories in for example Bitbucket using a template residing in GitHub.

  - Fix GitLab scaffolding so that it returns a `catalogInfoUrl` which automatically imports the project into the catalog.

  - The `Store Path` field on the `scaffolder` frontend has now changed so that you require the full URL to the desired destination repository.

  `backstage/new-repository` would become `https://github.com/backstage/new-repository` if provider was GitHub for example.

### Patch Changes

- 0b135e7e0: Add support for GitHub Apps authentication for backend plugins.

  `GithubCredentialsProvider` requests and caches GitHub credentials based on a repository or organization url.

  The `GithubCredentialsProvider` class should be considered stateful since tokens will be cached internally.
  Consecutive calls to get credentials will return the same token, tokens older than 50 minutes will be considered expired and reissued.
  `GithubCredentialsProvider` will default to the configured access token if no GitHub Apps are configured.

  More information on how to create and configure a GitHub App to use with backstage can be found in the documentation.

  Usage:

  ```javascript
  const credentialsProvider = new GithubCredentialsProvider(config);
  const { token, headers } = await credentialsProvider.getCredentials({
    url: 'https://github.com/',
  });
  ```

  Updates `GithubUrlReader` to use the `GithubCredentialsProvider`.

- fa8ba330a: Fix GitLab API base URL and add it by default to the gitlab.com host

## 0.2.0

### Minor Changes

- 466354aaa: Build out the `ScmIntegrations` class, as well as the individual `*Integration` classes

## 0.1.5

### Patch Changes

- 036a84373: Provide support for on-prem azure devops

## 0.1.4

### Patch Changes

- 1d1c2860f: Implement readTree on BitBucketUrlReader and getBitbucketDownloadUrl
- 4eafdec4a: Introduce readTree method for GitLab URL Reader
- 178e09323: Validate that integration config contains a valid host

## 0.1.3

### Patch Changes

- 38e24db00: Move the core url and auth logic to integration for the four major providers
- b8ecf6f48: Add the basics of cross-integration concerns
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/config@0.1.2

## 0.1.2

### Patch Changes

- b3d4e4e57: Move the frontend visibility declarations of integrations config from @backstage/backend-common to @backstage/integration

## 0.1.1

### Patch Changes

- 7b37e6834: Added the integration package
