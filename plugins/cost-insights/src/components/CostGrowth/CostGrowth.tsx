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
import classnames from 'classnames';
import {
  ChangeStatistic,
  CurrencyType,
  Duration,
  EngineerThreshold,
  GrowthType,
} from '../../types';
import { rateOf } from '../../utils/currency';
import { growthOf } from '../../utils/change';
import { useCostGrowthStyles as useStyles } from '../../utils/styles';
import { formatPercent, formatCurrency } from '../../utils/formatters';
import { indefiniteArticleOf } from '../../utils/grammar';
import { useConfig, useCurrency } from '../../hooks';
import { notEmpty } from '../../utils/assert';

export type CostGrowthProps = {
  change: ChangeStatistic;
  duration: Duration;
};

export const CostGrowth = ({ change, duration }: CostGrowthProps) => {
  const styles = useStyles();
  const { engineerCost } = useConfig();
  const [currency] = useCurrency();

  // Only display costs in absolute values
  const amount = Math.abs(change.amount);
  const ratio = Math.abs(change.ratio ?? NaN);

  const rate = rateOf(engineerCost, duration);
  const engineers = amount / rate;
  const converted = amount / (currency.rate ?? rate);

  // If a ratio cannot be calculated, don't format.
  const growth = notEmpty(change.ratio)
    ? growthOf({ ratio: change.ratio, amount: engineers })
    : null;
  // Determine if growth is significant enough to highlight
  const classes = classnames({
    [styles.excess]: growth === GrowthType.Excess,
    [styles.savings]: growth === GrowthType.Savings,
  });

  if (engineers < EngineerThreshold) {
    return <span className={classes}>Negligible</span>;
  }

  if (currency.kind === CurrencyType.USD) {
    // Do not display percentage if ratio cannot be calculated
    if (isNaN(ratio)) {
      return (
        <span className={classes}>
          ~{currency.prefix}
          {formatCurrency(converted)}
        </span>
      );
    }

    return (
      <span className={classes}>
        {formatPercent(ratio)} or ~{currency.prefix}
        {formatCurrency(converted)}
      </span>
    );
  }

  if (amount < 1) {
    return (
      <span className={classes}>
        less than {indefiniteArticleOf(['a', 'an'], currency.unit)}
      </span>
    );
  }

  // Do not display percentage if ratio cannot be calculated
  if (isNaN(ratio)) {
    return (
      <span className={classes}>
        ~{formatCurrency(converted, currency.unit)}
      </span>
    );
  }

  return (
    <span className={classes}>
      {formatPercent(ratio)} or ~{formatCurrency(converted, currency.unit)}
    </span>
  );
};
