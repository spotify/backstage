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
import { makeStyles } from '@material-ui/core';
import { InfoCard, InfoCardVariants } from '../../layout/InfoCard';
import { BottomLinkProps } from '../../layout/BottomLink';
import { Gauge } from './Gauge';

type Props = {
  title: string;
  subheader?: string;
  variant?: InfoCardVariants;
  /** Progress in % specified as decimal, e.g. "0.23" */
  progress: number;
  inverse?: boolean;
  deepLink?: BottomLinkProps;
};

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: 250,
  },
});

export const GaugeCard = (props: Props) => {
  const classes = useStyles(props);
  const { title, subheader, progress, inverse, deepLink, variant } = props;

  return (
    <div className={classes.root}>
      <InfoCard
        title={title}
        subheader={subheader}
        deepLink={deepLink}
        variant={variant}
      >
        <Gauge value={progress} inverse={inverse} />
      </InfoCard>
    </div>
  );
};
