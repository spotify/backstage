### Source repo: https://github.com/johnson-jesse/simple-backstage-app-plugin

ExampleFetchComponent.tsx reference

```tsx
import React from 'react';
import { useAsync } from 'react-use';
import Alert from '@material-ui/lab/Alert';
import { githubAuthApiRef, useApi } from '@backstage/core-plugin-api';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import { graphql } from '@octokit/graphql';

const query = `{
  viewer {
    repositories(first: 100) {
      totalCount
      nodes {
        name
        createdAt
        description
        diskUsage
        isFork
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}`;

type Node = {
  name: string;
  createdAt: string;
  description: string;
  diskUsage: number;
  isFork: boolean;
};

type Viewer = {
  repositories: {
    totalCount: number;
    nodes: Node[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
  };
};

type DenseTableProps = {
  viewer: Viewer;
};

export const DenseTable = ({ viewer }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Created', field: 'createdAt' },
    { title: 'Description', field: 'description' },
    { title: 'Disk Usage', field: 'diskUsage' },
    { title: 'Fork', field: 'isFork' },
  ];

  return (
    <Table
      title="List Of User's Repositories"
      options={{ search: false, paging: false }}
      columns={columns}
      data={viewer.repositories.nodes}
    />
  );
};

export const ExampleFetchComponent = () => {
  const auth = useApi(githubAuthApiRef);

  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const token = await auth.getAccessToken();

    const gqlEndpoint = graphql.defaults({
      // Uncomment baseUrl if using enterprise
      // baseUrl: 'https://github.MY-BIZ.com/api',
      headers: {
        authorization: `token ${token}`,
      },
    });
    const { viewer } = await gqlEndpoint(query);
    return viewer;
  }, []);

  if (loading) return <Progress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (value && value.repositories) return <DenseTable viewer={value} />;

  return (
    <Table
      title="List Of User's Repositories"
      options={{ search: false, paging: false }}
      columns={[]}
      data={[]}
    />
  );
};
```
