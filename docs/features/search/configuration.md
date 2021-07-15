# Search Configuration Options

Using the app-config.yaml in the Backstage app, you can configure Backstage
Search and its building blocks, such as collators. This page serves as a
reference to all the available configuration options for Search.

## Stack Overflow Collator

For the
[StackOverflowCollator](https://github.com/backstage/backstage/blob/master/plugins/search-backend-node/src/collators/StackOverflowCollator.ts)
to get questions to index into Backstage Search it needs a baseUrl. You can
configure this by adding the following lines to your app-config.

```yml
# File: app-config.yaml

search:
  integrations:
    stackoverflow:
      baseUrl: https://api.stackexchange.com/2.2
```
