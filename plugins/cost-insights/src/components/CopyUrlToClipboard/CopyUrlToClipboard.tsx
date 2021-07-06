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

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCopyToClipboard } from 'react-use';
import { Tooltip, IconButton } from '@material-ui/core';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

const ClipboardMessage = {
  default: 'Copy URL to clipboard',
  success: 'Copied!',
  error: "Couldn't copy to clipboard",
};

export const CopyUrlToClipboard = () => {
  const location = useLocation();
  const [state, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const origin = window.location.origin;
  const pathname = location.pathname;
  const search = location.search;
  const url = `${origin}${pathname}${search}`;

  useEffect(() => {
    if (state.error) {
      setCopied(false);
    } else if (state.value) {
      setCopied(true);
      setTimeout(setCopied, 1500, false);
    }
  }, [state]);

  let text = ClipboardMessage.default;
  let Icon = AssignmentOutlinedIcon;

  if (state.error) {
    text = ClipboardMessage.error;
    Icon = SentimentVeryDissatisfiedIcon;
  } else if (copied) {
    text = ClipboardMessage.success;
    Icon = AssignmentTurnedInOutlinedIcon;
  }

  return (
    <Tooltip title={text} arrow>
      <IconButton onClick={() => copyToClipboard(url)}>
        <Icon />
      </IconButton>
    </Tooltip>
  );
};
