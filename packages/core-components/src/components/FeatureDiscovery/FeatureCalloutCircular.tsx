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

import { ClickAwayListener, makeStyles, Typography } from '@material-ui/core';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { usePortal } from './lib/usePortal';
import { useShowCallout } from './lib/useShowCallout';

const useStyles = makeStyles({
  '@keyframes pulsateSlightly': {
    '0%': { transform: 'scale(1.0)' },
    '100%': { transform: 'scale(1.1)' },
  },
  '@keyframes pulsateAndFade': {
    '0%': { transform: 'scale(1.0)', opacity: 0.9 },
    '100%': { transform: 'scale(1.5)', opacity: 0 },
  },
  featureWrapper: {
    position: 'relative',
  },
  backdrop: {
    zIndex: 2000,
    position: 'fixed',
    overflow: 'hidden',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  dot: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: '100%',
    border: '1px solid rgba(103, 146, 180, 0.98)',
    boxShadow: '0px 0px 0px 20000px rgba(0, 0, 0, 0.5)',
    zIndex: 2001,
    transformOrigin: 'center center',
    animation:
      '$pulsateSlightly 1744ms 1.2s cubic-bezier(0.4, 0, 0.2, 1) alternate infinite',
  },
  pulseCircle: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: '100%',
    border: '2px solid white',
    zIndex: 2001,
    transformOrigin: 'center center',
    animation:
      '$pulsateAndFade 872ms 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
  },
  text: {
    position: 'absolute',
    color: 'white',
    zIndex: 2003,
  },
});

export type Props = {
  featureId: string;
  title: string;
  description: string;
};

type Placement = {
  dotLeft: number;
  dotTop: number;
  dotSize: number;
  borderWidth: number;
  textLeft: number;
  textTop: number;
  textWidth: number;
};

export const FeatureCalloutCircular = ({
  featureId,
  title,
  description,
  children,
}: PropsWithChildren<Props>) => {
  const { show, hide } = useShowCallout(featureId);
  const portalElement = usePortal('core.callout');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<Placement | undefined>();
  const classes = useStyles();

  const update = useCallback(() => {
    if (wrapperRef.current) {
      const wrapperBounds = wrapperRef.current.getBoundingClientRect();
      const longest = Math.max(wrapperBounds.width, wrapperBounds.height);

      const borderWidth = 800;
      const dotLeft =
        wrapperBounds.x - (longest - wrapperBounds.width) / 2 - borderWidth;
      const dotTop =
        wrapperBounds.y - (longest - wrapperBounds.height) / 2 - borderWidth;
      const dotSize = longest + 2 * borderWidth;

      const textWidth = 450;
      const textLeft = wrapperBounds.x + wrapperBounds.width / 2 - textWidth;
      const textTop =
        wrapperBounds.y - (longest - wrapperBounds.height) / 2 + longest + 20;

      setPlacement({
        dotLeft,
        dotTop,
        dotSize,
        borderWidth,
        textTop,
        textLeft,
        textWidth,
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, [update]);

  useLayoutEffect(update, [wrapperRef.current, update]);

  if (!show) {
    return <>{children}</>;
  }

  return (
    <>
      <div className={classes.featureWrapper} ref={wrapperRef}>
        {children}
      </div>
      {createPortal(
        <div className={classes.backdrop}>
          <ClickAwayListener onClickAway={hide}>
            <>
              <div
                className={classes.dot}
                data-testid="dot"
                style={{
                  left: placement?.dotLeft,
                  top: placement?.dotTop,
                  width: placement?.dotSize,
                  height: placement?.dotSize,
                  borderWidth: placement?.borderWidth,
                }}
                onClick={hide}
                onKeyDown={hide}
                role="button"
                tabIndex={0}
              >
                <div className={classes.pulseCircle} />
              </div>
              <div
                className={classes.text}
                data-testid="text"
                style={{
                  left: placement?.textLeft,
                  top: placement?.textTop,
                  width: placement?.textWidth,
                }}
              >
                <Typography variant="h2" paragraph>
                  {title}
                </Typography>
                <Typography>{description}</Typography>
              </div>
            </>
          </ClickAwayListener>
        </div>,
        portalElement,
      )}
    </>
  );
};
