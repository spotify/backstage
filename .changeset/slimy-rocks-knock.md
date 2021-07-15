---
'@backstage/plugin-api-docs': patch
---

Added a fetcher to the GraphqlDefinitionWidget in the Api-Docs plugin so that the graphql query can execute. Added a new prop graphqlLink which is taken from the entity's annotations and uses that as the graphql endpoint for the fetcher. Added a warning message that displays when no annotation for the graphql endpoint is given.
