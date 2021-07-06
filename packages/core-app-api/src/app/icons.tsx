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

import { IconComponent } from '@backstage/core-plugin-api';
import MuiMenuBookIcon from '@material-ui/icons/MenuBook';
import MuiBrokenImageIcon from '@material-ui/icons/BrokenImage';
import MuiChatIcon from '@material-ui/icons/Chat';
import MuiDashboardIcon from '@material-ui/icons/Dashboard';
import MuiEmailIcon from '@material-ui/icons/Email';
import MuiGitHubIcon from '@material-ui/icons/GitHub';
import MuiHelpIcon from '@material-ui/icons/Help';
import MuiPeopleIcon from '@material-ui/icons/People';
import MuiPersonIcon from '@material-ui/icons/Person';
import MuiWarningIcon from '@material-ui/icons/Warning';
import MuiDocsIcon from '@material-ui/icons/Description';

type AppIconsKey =
  | 'brokenImage'
  | 'catalog'
  | 'chat'
  | 'dashboard'
  | 'docs'
  | 'email'
  | 'github'
  | 'group'
  | 'help'
  | 'user'
  | 'warning';

export type AppIcons = { [key in AppIconsKey]: IconComponent };

export const defaultAppIcons: AppIcons = {
  brokenImage: MuiBrokenImageIcon,
  // To be confirmed: see https://github.com/backstage/backstage/issues/4970
  catalog: MuiMenuBookIcon,
  chat: MuiChatIcon,
  dashboard: MuiDashboardIcon,
  docs: MuiDocsIcon,
  email: MuiEmailIcon,
  github: MuiGitHubIcon,
  group: MuiPeopleIcon,
  help: MuiHelpIcon,
  user: MuiPersonIcon,
  warning: MuiWarningIcon,
};
