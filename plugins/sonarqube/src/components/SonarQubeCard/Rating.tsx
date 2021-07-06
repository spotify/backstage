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

import { BackstageTheme } from '@backstage/theme';
import { Avatar } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/styles';
import React, { useMemo } from 'react';

const useStyles = makeStyles((theme: BackstageTheme) => {
  const commonCardRating: CSSProperties = {
    height: theme.spacing(3),
    width: theme.spacing(3),
    color: theme.palette.common.white,
  };

  return {
    ratingDefault: {
      ...commonCardRating,
      background: theme.palette.status.aborted,
    },
    ratingA: {
      ...commonCardRating,
      background: theme.palette.status.ok,
    },
    ratingB: {
      ...commonCardRating,
      background: lighten(theme.palette.status.ok, 0.5),
    },
    ratingC: {
      ...commonCardRating,
      background: theme.palette.status.pending,
    },
    ratingD: {
      ...commonCardRating,
      background: theme.palette.status.warning,
    },
    ratingE: {
      ...commonCardRating,
      background: theme.palette.error.main,
    },
  };
});

export const Rating = ({
  rating,
  hideValue,
}: {
  rating?: string;
  hideValue?: boolean;
}) => {
  const classes = useStyles();

  const ratingProp = useMemo(() => {
    switch (rating) {
      case '1.0':
        return {
          name: 'A',
          className: classes.ratingA,
        };

      case '2.0':
        return {
          name: 'B',
          className: classes.ratingB,
        };

      case '3.0':
        return {
          name: 'C',
          className: classes.ratingC,
        };

      case '4.0':
        return {
          name: 'D',
          className: classes.ratingD,
        };

      case '5.0':
        return {
          name: 'E',
          className: classes.ratingE,
        };

      default:
        return {
          name: '',
          className: classes.ratingDefault,
        };
    }
  }, [classes, rating]);

  return (
    <Avatar className={ratingProp.className}>
      {!hideValue && ratingProp.name}
    </Avatar>
  );
};
