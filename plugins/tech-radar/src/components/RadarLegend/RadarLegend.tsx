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
import { makeStyles, Theme } from '@material-ui/core';
import type { Quadrant, Ring, Entry } from '../../utils/types';
import { WithLink } from '../../utils/components';
import { RadarDescription } from '../RadarDescription';

type Segments = {
  [k: number]: { [k: number]: Entry[] };
};

export type Props = {
  quadrants: Quadrant[];
  rings: Ring[];
  entries: Entry[];
  onEntryMouseEnter?: (entry: Entry) => void;
  onEntryMouseLeave?: (entry: Entry) => void;
};

const useStyles = makeStyles<Theme>(theme => ({
  quadrant: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  quadrantHeading: {
    pointerEvents: 'none',
    userSelect: 'none',
    marginTop: 0,
    marginBottom: theme.spacing(8 / (18 * 0.375)),
    fontSize: '18px',
  },
  rings: {
    columns: 3,
  },
  ring: {
    breakInside: 'avoid-column',
    pageBreakInside: 'avoid',
    '-webkit-column-break-inside': 'avoid',
    fontSize: '12px',
  },
  ringHeading: {
    pointerEvents: 'none',
    userSelect: 'none',
    marginTop: 0,
    marginBottom: theme.spacing(8 / (12 * 0.375)),
    fontSize: '12px',
    fontWeight: 800,
  },
  ringList: {
    listStylePosition: 'inside',
    marginTop: 0,
    paddingLeft: 0,
    fontVariantNumeric: 'proportional-nums',
    '-moz-font-feature-settings': 'pnum',
    '-webkit-font-feature-settings': 'pnum',
    'font-feature-settings': 'pnum',
  },
  entry: {
    pointerEvents: 'visiblePainted',
    userSelect: 'none',
    fontSize: '11px',
  },
  entryLink: {
    pointerEvents: 'visiblePainted',
  },
}));

const RadarLegend = (props: Props): JSX.Element => {
  const classes = useStyles(props);

  const getSegment = (
    segmented: Segments,
    quadrant: Quadrant,
    ring: Ring,
    ringOffset = 0,
  ) => {
    const quadrantIndex = quadrant.index;
    const ringIndex = ring.index;
    const segmentedData =
      quadrantIndex === undefined ? {} : segmented[quadrantIndex] || {};
    return ringIndex === undefined
      ? []
      : segmentedData[ringIndex + ringOffset] || [];
  };

  type RadarLegendRingProps = {
    ring: Ring;
    entries: Entry[];
    onEntryMouseEnter?: Props['onEntryMouseEnter'];
    onEntryMouseLeave?: Props['onEntryMouseEnter'];
  };

  type RadarLegendLinkProps = {
    url?: string;
    description?: string;
    title?: string;
  };

  const RadarLegendLink = ({
    url,
    description,
    title,
  }: RadarLegendLinkProps) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const toggle = () => {
      setOpen(!open);
    };

    if (description) {
      return (
        <>
          <span
            className={classes.entryLink}
            onClick={handleClickOpen}
            role="button"
            tabIndex={0}
            onKeyPress={toggle}
          >
            <span className={classes.entry}>{title}</span>
          </span>
          {open && (
            <RadarDescription
              open={open}
              onClose={handleClose}
              title={title ? title : 'no title'}
              url={url}
              description={description}
            />
          )}
        </>
      );
    }
    return (
      <WithLink url={url} className={classes.entryLink}>
        <span className={classes.entry}>{title}</span>
      </WithLink>
    );
  };

  const RadarLegendRing = ({
    ring,
    entries,
    onEntryMouseEnter,
    onEntryMouseLeave,
  }: RadarLegendRingProps) => {
    return (
      <div data-testid="radar-ring" key={ring.id} className={classes.ring}>
        <h3 className={classes.ringHeading}>{ring.name}</h3>
        {entries.length === 0 ? (
          <p>(empty)</p>
        ) : (
          <ol className={classes.ringList}>
            {entries.map(entry => (
              <li
                key={entry.id}
                value={(entry.index || 0) + 1}
                onMouseEnter={
                  onEntryMouseEnter && (() => onEntryMouseEnter(entry))
                }
                onMouseLeave={
                  onEntryMouseLeave && (() => onEntryMouseLeave(entry))
                }
              >
                <RadarLegendLink
                  url={entry.url}
                  title={entry.title}
                  description={entry.description}
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  };

  type RadarLegendQuadrantProps = {
    segments: Segments;
    quadrant: Quadrant;
    rings: Ring[];
    onEntryMouseEnter: Props['onEntryMouseEnter'];
    onEntryMouseLeave: Props['onEntryMouseLeave'];
  };

  const RadarLegendQuadrant = ({
    segments,
    quadrant,
    rings,
    onEntryMouseEnter,
    onEntryMouseLeave,
  }: RadarLegendQuadrantProps) => {
    return (
      <foreignObject
        key={quadrant.id}
        x={quadrant.legendX}
        y={quadrant.legendY}
        width={quadrant.legendWidth}
        height={quadrant.legendHeight}
        data-testid="radar-quadrant"
      >
        <div className={classes.quadrant}>
          <h2 className={classes.quadrantHeading}>{quadrant.name}</h2>
          <div className={classes.rings}>
            {rings.map(ring => (
              <RadarLegendRing
                key={ring.id}
                ring={ring}
                entries={getSegment(segments, quadrant, ring)}
                onEntryMouseEnter={onEntryMouseEnter}
                onEntryMouseLeave={onEntryMouseLeave}
              />
            ))}
          </div>
        </div>
      </foreignObject>
    );
  };

  const setupSegments = (entries: Entry[]) => {
    const segments: Segments = {};

    for (const entry of entries) {
      const quadrantIndex = entry.quadrant.index;
      const ringIndex = entry.ring.index;
      let quadrantData: { [k: number]: Entry[] } = {};
      if (quadrantIndex !== undefined) {
        if (segments[quadrantIndex] === undefined) {
          segments[quadrantIndex] = {};
        }

        quadrantData = segments[quadrantIndex];
      }

      let ringData = [];
      if (ringIndex !== undefined) {
        if (quadrantData[ringIndex] === undefined) {
          quadrantData[ringIndex] = [];
        }

        ringData = quadrantData[ringIndex];
      }

      ringData.push(entry);
    }

    return segments;
  };

  const {
    quadrants,
    rings,
    entries,
    onEntryMouseEnter,
    onEntryMouseLeave,
  } = props;

  const segments: Segments = setupSegments(entries);

  return (
    <g data-testid="radar-legend">
      {quadrants.map(quadrant => (
        <RadarLegendQuadrant
          key={quadrant.id}
          segments={segments}
          quadrant={quadrant}
          rings={rings}
          onEntryMouseEnter={onEntryMouseEnter}
          onEntryMouseLeave={onEntryMouseLeave}
        />
      ))}
    </g>
  );
};

export default RadarLegend;
