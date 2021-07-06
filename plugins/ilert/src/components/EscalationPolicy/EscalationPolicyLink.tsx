/*
 * Copyright 2021 The Backstage Authors
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
import { makeStyles } from '@material-ui/core/styles';
import { EscalationPolicy } from '../../types';
import { ilertApiRef } from '../../api';

import { useApi } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';

const useStyles = makeStyles({
  link: {
    lineHeight: '22px',
  },
});

export const EscalationPolicyLink = ({
  escalationPolicy,
}: {
  escalationPolicy: EscalationPolicy | null;
}) => {
  const ilertApi = useApi(ilertApiRef);
  const classes = useStyles();

  if (!escalationPolicy) {
    return null;
  }

  return (
    <Link
      className={classes.link}
      to={ilertApi.getEscalationPolicyDetailsURL(escalationPolicy)}
    >
      {escalationPolicy.name}
    </Link>
  );
};
