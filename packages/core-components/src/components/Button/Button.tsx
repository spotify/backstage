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
  Button as MaterialButton,
  ButtonProps as MaterialButtonProps,
} from '@material-ui/core';
import React from 'react';
import { Link, LinkProps } from '../Link';

type Props = MaterialButtonProps & Omit<LinkProps, 'variant' | 'color'>;

/**
 * Thin wrapper on top of material-ui's Button component
 * Makes the Button to utilise react-router
 */
export const Button = React.forwardRef<any, Props>((props, ref) => (
  <MaterialButton ref={ref} component={Link} {...props} />
));
