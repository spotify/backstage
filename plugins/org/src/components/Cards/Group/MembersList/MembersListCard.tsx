/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  ENTITY_DEFAULT_NAMESPACE,
  GroupEntity,
  RELATION_MEMBER_OF,
  UserEntity,
} from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityRouteParams,
  useEntity,
} from '@backstage/plugin-catalog-react';
import {
  Box,
  createStyles,
  Grid,
  Link,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import React from 'react';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import { useAsync } from 'react-use';

import {
  Avatar,
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[2],
      borderRadius: '4px',
      overflow: 'visible',
      position: 'relative',
      margin: theme.spacing(4, 1, 1),
      flex: '1',
      minWidth: '0px',
    },
  }),
);

const MemberComponent = ({ member }: { member: UserEntity }) => {
  const classes = useStyles();
  const {
    metadata: { name: metaName },
    spec: { profile },
  } = member;
  const displayName = profile?.displayName ?? metaName;

  return (
    <Grid item container xs={12} sm={6} md={4} xl={2}>
      <Box className={classes.card}>
        <Box
          display="flex"
          flexDirection="column"
          m={3}
          alignItems="center"
          justifyContent="center"
        >
          <Avatar
            displayName={displayName}
            picture={profile?.picture}
            customStyles={{
              position: 'absolute',
              top: '-2rem',
            }}
          />
          <Box pt={2} textAlign="center">
            <Typography variant="h5">
              <Link
                component={RouterLink}
                to={generatePath(
                  `/catalog/:namespace/user/${metaName}`,
                  entityRouteParams(member),
                )}
              >
                {displayName}
              </Link>
            </Typography>
            <Typography variant="caption">{profile?.email}</Typography>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export const MembersListCard = (_props: {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: GroupEntity;
}) => {
  const { entity: groupEntity } = useEntity<GroupEntity>();
  const {
    metadata: { name: groupName, namespace: grpNamespace },
    spec: { profile },
  } = groupEntity;
  const catalogApi = useApi(catalogApiRef);

  const displayName = profile?.displayName ?? groupName;

  const groupNamespace = grpNamespace || ENTITY_DEFAULT_NAMESPACE;

  const [page, setPage] = React.useState(1);
  const pageChange = (_: React.ChangeEvent<unknown>, pageIndex: number) => {
    setPage(pageIndex);
  };
  const pageSize = 50;

  const { loading, error, value: members } = useAsync(async () => {
    const membersList = await catalogApi.getEntities({
      filter: { kind: 'User' },
    });
    const groupMembersList = (membersList.items as UserEntity[]).filter(
      member =>
        member?.relations?.some(
          r =>
            r.type === RELATION_MEMBER_OF &&
            r.target.name.toLocaleLowerCase('en-US') ===
              groupName.toLocaleLowerCase('en-US') &&
            r.target.namespace.toLocaleLowerCase('en-US') ===
              groupNamespace.toLocaleLowerCase('en-US'),
        ),
    );
    return groupMembersList;
  }, [catalogApi, groupEntity]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const nbPages = Math.ceil((members?.length || 0) / pageSize);
  const paginationLabel = nbPages < 2 ? '' : `, page ${page} of ${nbPages}`;

  const pagination = (
    <Pagination
      count={nbPages}
      page={page}
      onChange={pageChange}
      showFirstButton
      showLastButton
    />
  );

  return (
    <Grid item>
      <InfoCard
        title={`Members (${members?.length || 0}${paginationLabel})`}
        subheader={`of ${displayName}`}
        actions={pagination}
      >
        <Grid container spacing={3}>
          {members && members.length > 0 ? (
            members
              .slice(pageSize * (page - 1), pageSize * page)
              .map(member => (
                <MemberComponent member={member} key={member.metadata.uid} />
              ))
          ) : (
            <Box p={2}>
              <Typography>This group has no members.</Typography>
            </Box>
          )}
        </Grid>
      </InfoCard>
    </Grid>
  );
};
