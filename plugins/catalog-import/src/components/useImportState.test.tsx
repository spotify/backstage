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

import { Entity, EntityName } from '@backstage/catalog-model';
import { cleanup } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { AnalyzeResult } from '../api';

import {
  ImportState,
  PrepareResult,
  ReviewResult,
  useImportState,
} from './useImportState';

describe('useImportState', () => {
  const as = <T extends 'analyze' | 'prepare' | 'review' | 'finish'>(
    curr: ImportState,
    _: T,
  ) => curr as Extract<ImportState, { activeState: T }>;

  const locationAP: AnalyzeResult & PrepareResult = {
    type: 'locations',
    locations: [
      {
        target: 'https://0',
        entities: [] as EntityName[],
      },
    ],
  };

  const locationR: ReviewResult = {
    type: 'locations',
    locations: [
      {
        target: 'https://0',
        entities: [] as Entity[],
      },
    ],
  };

  it('should use initial url', async () => {
    const { result } = renderHook(() =>
      useImportState({ initialUrl: 'http://my-url' }),
    );
    await cleanup();

    expect(result.current).toMatchObject({
      activeFlow: 'unknown',
      activeStepNumber: 0,
      analysisUrl: 'http://my-url',
      activeState: 'analyze',
      analyzeResult: undefined,
      prepareResult: undefined,
      reviewResult: undefined,
    });
  });

  describe('onAnalysis & onPrepare & onReview & onReset', () => {
    it('should work', async () => {
      const { result } = renderHook(() => useImportState());
      await cleanup();

      expect(result.current).toMatchObject({
        activeFlow: 'unknown',
        activeStepNumber: 0,
        analysisUrl: undefined,
        activeState: 'analyze',
        analyzeResult: undefined,
        prepareResult: undefined,
        reviewResult: undefined,
      });

      act(() => {
        as(result.current, 'analyze').onAnalysis(
          'single-location',
          'http://my-url',
          locationAP,
        );
      });

      expect(result.current).toMatchObject({
        activeFlow: 'single-location',
        activeStepNumber: 1,
        analysisUrl: 'http://my-url',
        activeState: 'prepare',
        analyzeResult: locationAP,
        prepareResult: undefined,
        reviewResult: undefined,
      });

      act(() => {
        as(result.current, 'prepare').onPrepare(locationAP);
      });

      expect(result.current).toMatchObject({
        activeFlow: 'single-location',
        activeStepNumber: 2,
        analysisUrl: 'http://my-url',
        activeState: 'review',
        analyzeResult: locationAP,
        prepareResult: locationAP,
        reviewResult: undefined,
      });

      act(() => {
        as(result.current, 'review').onReview(locationR);
      });

      expect(result.current).toMatchObject({
        activeFlow: 'single-location',
        activeStepNumber: 3,
        analysisUrl: 'http://my-url',
        activeState: 'finish',
        analyzeResult: locationAP,
        prepareResult: locationAP,
        reviewResult: locationAP,
      });

      act(() => result.current.onReset());

      expect(result.current).toMatchObject({
        activeFlow: 'unknown',
        activeStepNumber: 0,
        analysisUrl: undefined,
        activeState: 'analyze',
        analyzeResult: undefined,
        prepareResult: locationR,
        reviewResult: undefined,
      });
    });

    it('should work skipped', async () => {
      const { result } = renderHook(() => useImportState());
      await cleanup();

      expect(result.current).toMatchObject({
        activeFlow: 'unknown',
        activeStepNumber: 0,
        analysisUrl: undefined,
        activeState: 'analyze',
        analyzeResult: undefined,
        prepareResult: undefined,
        reviewResult: undefined,
      });

      act(() => {
        as(result.current, 'analyze').onAnalysis(
          'single-location',
          'http://my-url',
          locationAP,
          {
            prepareResult: locationAP,
          },
        );
      });

      expect(result.current).toMatchObject({
        activeFlow: 'single-location',
        activeStepNumber: 2,
        analysisUrl: 'http://my-url',
        activeState: 'review',
        analyzeResult: locationAP,
        prepareResult: locationAP,
        reviewResult: undefined,
      });

      act(() => {
        as(result.current, 'review').onReview(locationR);
      });

      expect(result.current).toMatchObject({
        activeFlow: 'single-location',
        activeStepNumber: 3,
        analysisUrl: 'http://my-url',
        activeState: 'finish',
        analyzeResult: locationAP,
        prepareResult: locationAP,
        reviewResult: locationR,
      });
    });

    it('should ignore on invalid state', async () => {
      const { result } = renderHook(() => useImportState());
      await cleanup();

      // state 'analyze'
      act(() => {
        as(result.current, 'prepare').onPrepare(locationAP);
        as(result.current, 'review').onReview(locationR);
      });

      expect(result.current.activeState).toBe('analyze');
      expect(result.current.activeFlow).toBe('unknown');

      // switch state to 'prepare'
      act(() =>
        as(result.current, 'analyze').onAnalysis(
          'single-location',
          'http://my-url',
          locationAP,
        ),
      );

      // state 'prepare'
      act(() => {
        as(result.current, 'analyze').onAnalysis(
          'multiple-locations',
          'http://my-url',
          locationAP,
        );
        as(result.current, 'review').onReview(locationR);
      });

      expect(result.current.activeState).toBe('prepare');
      expect(result.current.activeFlow).toBe('single-location');

      // switch to 'review'
      act(() => as(result.current, 'prepare').onPrepare(locationAP));

      // state 'review'
      act(() => {
        as(result.current, 'analyze').onAnalysis(
          'multiple-locations',
          'http://my-url',
          locationAP,
        );
        as(result.current, 'prepare').onPrepare({
          type: 'locations',
          locations: [],
        });
      });

      expect(result.current.activeState).toBe('review');
      expect(result.current.activeFlow).toBe('single-location');
      expect(
        as(result.current, 'prepare').prepareResult!.locations,
      ).not.toEqual([]);

      // switch to 'finish'
      act(() => as(result.current, 'review').onReview(locationR));

      expect(result.current.activeState).toBe('finish');
      expect(result.current.activeFlow).toBe('single-location');
    });
  });

  describe('onGoBack', () => {
    it('should work', async () => {
      const { result } = renderHook(() => useImportState());
      await cleanup();

      expect(result.current.activeStepNumber).toBe(0);
      expect(result.current.onGoBack).toBeUndefined();

      act(() =>
        as(result.current, 'analyze').onAnalysis(
          'single-location',
          'http://my-url',
          locationAP,
        ),
      );
      expect(result.current.activeStepNumber).toBe(1);

      expect(result.current.onGoBack).not.toBeUndefined();
      act(() => result.current.onGoBack!());
      expect(result.current.activeStepNumber).toBe(0);

      act(() =>
        as(result.current, 'analyze').onAnalysis(
          'single-location',
          'http://my-url',
          locationAP,
        ),
      );
      act(() => as(result.current, 'prepare').onPrepare(locationAP));
      expect(result.current.activeStepNumber).toBe(2);

      expect(result.current.onGoBack).not.toBeUndefined();
      act(() => result.current.onGoBack!());
      expect(result.current.activeStepNumber).toBe(1);

      act(() => as(result.current, 'prepare').onPrepare(locationAP));
      act(() => as(result.current, 'review').onReview(locationR));
      expect(result.current.activeStepNumber).toBe(3);
    });

    it('should work for skipped', async () => {
      const { result } = renderHook(() => useImportState());
      await cleanup();

      expect(result.current.activeStepNumber).toBe(0);
      expect(result.current.onGoBack).toBeUndefined();

      act(() =>
        as(result.current, 'analyze').onAnalysis(
          'single-location',
          'http://my-url',
          locationAP,
          {
            prepareResult: locationAP,
          },
        ),
      );
      expect(result.current.activeStepNumber).toBe(2);
      expect(result.current.onGoBack).not.toBeUndefined();

      act(() => result.current.onGoBack!());
      expect(result.current.activeStepNumber).toBe(0);
      expect(result.current.onGoBack).toBeUndefined();
    });

    describe('should consider prepareNotRepeatable', () => {
      it('as true', async () => {
        const { result } = renderHook(() => useImportState());
        await cleanup();

        expect(result.current.onGoBack).toBeUndefined();

        act(() =>
          as(result.current, 'analyze').onAnalysis(
            'multiple-locations',
            'http://my-url',
            locationAP,
          ),
        );
        act(() =>
          as(result.current, 'prepare').onPrepare(locationAP, {
            notRepeatable: true,
          }),
        );

        expect(result.current.onGoBack).toBeUndefined();
      });

      it('as false', async () => {
        const { result } = renderHook(() => useImportState());
        await cleanup();

        expect(result.current.onGoBack).toBeUndefined();

        act(() =>
          as(result.current, 'analyze').onAnalysis(
            'multiple-locations',
            'http://my-url',
            locationAP,
          ),
        );
        act(() =>
          as(result.current, 'prepare').onPrepare(locationAP, {
            notRepeatable: false,
          }),
        );

        expect(result.current.onGoBack).not.toBeUndefined();
      });
    });
  });
});
