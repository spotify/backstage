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

import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import pluralize from 'pluralize';
import { Typography } from '@material-ui/core';
import { default as Alert } from '@material-ui/lab/Alert';
import { PeriodSelect } from '../PeriodSelect';
import { ProductInsightsChart } from './ProductInsightsChart';
import { useProductInsightsCardStyles as useStyles } from '../../utils/styles';
import { DefaultLoadingAction } from '../../utils/loading';
import { Duration, Entity, Maybe, Product } from '../../types';
import {
  MapLoadingToProps,
  useLastCompleteBillingDate,
  useLoading,
} from '../../hooks';
import { findAnyKey } from '../../utils/assert';
import { ScrollAnchor } from '../../utils/scroll';
import { InfoCard } from '@backstage/core-components';

type LoadingProps = (isLoading: boolean) => void;

export type ProductInsightsCardProps = {
  product: Product;
  initialState: {
    entity: Maybe<Entity>;
    duration: Duration;
  };
  onSelectAsync: (product: Product, duration: Duration) => Promise<Entity>;
};

const mapLoadingToProps: MapLoadingToProps<LoadingProps> = ({ dispatch }) => (
  isLoading: boolean,
) => dispatch({ [DefaultLoadingAction.CostInsightsProducts]: isLoading });

export const ProductInsightsCard = ({
  initialState,
  product,
  onSelectAsync,
}: PropsWithChildren<ProductInsightsCardProps>) => {
  const classes = useStyles();
  const mountedRef = useRef(false);
  const [error, setError] = useState<Maybe<Error>>(null);
  const dispatchLoading = useLoading(mapLoadingToProps);
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const [entity, setEntity] = useState<Maybe<Entity>>(initialState.entity);
  const [duration, setDuration] = useState<Duration>(initialState.duration);

  /* eslint-disable react-hooks/exhaustive-deps */
  const dispatchLoadingProduct = useCallback(dispatchLoading, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    async function handleOnSelectAsync() {
      dispatchLoadingProduct(true);
      try {
        const e = await onSelectAsync(product, duration);
        setEntity(e);
      } catch (e) {
        setEntity(null);
        setError(e);
      } finally {
        dispatchLoadingProduct(false);
      }
    }

    if (mountedRef.current) {
      handleOnSelectAsync();
    } else {
      mountedRef.current = true;
    }
  }, [product, duration, onSelectAsync, dispatchLoadingProduct]);

  // Only a single entities Record for the root product entity is supported
  const entityKey = findAnyKey(entity?.entities);
  const entities = entityKey ? entity!.entities[entityKey] : [];

  const subheader =
    entityKey && entities.length
      ? `${pluralize(entityKey, entities.length, true)}, sorted by cost`
      : null;
  const headerProps = {
    classes: classes,
    action: <PeriodSelect duration={duration} onSelect={setDuration} />,
  };

  if (error || !entity) {
    return (
      <InfoCard title={product.name} headerProps={headerProps}>
        <ScrollAnchor id={product.kind} />
        <Alert severity="error">
          {error
            ? error.message
            : `Error: Could not fetch product insights for ${product.name}`}
        </Alert>
      </InfoCard>
    );
  }

  return (
    <InfoCard
      title={product.name}
      subheader={subheader}
      headerProps={headerProps}
    >
      <ScrollAnchor id={product.kind} />
      {entities.length ? (
        <ProductInsightsChart
          entity={entity}
          duration={duration}
          billingDate={lastCompleteBillingDate}
        />
      ) : (
        <Typography>
          There are no {product.name} costs within this time frame for your
          team's projects.
        </Typography>
      )}
    </InfoCard>
  );
};
