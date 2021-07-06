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

import React, { ReactNode } from 'react';
import { grey } from '@material-ui/core/colors';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import ChatIcon from '@material-ui/icons/Chat';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import GitHubIcon from '@material-ui/icons/GitHub';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

import { GitReleaseManagerError } from '../errors/GitReleaseManagerError';
import { TEST_IDS } from '../test-helpers/test-ids';

interface DifferProps {
  icon: 'tag' | 'branch' | 'github' | 'slack' | 'versioning';
  current?: string;
  next?: string | ReactNode;
}

export const Differ = ({ current, next, icon }: DifferProps) => {
  return (
    <>
      {icon && (
        <span>
          <Icon icon={icon} />{' '}
        </span>
      )}

      {!!current && (
        <span
          data-testid={TEST_IDS.components.differ.current}
          style={{ color: grey[700] }}
        >
          {current ?? 'None'}
        </span>
      )}

      {current && next && <span>{'  →  '}</span>}

      {next && (
        <span
          data-testid={TEST_IDS.components.differ.next}
          style={{ fontWeight: 'bold' }}
        >
          {next}
        </span>
      )}
    </>
  );
};

interface IconProps {
  icon: DifferProps['icon'];
}

function Icon({ icon }: IconProps) {
  switch (icon) {
    case 'tag':
      return (
        <LocalOfferIcon
          data-testid={TEST_IDS.components.differ.icons.tag}
          style={{ verticalAlign: 'middle' }}
          fontSize="small"
        />
      );

    case 'branch':
      return (
        <CallSplitIcon
          data-testid={TEST_IDS.components.differ.icons.branch}
          style={{ verticalAlign: 'middle' }}
          fontSize="small"
        />
      );

    case 'github':
      return (
        <GitHubIcon
          data-testid={TEST_IDS.components.differ.icons.github}
          style={{ verticalAlign: 'middle' }}
          fontSize="small"
        />
      );

    case 'slack':
      return (
        <ChatIcon
          data-testid={TEST_IDS.components.differ.icons.slack}
          style={{ verticalAlign: 'middle' }}
          fontSize="small"
        />
      );

    case 'versioning':
      return (
        <DynamicFeedIcon
          data-testid={TEST_IDS.components.differ.icons.versioning}
          style={{ verticalAlign: 'middle' }}
          fontSize="small"
        />
      );

    default:
      throw new GitReleaseManagerError('Invalid Differ icon');
  }
}
