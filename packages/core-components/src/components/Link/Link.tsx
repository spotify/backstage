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
  Link as MaterialLink,
  LinkProps as MaterialLinkProps,
} from '@material-ui/core';
import React, { ElementType } from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

export const isExternalUri = (uri: string) => /^([a-z+.-]+):/.test(uri);

export type LinkProps = MaterialLinkProps &
  RouterLinkProps & {
    component?: ElementType<any>;
  };

/**
 * Thin wrapper on top of material-ui's Link component
 * Makes the Link to utilise react-router
 */
export const Link = React.forwardRef<any, LinkProps>((props, ref) => {
  const to = String(props.to);
  const external = isExternalUri(to);
  const newWindow = external && !!/^https?:/.exec(to);
  return external ? (
    // External links
    <MaterialLink
      ref={ref}
      href={to}
      {...(newWindow ? { target: '_blank', rel: 'noopener' } : {})}
      {...props}
    />
  ) : (
    // Interact with React Router for internal links
    <MaterialLink ref={ref} component={RouterLink} {...props} />
  );
});
