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
import { BackstagePalette, BackstageTheme } from '@backstage/theme';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';

type CostInsightsTooltipOptions = {
  background: string;
  color: string;
};

type CostInsightsPaletteAdditions = {
  blue: string;
  lightBlue: string;
  darkBlue: string;
  magenta: string;
  yellow: string;
  tooltip: CostInsightsTooltipOptions;
  navigationText: string;
  alertBackground: string;
  dataViz: string[];
};

export type CostInsightsPalette = BackstagePalette &
  CostInsightsPaletteAdditions;

export type CostInsightsPaletteOptions = PaletteOptions &
  CostInsightsPaletteAdditions;

export interface CostInsightsThemeOptions extends PaletteOptions {
  palette: CostInsightsPaletteOptions;
}

export interface CostInsightsTheme extends BackstageTheme {
  palette: CostInsightsPalette;
}
