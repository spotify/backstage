/*
 * Copyright 2021 The Backstage Authors
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

import { getDecimalNumber } from '../../helpers/getDecimalNumber';
import { useGetReleaseTimes } from '../hooks/useGetReleaseTimes';

export function AverageReleaseTime({
  averageReleaseTime,
}: {
  averageReleaseTime: ReturnType<
    typeof useGetReleaseTimes
  >['averageReleaseTime'];
}) {
  if (averageReleaseTime.length === 0) {
    return <>-</>;
  }

  const average = averageReleaseTime.reduce(
    (acc, { daysWithHours }) => {
      acc.daysWithHours += daysWithHours / averageReleaseTime.length;
      return acc;
    },
    { daysWithHours: 0 },
  );

  const days = Math.floor(average.daysWithHours);
  const hours = getDecimalNumber((average.daysWithHours - days) * 24, 1);

  return (
    <>
      {days} days {hours} hours
    </>
  );
}
