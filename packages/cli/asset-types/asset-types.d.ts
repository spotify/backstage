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

/* eslint-disable import/no-extraneous-dependencies */

/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.yaml' {
  const src: string;
  export default src;
}

declare module '*.icon.svg' {
  import { ComponentType } from 'react';
  import { SvgIconProps } from '@material-ui/core';

  const Icon: ComponentType<SvgIconProps>;
  export default Icon;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// NOTE(freben): Both the fix, and the placement of the fix, are not great.
//
// The fix is because the PositionError was renamed to
// GeolocationPositionError outside of our control, and react-use is dependent
// on the old name.
//
// The placement is because it's the one location we have at the moment, where
// a central .d.ts file is imported by the frontend and can be amended.
//
// After both TS and react-use are bumped high enough, this should be removed.
type PositionError = GeolocationPositionError;
