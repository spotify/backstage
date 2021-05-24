/*
 * Copyright 2020 Spotify AB
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
  getEntityName,
  RELATION_MEMBER_OF,
  UserEntity,
} from '@backstage/catalog-model';
import { Avatar, InfoCard, InfoCardVariants, useApi } from '@backstage/core';
import {
  catalogApiRef,
  EntityRefLinks,
  getEntityRelations,
  useEntity,
} from '@backstage/plugin-catalog-react';
import {
  Box,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { useAsync } from 'react-use';

const CardTitle = ({ title }: { title?: string }) =>
  title ? (
    <Box display="flex" alignItems="center">
      <PersonIcon fontSize="inherit" />
      <Box ml={1}>{title}</Box>
    </Box>
  ) : null;

// TODO: Move to catalog model
const ATTACHMENT_PROFILE_PICTURE = 'backstage.io/profile-picture';

export const UserProfileCard = ({
  variant,
}: {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: UserEntity;
  variant?: InfoCardVariants;
}) => {
  const { entity: user } = useEntity<UserEntity>();
  const catalogApi = useApi(catalogApiRef);
  const { value: picture, loading } = useAsync(async () => {
    if (user) {
      const attachment = await catalogApi.getAttachment(
        getEntityName(user),
        ATTACHMENT_PROFILE_PICTURE,
      );
      return attachment.url();
    }

    return undefined;
  }, [catalogApi, user]);

  if (!user) {
    return <Alert severity="error">User not found</Alert>;
  }

  const {
    metadata: { name: metaName },
    spec: { profile },
  } = user;
  const displayName = profile?.displayName ?? metaName;
  const emailHref = profile?.email ? `mailto:${profile.email}` : undefined;
  const memberOfRelations = getEntityRelations(user, RELATION_MEMBER_OF, {
    kind: 'Group',
  });

  return (
    <InfoCard title={<CardTitle title={displayName} />} variant={variant}>
      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} sm={2} xl={1}>
          <Avatar
            displayName={displayName}
            picture={!loading ? picture : undefined}
          />
        </Grid>

        <Grid item md={10} xl={11}>
          <List>
            {profile?.email && (
              <ListItem>
                <ListItemIcon>
                  <Tooltip title="Email">
                    <EmailIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText>
                  <Link href={emailHref}>{profile.email}</Link>
                </ListItemText>
              </ListItem>
            )}

            <ListItem>
              <ListItemIcon>
                <Tooltip title="Member of">
                  <GroupIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText>
                <EntityRefLinks
                  entityRefs={memberOfRelations}
                  defaultKind="Group"
                />
              </ListItemText>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </InfoCard>
  );
};
