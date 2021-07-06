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

import React, { useEffect } from 'react';
import { useAsync } from 'react-use';
import Radar from '../components/Radar';
import {
  techRadarApiRef,
  TechRadarComponentProps,
  TechRadarLoaderResponse,
} from '../api';
import { Entry } from '../utils/types';

import { Progress } from '@backstage/core-components';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';

const useTechRadarLoader = (id: string | undefined) => {
  const errorApi = useApi(errorApiRef);
  const techRadarApi = useApi(techRadarApiRef);

  const { error, value, loading } = useAsync(
    async () => techRadarApi.load(id),
    [techRadarApi],
  );

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  return { loading, value, error };
};

const RadarComponent = (props: TechRadarComponentProps): JSX.Element => {
  const { loading, error, value: data } = useTechRadarLoader(props.id);

  const mapToEntries = (
    loaderResponse: TechRadarLoaderResponse | undefined,
  ): Array<Entry> => {
    return loaderResponse!.entries.map(entry => {
      return {
        id: entry.key,
        quadrant: loaderResponse!.quadrants.find(q => q.id === entry.quadrant)!,
        title: entry.title,
        ring: loaderResponse!.rings.find(
          r => r.id === entry.timeline[0].ringId,
        )!,
        timeline: entry.timeline.map(e => {
          return {
            date: e.date,
            ring: loaderResponse!.rings.find(a => a.id === e.ringId)!,
            description: e.description,
            moved: e.moved,
          };
        }),
        moved: entry.timeline[0].moved,
        description: entry.description || entry.timeline[0].description,
        url: entry.url,
      };
    });
  };

  return (
    <>
      {loading && <Progress />}
      {!loading && !error && (
        <Radar
          {...props}
          rings={data!.rings}
          quadrants={data!.quadrants}
          entries={mapToEntries(data)}
        />
      )}
    </>
  );
};

export default RadarComponent;
