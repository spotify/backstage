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

import MuiBrokenImageIcon from '@material-ui/icons/BrokenImage';
import React from 'react';
import { useApp, IconComponent } from '@backstage/core-plugin-api';

const overridableSystemIcon = (key: string): IconComponent => {
  const Component: IconComponent = props => {
    const app = useApp();
    const Icon = app.getSystemIcon(key);
    return Icon ? <Icon {...props} /> : <MuiBrokenImageIcon {...props} />;
  };
  return Component;
};

// Should match the list of overridable system icon keys in @backstage/core-app-api
export const BrokenImageIcon = overridableSystemIcon('brokenImage');
export const CatalogIcon = overridableSystemIcon('catalog');
export const ChatIcon = overridableSystemIcon('chat');
export const DashboardIcon = overridableSystemIcon('dashboard');
export const DocsIcon = overridableSystemIcon('docs');
export const EmailIcon = overridableSystemIcon('email');
export const GitHubIcon = overridableSystemIcon('github');
export const GroupIcon = overridableSystemIcon('group');
export const HelpIcon = overridableSystemIcon('help');
export const UserIcon = overridableSystemIcon('user');
export const WarningIcon = overridableSystemIcon('warning');
