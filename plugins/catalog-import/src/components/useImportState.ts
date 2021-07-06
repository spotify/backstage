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

import { Entity, EntityName } from '@backstage/catalog-model';
import { useReducer } from 'react';
import { AnalyzeResult } from '../api';

// the configuration of the stepper
export type ImportFlows =
  | 'unknown'
  | 'single-location'
  | 'multiple-locations'
  | 'no-location';

// the available states of the stepper
type ImportStateTypes = 'analyze' | 'prepare' | 'review' | 'finish';

// result of the prepare state
export type PrepareResult =
  | {
      type: 'locations';
      locations: Array<{
        target: string;
        entities: EntityName[];
      }>;
    }
  | {
      type: 'repository';
      url: string;
      integrationType: string;
      pullRequest: {
        url: string;
      };
      locations: Array<{
        target: string;
        entities: EntityName[];
      }>;
    };

// result of the review result
export type ReviewResult =
  | {
      type: 'locations';
      locations: Array<{
        target: string;
        entities: Entity[];
      }>;
    }
  | {
      type: 'repository';
      url: string;
      integrationType: string;
      pullRequest: {
        url: string;
      };
      locations: Array<{
        target: string;
        entities: Entity[];
      }>;
    };

// function type for the 'analysis' -> 'prepare'/'review' transition
type onAnalysisFn = (
  flow: ImportFlows,
  url: string,
  result: AnalyzeResult,
  opts?: { prepareResult?: PrepareResult },
) => void;

// function type for the 'prepare' -> 'review' transition
type onPrepareFn = (
  result: PrepareResult,
  opts?: { notRepeatable?: boolean },
) => void;

// function type for the 'review' -> 'finish' transition
type onReviewFn = (result: ReviewResult) => void;

// the type interfaces that are available in each state. every state provides
// already known information and means to go to the next, or the previous step.
type State =
  | {
      activeState: 'analyze';
      onAnalysis: onAnalysisFn;
    }
  | {
      activeState: 'prepare';
      analyzeResult: AnalyzeResult;
      prepareResult?: PrepareResult;
      onPrepare: onPrepareFn;
    }
  | {
      activeState: 'review';
      analyzeResult: AnalyzeResult;
      prepareResult: PrepareResult;
      onReview: onReviewFn;
    }
  | {
      activeState: 'finish';
      analyzeResult: AnalyzeResult;
      prepareResult: PrepareResult;
      reviewResult: ReviewResult;
    };

export type ImportState = State & {
  activeFlow: ImportFlows;
  activeStepNumber: number;
  analysisUrl?: string;

  onGoBack?: () => void;
  onReset: () => void;
};

type ReducerActions =
  | { type: 'onAnalysis'; args: Parameters<onAnalysisFn> }
  | { type: 'onPrepare'; args: Parameters<onPrepareFn> }
  | { type: 'onReview'; args: Parameters<onReviewFn> }
  | { type: 'onGoBack' }
  | { type: 'onReset'; initialUrl?: string };

type ReducerState = {
  activeFlow: ImportFlows;
  activeState: ImportStateTypes;
  analysisUrl?: string;
  analyzeResult?: AnalyzeResult;
  prepareResult?: PrepareResult;
  reviewResult?: ReviewResult;

  previousStates: ImportStateTypes[];
};

function init(initialUrl?: string): ReducerState {
  return {
    activeFlow: 'unknown',
    activeState: 'analyze',
    analysisUrl: initialUrl,
    previousStates: [],
  };
}

function reducer(state: ReducerState, action: ReducerActions): ReducerState {
  switch (action.type) {
    case 'onAnalysis': {
      if (state.activeState !== 'analyze') {
        return state;
      }

      const { activeState, previousStates } = state;
      const [activeFlow, analysisUrl, analyzeResult, opts] = action.args;

      return {
        ...state,
        analysisUrl,
        activeFlow,
        analyzeResult,
        prepareResult: opts?.prepareResult,

        activeState: opts?.prepareResult === undefined ? 'prepare' : 'review',
        previousStates: previousStates.concat(activeState),
      };
    }

    case 'onPrepare': {
      if (state.activeState !== 'prepare') {
        return state;
      }

      const { activeState, previousStates } = state;
      const [prepareResult, opts] = action.args;

      return {
        ...state,
        prepareResult,

        activeState: 'review',
        previousStates: opts?.notRepeatable
          ? []
          : previousStates.concat(activeState),
      };
    }

    case 'onReview': {
      if (state.activeState !== 'review') {
        return state;
      }

      const { activeState, previousStates } = state;
      const [reviewResult] = action.args;

      return {
        ...state,
        reviewResult,

        activeState: 'finish',
        previousStates: previousStates.concat(activeState),
      };
    }

    case 'onGoBack': {
      const { activeState, previousStates } = state;

      return {
        ...state,

        activeState:
          previousStates.length > 0
            ? previousStates[previousStates.length - 1]
            : activeState,
        previousStates: previousStates.slice(0, previousStates.length - 1),
      };
    }

    case 'onReset':
      return {
        ...init(action.initialUrl),

        // we keep the old prepareResult since the form is animated and an
        // undefined value might crash the last step.
        prepareResult: state.prepareResult,
      };

    default:
      throw new Error();
  }
}

/**
 * A hook that manages the state machine of the form. It handles different flows
 * which each can implement up to four states:
 * 1. analyze
 * 2. preview (skippable from analyze->review)
 * 3. review
 * 4. finish
 *
 * @param options options
 */
export const useImportState = (options?: {
  initialUrl?: string;
}): ImportState => {
  const [state, dispatch] = useReducer(reducer, options?.initialUrl, init);

  const { activeFlow, activeState, analysisUrl, previousStates } = state;

  return {
    activeFlow,
    activeState,
    activeStepNumber: ['analyze', 'prepare', 'review', 'finish'].indexOf(
      activeState,
    ),
    analysisUrl: analysisUrl,

    analyzeResult: state.analyzeResult!,
    prepareResult: state.prepareResult!,
    reviewResult: state.reviewResult!,

    onAnalysis: (flow, url, result, opts) =>
      dispatch({
        type: 'onAnalysis',
        args: [flow, url, result, opts],
      }),

    onPrepare: (result, opts) =>
      dispatch({
        type: 'onPrepare',
        args: [result, opts],
      }),

    onReview: result => dispatch({ type: 'onReview', args: [result] }),

    onGoBack:
      previousStates.length > 0
        ? () => dispatch({ type: 'onGoBack' })
        : undefined,

    onReset: () =>
      dispatch({ type: 'onReset', initialUrl: options?.initialUrl }),
  };
};
