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

import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Grid, IconButton, makeStyles, Theme } from '@material-ui/core';

const generateGradientStops = (themeType: 'dark' | 'light') => {
  // 97% corresponds to the theme.palette.background.default for the light theme
  // 16% for the dark theme
  const luminance = themeType === 'dark' ? '16%' : '97%';
  // Generated with https://larsenwork.com/easing-gradients/
  return `
    hsl(0, 0%, ${luminance}) 0%,
    hsla(0, 0%, ${luminance}, 0.987) 8.1%,
    hsla(0, 0%, ${luminance}, 0.951) 15.5%,
    hsla(0, 0%, ${luminance}, 0.896) 22.5%,
    hsla(0, 0%, ${luminance}, 0.825) 29%,
    hsla(0, 0%, ${luminance}, 0.741) 35.3%,
    hsla(0, 0%, ${luminance}, 0.648) 41.2%,
    hsla(0, 0%, ${luminance}, 0.55) 47.1%,
    hsla(0, 0%, ${luminance}, 0.45) 52.9%,
    hsla(0, 0%, ${luminance}, 0.352) 58.8%,
    hsla(0, 0%, ${luminance}, 0.259) 64.7%,
    hsla(0, 0%, ${luminance}, 0.175) 71%,
    hsla(0, 0%, ${luminance}, 0.104) 77.5%,
    hsla(0, 0%, ${luminance}, 0.049) 84.5%,
    hsla(0, 0%, ${luminance}, 0.013) 91.9%,
    hsla(0, 0%, ${luminance}, 0) 100%
  `;
};

const fadeSize = 100;
const fadePadding = 10;

type Props = {
  scrollStep?: number;
  scrollSpeed?: number; // lower is faster
  minScrollDistance?: number; // limits how small steps the scroll can take in px
};

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
  },
  container: {
    overflow: 'auto',
    scrollbarWidth: 0 as any, // hide in FF
    '&::-webkit-scrollbar': {
      display: 'none', // hide in Chrome
    },
  },
  fade: {
    position: 'absolute',
    width: fadeSize,
    height: `calc(100% + ${fadePadding}px)`,
    transition: 'opacity 300ms',
    pointerEvents: 'none',
  },
  fadeLeft: {
    left: -fadePadding,
    background: `linear-gradient(90deg, ${generateGradientStops(
      theme.palette.type,
    )})`,
  },
  fadeRight: {
    right: -fadePadding,
    background: `linear-gradient(270deg, ${generateGradientStops(
      theme.palette.type,
    )})`,
  },
  fadeHidden: {
    opacity: 0,
  },
  button: {
    position: 'absolute',
  },
  buttonLeft: {
    left: -theme.spacing(2),
  },
  buttonRight: {
    right: -theme.spacing(2),
  },
}));

// Returns scroll distance from left and right
function useScrollDistance(
  ref: React.MutableRefObject<HTMLElement | undefined>,
): [number, number] {
  const [[scrollLeft, scrollRight], setScroll] = React.useState<
    [number, number]
  >([0, 0]);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      setScroll([0, 0]);
      return;
    }

    const handleUpdate = () => {
      const left = el.scrollLeft;
      const right = el.scrollWidth - el.offsetWidth - el.scrollLeft;
      setScroll([left, right]);
    };

    handleUpdate();

    el.addEventListener('scroll', handleUpdate);
    window.addEventListener('resize', handleUpdate);
    // TODO(freben): Remove this eslint exception later
    // It's here because @types/react-router-dom v5 pulls in @types/react that have the wrong signature
    // eslint-disable-next-line consistent-return
    return () => {
      el.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [ref]);

  return [scrollLeft, scrollRight];
}

// Used to animate scrolling. Returns a single setScrollTarger function, when called with e.g. 200,
// the element pointer to by the ref will be scrolled 200px forwards over time.
function useSmoothScroll(
  ref: React.MutableRefObject<HTMLElement | undefined>,
  speed: number,
  minDistance: number,
) {
  const [scrollTarget, setScrollTarget] = React.useState<number>(0);

  React.useLayoutEffect(() => {
    if (scrollTarget === 0) {
      return;
    }

    const startTime = performance.now();
    const id = requestAnimationFrame(frameTime => {
      if (!ref.current) {
        return;
      }
      const frameDuration = frameTime - startTime;
      const scrollDistance = (Math.abs(scrollTarget) * frameDuration) / speed;
      const cappedScrollDistance = Math.max(minDistance, scrollDistance);
      const scrollAmount = cappedScrollDistance * Math.sign(scrollTarget);

      ref.current.scrollBy({ left: scrollAmount });

      const newScrollTarget = scrollTarget - scrollAmount;
      if (Math.sign(scrollTarget) !== Math.sign(newScrollTarget)) {
        setScrollTarget(0);
      } else {
        setScrollTarget(newScrollTarget);
      }
    });

    // TODO(freben): Remove this eslint exception later
    // It's here because @types/react-router-dom v5 pulls in @types/react that have the wrong signature
    // eslint-disable-next-line consistent-return
    return () => cancelAnimationFrame(id);
  }, [ref, scrollTarget, speed, minDistance]);

  return setScrollTarget;
}

export const HorizontalScrollGrid = (props: PropsWithChildren<Props>) => {
  const {
    scrollStep = 100,
    scrollSpeed = 50,
    minScrollDistance = 5,
    children,
    ...otherProps
  } = props;
  const classes = useStyles(props);
  const ref = React.useRef<HTMLElement>();

  const [scrollLeft, scrollRight] = useScrollDistance(ref);
  const setScrollTarget = useSmoothScroll(ref, scrollSpeed, minScrollDistance);

  const handleScrollClick = (forwards: boolean) => {
    const el = ref.current;
    if (!el) {
      return;
    }
    setScrollTarget(forwards ? scrollStep : -scrollStep);
  };

  return (
    <div {...otherProps} className={classes.root}>
      <Grid
        container
        direction="row"
        wrap="nowrap"
        className={classes.container}
        ref={ref as any}
      >
        {children}
      </Grid>
      <div
        className={classNames(classes.fade, classes.fadeLeft, {
          [classes.fadeHidden]: scrollLeft === 0,
        })}
      />
      <div
        className={classNames(classes.fade, classes.fadeRight, {
          [classes.fadeHidden]: scrollRight === 0,
        })}
      />
      {scrollLeft > 0 && (
        <IconButton
          title="Scroll Left"
          onClick={() => handleScrollClick(false)}
          className={classNames(classes.button, classes.buttonLeft, {})}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}
      {scrollRight > 0 && (
        <IconButton
          title="Scroll Right"
          onClick={() => handleScrollClick(true)}
          className={classNames(classes.button, classes.buttonRight, {})}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
    </div>
  );
};
