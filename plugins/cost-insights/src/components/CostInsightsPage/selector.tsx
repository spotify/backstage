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
import { MapLoadingToProps } from '../../hooks';
import {
  getResetState,
  DefaultLoadingAction,
  getResetStateWithoutInitial,
} from '../../utils/loading';

type CostInsightsPageLoadingProps = {
  loadingActions: Array<string>;
  loadingGroups: boolean;
  loadingBillingDate: boolean;
  loadingInitial: boolean;
  dispatchInitial: (isLoading: boolean) => void;
  dispatchInsights: (isLoading: boolean) => void;
  dispatchNone: (loadingActions: string[]) => void;
  dispatchReset: (loadingActions: string[]) => void;
};

export const mapLoadingToProps: MapLoadingToProps<CostInsightsPageLoadingProps> = ({
  state,
  actions,
  dispatch,
}) => ({
  loadingActions: actions,
  loadingGroups: state[DefaultLoadingAction.UserGroups],
  loadingBillingDate: state[DefaultLoadingAction.LastCompleteBillingDate],
  loadingInitial: state[DefaultLoadingAction.CostInsightsInitial],
  dispatchInitial: (isLoading: boolean) =>
    dispatch({ [DefaultLoadingAction.CostInsightsInitial]: isLoading }),
  dispatchInsights: (isLoading: boolean) =>
    dispatch({ [DefaultLoadingAction.CostInsightsPage]: isLoading }),
  dispatchNone: (loadingActions: string[]) =>
    dispatch(getResetState(loadingActions)),
  dispatchReset: (loadingActions: string[]) =>
    dispatch(getResetStateWithoutInitial(loadingActions)),
});
