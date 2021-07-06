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

import React from 'react';
import { BackstageTheme } from '@backstage/theme';
import { makeStyles, Avatar } from '@material-ui/core';
import { useUserProfile } from '../useUserProfileInfo';
import { sidebarConfig } from '@backstage/core-components';

const useStyles = makeStyles<BackstageTheme, { size: number }>(theme => ({
  avatar: {
    width: ({ size }) => size,
    height: ({ size }) => size,
    fontSize: ({ size }) => size * 0.7,
    border: `1px solid ${theme.palette.textSubtle}`,
  },
}));

type Props = { size?: number };

export const SignInAvatar = ({ size }: Props) => {
  const { iconSize } = sidebarConfig;
  const classes = useStyles(size ? { size } : { size: iconSize });
  const { profile } = useUserProfile();

  return <Avatar src={profile.picture} className={classes.avatar} />;
};
