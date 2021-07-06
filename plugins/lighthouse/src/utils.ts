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
import { useLocation } from 'react-router-dom';
import { Website, Audit, LighthouseCategoryId, AuditCompleted } from './api';

export function useQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}

export function formatTime(timestamp: string | Date) {
  let date: Date;
  if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }
  return date.toUTCString();
}

export const CATEGORIES: LighthouseCategoryId[] = [
  'accessibility',
  'performance',
  'seo',
  'best-practices',
];

export const CATEGORY_LABELS: Record<LighthouseCategoryId, string> = {
  accessibility: 'Accessibility',
  performance: 'Performance',
  seo: 'SEO',
  'best-practices': 'Best Practices',
  pwa: 'Progressive Web App',
};

export type SparklinesDataByCategory = Record<LighthouseCategoryId, number[]>;
export function buildSparklinesDataForItem(
  item: Website,
): SparklinesDataByCategory {
  return item.audits
    .filter(
      (audit: Audit): audit is AuditCompleted => audit.status === 'COMPLETED',
    )
    .reduce((scores, audit) => {
      Object.values(audit.categories).forEach(category => {
        scores[category.id] = scores[category.id] || [];
        scores[category.id].unshift(category.score);
      });

      // edge case: if only one audit exists, force a "flat" sparkline
      Object.values(scores).forEach(arr => {
        if (arr.length === 1) arr.push(arr[0]);
      });

      return scores;
    }, {} as SparklinesDataByCategory);
}
