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

import { useEffect, useState } from 'react';
import { useAsync, useAsyncFn } from 'react-use';
import { DateTime } from 'luxon';
import { getReleaseCommitPairs } from '../helpers/getReleaseCommitPairs';

import { gitReleaseManagerApiRef } from '../../../../api/serviceApiRef';
import { useProjectContext } from '../../../../contexts/ProjectContext';
import { useReleaseStatsContext } from '../../contexts/ReleaseStatsContext';
import { getTagDates } from '../../helpers/getTagDates';
import { useApi } from '@backstage/core-plugin-api';

export type ReleaseCommitPairs = Array<{
  baseVersion: string;
  startCommit: {
    tagName: string;
    tagSha: string;
    tagType: 'tag' | 'commit';
  };
  endCommit: {
    tagName: string;
    tagSha: string;
    tagType: 'tag' | 'commit';
  };
}>;

type ReleaseTime = {
  version: string;
  daysWithHours: number;
  days: number;
  hours: number;
  startCommitCreatedAt?: string;
  endCommitCreatedAt?: string;
};

export function useGetReleaseTimes() {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { project } = useProjectContext();
  const { releaseStats } = useReleaseStatsContext();
  const [averageReleaseTime, setAverageReleaseTime] = useState<ReleaseTime[]>(
    [],
  );
  const [progress, setProgress] = useState(0);
  const { releaseCommitPairs } = getReleaseCommitPairs({ releaseStats });

  const [releaseTimeResult, run] = useAsyncFn(() => {
    setProgress(0);
    return getAndSetReleaseTime({ pairIndex: 0 });
  });

  useAsync(async () => {
    if (averageReleaseTime.length === 0) return;
    if (releaseCommitPairs.length === averageReleaseTime.length) return;

    await getAndSetReleaseTime({ pairIndex: averageReleaseTime.length });
  }, [releaseTimeResult.value, averageReleaseTime]);

  useEffect(() => {
    const unboundedProgress = Math.round(
      (averageReleaseTime.length / releaseCommitPairs.length) * 100,
    );
    const boundedProgress = unboundedProgress > 100 ? 100 : unboundedProgress;

    setProgress(boundedProgress);
  }, [averageReleaseTime.length, releaseCommitPairs.length]);

  async function getAndSetReleaseTime({ pairIndex }: { pairIndex: number }) {
    const { baseVersion, startCommit, endCommit } = releaseCommitPairs[
      pairIndex
    ];

    const {
      startDate: startCommitCreatedAt,
      endDate: endCommitCreatedAt,
    } = await getTagDates({
      pluginApiClient,
      project,
      startTag: startCommit,
      endTag: endCommit,
    });

    const releaseTime: ReleaseTime = {
      version: baseVersion,
      daysWithHours: 0,
      days: 0,
      hours: 0,
      startCommitCreatedAt,
      endCommitCreatedAt,
    };

    if (startCommitCreatedAt && endCommitCreatedAt) {
      const { days: luxDays = 0, hours: luxHours = 0 } = DateTime.fromISO(
        endCommitCreatedAt,
      )
        .diff(DateTime.fromISO(startCommitCreatedAt), ['days', 'hours'])
        .toObject();

      releaseTime.daysWithHours = luxDays + luxHours / 24;
      releaseTime.days = luxDays;
      releaseTime.hours = luxHours;
    }

    setAverageReleaseTime([...averageReleaseTime, releaseTime]);
  }

  return {
    releaseCommitPairs,
    averageReleaseTime,
    progress,
    run,
  };
}
