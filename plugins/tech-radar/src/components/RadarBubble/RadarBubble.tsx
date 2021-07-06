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

import React, { useRef, useLayoutEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core';

export type Props = {
  visible: boolean;
  text: string;
  x: number;
  y: number;
};

const useStyles = makeStyles<Theme>(() => ({
  bubble: {
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0,
  },
  visibleBubble: {
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: 0.8,
  },
  background: {
    fill: '#333',
  },
  text: {
    pointerEvents: 'none',
    userSelect: 'none',
    fontSize: '10px',
    fill: '#fff',
  },
}));

const RadarBubble = (props: Props): JSX.Element => {
  const classes = useStyles(props);
  const { visible, text } = props;

  const textElem = useRef<SVGTextElement>(null);
  const svgElem = useRef<SVGGElement>(null);
  const rectElem = useRef<SVGRectElement>(null);
  const pathElem = useRef<SVGPathElement>(null);

  const updatePosition = () => {
    if (textElem.current) {
      const { x, y } = props;
      const bbox = textElem.current.getBBox();
      const marginX = 5;
      const marginY = 4;

      if (svgElem.current) {
        svgElem.current.setAttribute(
          'transform',
          `translate(${x - bbox.width / 2}, ${y - bbox.height - marginY})`,
        );
      }

      if (rectElem.current) {
        rectElem.current.setAttribute('x', String(-marginX));
        rectElem.current.setAttribute('y', String(-bbox.height));
        rectElem.current.setAttribute(
          'width',
          String(bbox.width + 2 * marginX),
        );
        rectElem.current.setAttribute('height', String(bbox.height + marginY));
      }

      if (pathElem.current) {
        pathElem.current.setAttribute(
          'transform',
          `translate(${bbox.width / 2 - marginX}, ${marginY - 1})`,
        );
      }
    }
  };

  useLayoutEffect(() => {
    updatePosition();
  });

  return (
    <g
      ref={svgElem}
      x={0}
      y={0}
      className={visible ? classes.visibleBubble : classes.bubble}
      data-testid="radar-bubble"
    >
      <rect ref={rectElem} rx={4} ry={4} className={classes.background} />
      <text ref={textElem} className={classes.text}>
        {text}
      </text>
      <path
        ref={pathElem}
        d="M 0,0 10,0 5,8 z"
        className={classes.background}
      />
    </g>
  );
};

export default RadarBubble;
