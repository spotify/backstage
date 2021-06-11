/*
 * Copyright 2020 Spotify AB
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

import React, { useMemo, useState } from 'react';
import {
  ContentRenderer,
  TooltipProps as RechartsTooltipProps,
  RechartsFunction,
} from 'recharts';
import pluralize from 'pluralize';
import { Box, Typography } from '@material-ui/core';
import { default as FullScreenIcon } from '@material-ui/icons/Fullscreen';
import { LegendItem } from '../LegendItem';
import { ProductEntityDialog } from './ProductEntityDialog';
import { CostGrowth, CostGrowthIndicator } from '../CostGrowth';
import {
  BarChart,
  BarChartLegend,
  BarChartTooltip,
  BarChartTooltipItem,
  BarChartLegendOptions,
} from '../BarChart';
import {
  findAlways,
  notEmpty,
  isUndefined,
  findAnyKey,
  assertAlways,
} from '../../utils/assert';
import { formatPeriod, formatChange } from '../../utils/formatters';
import {
  titleOf,
  tooltipItemOf,
  resourceOf,
  isInvalid,
  isLabeled,
  isUnlabeled,
} from '../../utils/graphs';
import {
  useProductInsightsChartStyles as useStyles,
  useBarChartLayoutStyles as useLayoutStyles,
} from '../../utils/styles';
import { Duration, Entity, Maybe } from '../../types';
import { choose } from '../../utils/change';

export type ProductInsightsChartProps = {
  billingDate: string;
  entity: Entity;
  duration: Duration;
};

export const ProductInsightsChart = ({
  billingDate,
  entity,
  duration,
}: ProductInsightsChartProps) => {
  const classes = useStyles();
  const layoutClasses = useLayoutStyles();

  // Only a single entities Record for the root product entity is supported
  const entities = useMemo(() => {
    const entityLabel = assertAlways(findAnyKey(entity.entities));
    return entity.entities[entityLabel] ?? [];
  }, [entity]);

  const [activeLabel, setActive] = useState<Maybe<string>>();
  const [selectLabel, setSelected] = useState<Maybe<string>>();
  const isSelected = useMemo(() => !isUndefined(selectLabel), [selectLabel]);

  const isClickable = useMemo(() => {
    const breakdowns = Object.keys(
      entities.find(e => e.id === activeLabel)?.entities ?? {},
    );
    return breakdowns.length > 0;
  }, [entities, activeLabel]);

  const costStart = entity.aggregation[0];
  const costEnd = entity.aggregation[1];
  const resources = entities.map(resourceOf);

  const options: Partial<BarChartLegendOptions> = {
    previousName: formatPeriod(duration, billingDate, false),
    currentName: formatPeriod(duration, billingDate, true),
  };

  const onMouseMove: RechartsFunction = (
    data: Record<'activeLabel', string | undefined>,
  ) => {
    if (isLabeled(data)) {
      setActive(data.activeLabel!);
    } else if (isUnlabeled(data)) {
      setActive(null);
    } else {
      setActive(undefined);
    }
  };

  const onClick: RechartsFunction = (data: Record<'activeLabel', string>) => {
    if (isLabeled(data)) {
      setSelected(data.activeLabel);
    } else if (isUnlabeled(data)) {
      setSelected(null);
    } else {
      setSelected(undefined);
    }
  };

  const renderProductInsightsTooltip: ContentRenderer<RechartsTooltipProps> = ({
    label,
    payload = [],
  }) => {
    /* Labels and payloads may be undefined or empty */
    if (isInvalid({ label, payload })) return null;

    /*
     *  recharts coerces null values to strings
     *  entity       -> resource       -> payload
     *  { id: null } -> { name: null } -> { label: '' }
     */
    const id = label === '' ? null : label;

    const title = titleOf(label);
    const items = payload.map(tooltipItemOf).filter(notEmpty);

    const activeEntity = findAlways(entities, e => e.id === id);
    const breakdowns = Object.keys(activeEntity.entities);

    if (breakdowns.length) {
      const subtitle = breakdowns
        .map(b => pluralize(b, activeEntity.entities[b].length, true))
        .join(', ');
      return (
        <BarChartTooltip
          title={title}
          subtitle={subtitle}
          topRight={
            !!activeEntity.change.ratio && (
              <CostGrowthIndicator
                formatter={formatChange}
                change={activeEntity.change}
                className={classes.indicator}
              />
            )
          }
          actions={
            <Box className={classes.actions}>
              <FullScreenIcon />
              <Typography>Click for breakdown</Typography>
            </Box>
          }
        >
          {items.map((item, index) => (
            <BarChartTooltipItem key={`${item.label}-${index}`} item={item} />
          ))}
        </BarChartTooltip>
      );
    }

    // If an entity doesn't have any sub-entities, there aren't any costs to break down.
    return (
      <BarChartTooltip
        title={title}
        topRight={
          !!activeEntity.change.ratio && (
            <CostGrowthIndicator
              formatter={formatChange}
              change={activeEntity.change}
              className={classes.indicator}
            />
          )
        }
        content={
          id
            ? null
            : "This product has costs that are not labeled and therefore can't be attributed to a specific entity."
        }
      >
        {items.map((item, index) => (
          <BarChartTooltipItem key={`${item.label}-${index}`} item={item} />
        ))}
      </BarChartTooltip>
    );
  };

  const barChartProps = isClickable ? { onClick } : {};

  return (
    <Box className={layoutClasses.wrapper}>
      <BarChartLegend costStart={costStart} costEnd={costEnd} options={options}>
        <LegendItem
          title={choose(['Cost Savings', 'Cost Excess'], entity.change)}
        >
          <CostGrowth change={entity.change} duration={duration} />
        </LegendItem>
      </BarChartLegend>
      <BarChart
        resources={resources}
        tooltip={renderProductInsightsTooltip}
        onMouseMove={onMouseMove}
        options={options}
        {...barChartProps}
      />
      {isSelected && entities.length && (
        <ProductEntityDialog
          open={isSelected}
          onClose={() => setSelected(undefined)}
          entity={findAlways(entities, e => e.id === selectLabel)}
          options={options}
        />
      )}
    </Box>
  );
};
