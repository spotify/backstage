/*
 * Copyright 2021 Spotify AB
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

const useStyles = makeStyles(theme => ({
  lineNumberCell: {
    color: `${theme.palette.grey[500]}`,
    fontSize: '90%',
    borderRight: `1px solid ${theme.palette.grey[500]}`,
    paddingRight: theme.spacing(1),
    textAlign: 'right',
  },
  hitCountCell: {
    width: '50px',
    borderRight: `1px solid ${theme.palette.grey[500]}`,
    textAlign: 'center',
    color: 'white', // need to enforce this color since it needs to stand out against colored background
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  countRoundedRectangle: {
    borderRadius: '45px',
    fontSize: '90%',
    padding: '1px 3px 1px 3px',
    width: '50px',
  },
  hitCountRoundedRectangle: {
    backgroundColor: `${theme.palette.success.main}`,
  },
  notHitCountRoundedRectangle: {
    backgroundColor: `${theme.palette.error.main}`,
  },
  codeLine: {
    paddingLeft: `${theme.spacing(1)}`,
    whiteSpace: 'pre',
    fontSize: '90%',
  },
  hitCodeLine: {
    backgroundColor: `${theme.palette.success.main}`,
  },
  notHitCodeLine: {
    backgroundColor: `${theme.palette.error.main}`,
  },
}));

type CodeRowProps = {
  lineNumber: number;
  lineContent: string;
  lineHits?: number | null;
};

export const CodeRow = ({
  lineNumber,
  lineContent,
  lineHits = null,
}: CodeRowProps) => {
  const classes = useStyles();
  const hitCountRoundedRectangleClass = [classes.countRoundedRectangle];
  const lineContentClass = [classes.codeLine];

  let hitRoundedRectangle = null;
  if (lineHits !== null) {
    if (lineHits > 0) {
      hitCountRoundedRectangleClass.push(classes.hitCountRoundedRectangle);
      lineContentClass.push(classes.hitCodeLine);
    } else {
      hitCountRoundedRectangleClass.push(classes.notHitCountRoundedRectangle);
      lineContentClass.push(classes.notHitCodeLine);
    }
    hitRoundedRectangle = (
      <div className={hitCountRoundedRectangleClass.join(' ')}>{lineHits}</div>
    );
  }

  return (
    <tr>
      <td className={classes.lineNumberCell}>{lineNumber}</td>
      <td className={classes.hitCountCell}>{hitRoundedRectangle}</td>
      <td
        className={lineContentClass.join(' ')}
        dangerouslySetInnerHTML={{ __html: lineContent }}
      />
    </tr>
  );
};
