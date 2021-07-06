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
import missingAnnotation from './assets/missingAnnotation.svg';
import noInformation from './assets/noInformation.svg';
import createComponent from './assets/createComponent.svg';
import noBuild from './assets/noBuild.svg';
import { makeStyles } from '@material-ui/core';

type Props = {
  missing: 'field' | 'info' | 'content' | 'data';
};

const useStyles = makeStyles({
  generalImg: {
    width: '95%',
    zIndex: 2,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, 15%)',
  },
});

export const EmptyStateImage = ({ missing }: Props) => {
  const classes = useStyles();
  switch (missing) {
    case 'field':
      return (
        <img
          src={missingAnnotation}
          className={classes.generalImg}
          alt="annotation is missing"
        />
      );
    case 'info':
      return (
        <img
          src={noInformation}
          alt="no Information"
          className={classes.generalImg}
        />
      );
    case 'content':
      return (
        <img
          src={createComponent}
          alt="create Component"
          className={classes.generalImg}
        />
      );
    case 'data':
      return (
        <img src={noBuild} alt="no Build" className={classes.generalImg} />
      );
    default:
      return null;
  }
};
