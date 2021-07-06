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

import { ComponentType } from 'react';
import { SvgIconProps } from '@material-ui/core';

/**
 * IconComponent is the common icon type used throughout Backstage when
 * working with and rendering generic icons, including the app system icons.
 *
 * The type is based on SvgIcon from MUI, but both do not what the plugin-api
 * package to have a dependency on MUI, nor do we want the props to be as broad
 * as the SvgIconProps interface.
 *
 * If you have the need to forward additional props from SvgIconProps, you can
 * open an issue or submit a PR to the main Backstage repo. When doing so please
 * also describe your use-case and reasoning of the addition.
 */
export type IconComponent = ComponentType<{
  fontSize?: 'default' | 'small' | 'large';
}>;

/**
 * This exists for backwards compatibility with the old core package.
 * It's used in some parts of this package in order to smooth out the
 * migration, but it is not exported.
 */
export type OldIconComponent = ComponentType<SvgIconProps>;
