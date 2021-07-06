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
import {
  createStyles,
  emphasize,
  darken,
  getLuminance,
  lighten,
  makeStyles,
} from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import { CostInsightsTheme, CostInsightsThemeOptions } from '../types';

export const costInsightsLightTheme = {
  palette: {
    blue: '#509AF5',
    lightBlue: '#9BF0E1',
    darkBlue: '#4101F5',
    magenta: '#DC148C',
    yellow: '#FFC864',
    tooltip: {
      background: '#171717',
      color: '#DDD',
    },
    navigationText: '#b5b5b5',
    alertBackground: 'rgba(219, 219, 219, 0.13)',
    dataViz: [
      '#509BF5',
      '#4B917D',
      '#FF6437',
      '#F573A0',
      '#F59B23',
      '#B49BC8',
      '#C39687',
      '#A0C3D2',
      '#FFC864',
      '#BABABA',
    ],
  },
} as CostInsightsThemeOptions;

// Higher tonal values from light theme (Google recommends 600 -> 200)
// https://material.io/design/color/the-color-system.html#tools-for-picking-colors
export const costInsightsDarkTheme = {
  palette: {
    blue: '#77b8f9',
    lightBlue: '#d8f9f4',
    darkBlue: '#b595fd',
    magenta: '#ee93cd',
    yellow: '#fff2da',
    tooltip: {
      background: '#EEE',
      color: '#424242',
    },
    navigationText: '#b5b5b5',
    alertBackground: 'rgba(32, 32, 32, 0.13)',
    dataViz: [
      '#8accff',
      '#7bc2ac',
      '#ff9664',
      '#ffa5d1',
      '#ffcc57',
      '#e6ccfb',
      '#f7c7b7',
      '#d2f6ff',
      '#fffb94',
      '#ececec',
    ],
  },
} as CostInsightsThemeOptions;

// The opposite of MUI's emphasize function - darken darks, lighten lights
export function brighten(color: string, coefficient = 0.2) {
  return getLuminance(color) > 0.5
    ? lighten(color, coefficient)
    : darken(color, coefficient);
}

export const useCostOverviewStyles = (theme: CostInsightsTheme) => ({
  axis: {
    fill: theme.palette.text.primary,
  },
  container: {
    height: 450,
    width: 1200,
  },
  cartesianGrid: {
    stroke: theme.palette.textVerySubtle,
  },
  chart: {
    margin: {
      right: 30,
      top: 16,
    },
  },
  yAxis: {
    width: 75,
  },
});

export const useOverviewTabsStyles = makeStyles<CostInsightsTheme>(
  (theme: CostInsightsTheme) => ({
    default: {
      padding: theme.spacing(2),
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.text.secondary,
      textTransform: 'uppercase',
    },
    selected: {
      color: theme.palette.text.primary,
    },
  }),
);

export const useBarChartStyles = (theme: CostInsightsTheme) => ({
  axis: {
    fill: theme.palette.text.primary,
  },
  barChart: {
    margin: {
      left: 16,
      right: 16,
    },
  },
  cartesianGrid: {
    stroke: theme.palette.textVerySubtle,
  },
  cursor: {
    fill: theme.palette.textVerySubtle,
    fillOpacity: 0.3,
  },
  container: {
    height: 400,
    width: 1200,
  },
  infoIcon: {
    marginLeft: 2,
    fontSize: '1.25em',
  },
  xAxis: {
    height: 50,
  },
});

export const useBarChartLayoutStyles = makeStyles<BackstageTheme>(theme =>
  createStyles({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    legend: {
      paddingBottom: theme.spacing(2),
    },
  }),
);

export const useBarChartStepperButtonStyles = makeStyles<CostInsightsTheme>(
  (theme: CostInsightsTheme) =>
    createStyles({
      root: {
        ...theme.typography.button,
        boxSizing: 'border-box',
        transition: theme.transitions.create(
          ['background-color', 'box-shadow', 'border'],
          {
            duration: theme.transitions.duration.short,
          },
        ),
        borderRadius: '50%',
        padding: 0,
        width: 40,
        height: 40,
        boxShadow: theme.shadows[6],
        '&:active': {
          boxShadow: theme.shadows[12],
        },
        color: theme.palette.text.primary,
        backgroundColor: lighten(theme.palette.background.default, 0.1),
        '&:hover': {
          backgroundColor: lighten(theme.palette.background.default, 0.2),
          textDecoration: 'none',
        },
      },
    }),
);

export const useBarChartLabelStyles = makeStyles<BackstageTheme>(theme =>
  createStyles({
    foreignObject: {
      textAlign: 'center',
    },
    label: {
      fontWeight: theme.typography.fontWeightBold,
      display: 'block',
      textDecoration: 'none',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    infoIcon: {
      marginLeft: 2,
      fontSize: '1.25em',
    },
    button: {
      textTransform: 'none',
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.fontSize,
    },
  }),
);

export const useCostInsightsStyles = makeStyles<BackstageTheme>(theme => ({
  h6Subtle: {
    ...theme.typography.h6,
    fontWeight: 'normal',
    color: theme.palette.textSubtle,
  },
}));

export const useCostInsightsTabsStyles = makeStyles<BackstageTheme>(
  (theme: BackstageTheme) => ({
    tabs: {
      borderBottom: `1px solid ${theme.palette.textVerySubtle}`,
      backgroundColor: brighten(theme.palette.background.default),
      padding: theme.spacing(0, 4),
    },
    tab: {
      minHeight: 68,
      minWidth: 180,
      padding: theme.spacing(1, 4),
      '&:hover': {
        color: 'inherit',
        backgroundColor: 'inherit',
      },
    },
    indicator: {
      backgroundColor: theme.palette.navigation.indicator,
      height: 4,
    },
    tabLabel: {
      display: 'flex',
      alignItems: 'center',
    },
    tabLabelText: {
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeightBold,
    },
    menuItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minWidth: 180,
      padding: theme.spacing(2, 2),
    },
    menuItemSelected: {
      backgroundColor: lighten(theme.palette.background.default, 0.3),
    },
  }),
);

export const useAlertCardActionHeaderStyles = makeStyles<BackstageTheme>(
  (theme: BackstageTheme) =>
    createStyles({
      root: {
        paddingBottom: theme.spacing(2),
        borderRadius: 'unset',
      },
      title: {
        fontSize: theme.typography.fontSize,
        fontWeight: theme.typography.fontWeightBold,
        lineHeight: 1.5,
      },
      action: {
        margin: 0,
      },
    }),
);

export const useCostGrowthStyles = makeStyles<BackstageTheme>(
  (theme: BackstageTheme) =>
    createStyles({
      excess: {
        color: theme.palette.status.error,
      },
      savings: {
        color: theme.palette.status.ok,
      },
      indicator: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
    }),
);

export const useCostGrowthLegendStyles = makeStyles<BackstageTheme>(theme => ({
  h5: {
    ...theme.typography.h5,
    fontWeight: 500,
    padding: 0,
  },
  marker: {
    display: 'inherit',
    marginRight: theme.spacing(1),
  },
  helpIcon: {
    display: 'inherit',
  },
  title: {
    ...theme.typography.overline,
    fontWeight: 500,
    lineHeight: 0,
    marginRight: theme.spacing(1),
    color: theme.palette.textSubtle,
  },
  tooltip: {
    display: 'block',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.navigation.background,
  },
  tooltipText: {
    color: theme.palette.background.default,
    fontSize: theme.typography.fontSize,
    lineHeight: 1.5,
  },
}));

export const useBarChartStepperStyles = makeStyles<BackstageTheme>(
  (theme: BackstageTheme) =>
    createStyles({
      paper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        background: 'transparent',
        padding: 8,
      },
      step: {
        backgroundColor: theme.palette.action.disabled,
        borderRadius: '50%',
        width: 9,
        height: 9,
        margin: '0 2px',
      },
      stepActive: {
        backgroundColor: theme.palette.primary.main,
      },
      steps: {
        display: 'flex',
        flexDirection: 'row',
      },
      backButton: {
        position: 'absolute',
        left: 0,
        top: 'calc(50% - 60px)',
        zIndex: 100,
      },
      nextButton: {
        position: 'absolute',
        right: 0,
        top: 'calc(50% - 60px)',
        zIndex: 100,
      },
    }),
);

export const useNavigationStyles = makeStyles<CostInsightsTheme>(
  (theme: CostInsightsTheme) =>
    createStyles({
      menuList: {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.navigation.background,
        minWidth: 250,
      },
      menuItem: {
        background: 'transparent',
        border: 0,
        textTransform: 'none',
        width: '100%',
        minHeight: theme.spacing(6),
        margin: theme.spacing(0.5, 2, 0.5, 0),
      },
      listItemIcon: {
        minWidth: 40,
      },
      navigationIcon: {
        fill: theme.palette.navigationText,
      },
      title: {
        whiteSpace: 'nowrap',
        lineHeight: 1,
        color: theme.palette.navigationText,
        fontWeight: theme.typography.fontWeightBold,
      },
    }),
);

export const useTooltipStyles = makeStyles<CostInsightsTheme>(
  (theme: CostInsightsTheme) =>
    createStyles({
      tooltip: {
        backgroundColor: theme.palette.tooltip.background,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        color: theme.palette.tooltip.color,
        fontSize: theme.typography.fontSize,
        minWidth: 300,
      },
      maxWidth: {
        maxWidth: 300,
      },
      actions: {
        padding: theme.spacing(2),
      },
      header: {
        padding: theme.spacing(2),
      },
      content: {
        padding: theme.spacing(2),
      },
      lensIcon: {
        fontSize: `.75rem`,
      },
      divider: {
        backgroundColor: emphasize(theme.palette.divider, 1),
      },
      truncate: {
        maxWidth: 200,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      subtitle: {
        fontStyle: 'italic',
      },
    }),
);

export const useAlertInsightsSectionStyles = makeStyles<BackstageTheme>(
  (theme: BackstageTheme) =>
    createStyles({
      button: {
        backgroundColor: theme.palette.textVerySubtle,
        color: theme.palette.text.primary,
      },
    }),
);

export const useSelectStyles = makeStyles<BackstageTheme>(
  (theme: BackstageTheme) =>
    createStyles({
      select: {
        minWidth: 200,
        textAlign: 'start',
        backgroundColor: theme.palette.background.paper,
      },
      menuItem: {
        minWidth: 200,
        padding: theme.spacing(2),
        '&.compact': {
          padding: theme.spacing(1, 2),
        },
      },
    }),
);

export const useActionItemCardStyles = makeStyles<CostInsightsTheme>(
  (theme: CostInsightsTheme) =>
    createStyles({
      card: {
        boxShadow: 'none',
      },
      avatar: {
        backgroundColor: theme.palette.textVerySubtle,
        color: theme.palette.text.primary,
      },
      root: {
        minHeight: 80,
        paddingBottom: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
      },
      activeRoot: {
        cursor: 'pointer',
        transition: theme.transitions.create('background', {
          duration: theme.transitions.duration.short,
        }),
        '&:hover': {
          background: theme.palette.alertBackground,
        },
      },
      action: {
        margin: 0,
      },
      title: {
        fontSize: theme.typography.fontSize,
        fontWeight: theme.typography.fontWeightBold,
      },
    }),
);

export const useProductInsightsCardStyles = makeStyles<BackstageTheme>(
  (theme: BackstageTheme) =>
    createStyles({
      root: {
        padding: theme.spacing(2, 2, 2, 2.5), // restore backstage default padding
      },
      action: {
        margin: 0, // unset negative margins
      },
    }),
);

export const useProductInsightsChartStyles = makeStyles<BackstageTheme>(
  (theme: BackstageTheme) =>
    createStyles({
      indicator: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.25rem',
      },
      actions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    }),
);

export const useBackdropStyles = makeStyles<BackstageTheme>(
  (theme: BackstageTheme) =>
    createStyles({
      root: {
        zIndex: theme.zIndex.modal,
      },
    }),
);

export const useSubtleTypographyStyles = makeStyles<BackstageTheme>(
  (theme: BackstageTheme) =>
    createStyles({
      root: {
        color: theme.palette.textSubtle,
      },
    }),
);

export const useEntityDialogStyles = makeStyles<BackstageTheme>(theme =>
  createStyles({
    dialogContent: {
      padding: 0,
    },
    dialogTitle: {
      padding: 0,
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
      zIndex: 100,
    },
    row: {
      fontSize: theme.typography.fontSize * 1.25,
    },
    rowTotal: {
      fontWeight: theme.typography.fontWeightBold,
    },
    colFirst: {
      paddingLeft: theme.spacing(2),
    },
    colLast: {
      paddingRight: theme.spacing(2),
    },
    column: {
      fontWeight: theme.typography.fontWeightBold,
    },
    growth: {
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'flex-end',
    },
  }),
);

export const useAlertDialogStyles = makeStyles((theme: BackstageTheme) =>
  createStyles({
    content: {
      padding: theme.spacing(0, 5, 2, 5),
    },
    actions: {
      padding: theme.spacing(2, 5),
    },
    radio: {
      margin: theme.spacing(-0.5, 0, -0.5, 0),
    },
    icon: {
      color: theme.palette.primary.dark,
      margin: theme.spacing(2.5, 2.5, 0, 0),
      padding: 0,
    },
  }),
);

export const useAlertStatusSummaryButtonStyles = makeStyles(() => ({
  icon: {
    transform: 'transform 5s',
  },
  clicked: {
    transform: 'rotate(180deg)',
  },
}));
