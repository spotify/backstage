/*
 * Copyright 2020 Spotify AB
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

import { createMuiTheme } from '@material-ui/core';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';
import { Overrides } from '@material-ui/core/styles/overrides';

import {
  BackstageTheme,
  BackstageThemeOptions,
  SimpleThemeOptions,
} from './types';
import { pageTheme as defaultPageThemes } from './pageTheme';

const DEFAULT_FONT_FAMILY =
  '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif';

export function createThemeOptions(
  options: SimpleThemeOptions,
): BackstageThemeOptions {
  const {
    palette,
    fontFamily = DEFAULT_FONT_FAMILY,
    defaultPageTheme,
    pageTheme = defaultPageThemes,
  } = options;

  if (!pageTheme[defaultPageTheme]) {
    throw new Error(`${defaultPageTheme} is not defined in pageTheme.`);
  }

  return {
    palette,
    props: {
      MuiGrid: {
        spacing: 2,
      },
      MuiSwitch: {
        color: 'primary',
      },
    },
    typography: {
      fontFamily,
      h5: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 700,
        fontSize: 28,
        marginBottom: 6,
      },
      h3: {
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 6,
      },
      h2: {
        fontSize: 40,
        fontWeight: 700,
        marginBottom: 8,
      },
      h1: {
        fontSize: 54,
        fontWeight: 700,
        marginBottom: 10,
      },
    },
    page: pageTheme[defaultPageTheme],
    getPageTheme: ({ themeId }) =>
      pageTheme[themeId] ?? pageTheme[defaultPageTheme],
  };
}

export function createThemeOverrides(theme: BackstageTheme): Overrides {
  return {
    MuiCssBaseline: {
      '@global': {
        html: {
          height: '100%',
          fontFamily: theme.typography.fontFamily,
        },
        body: {
          height: '100%',
          fontFamily: theme.typography.fontFamily,
          'overscroll-behavior-y': 'none',
        },
        a: {
          color: 'inherit',
          textDecoration: 'none',
        },
      },
    },
    MuiTableRow: {
      // Alternating row backgrounds
      root: {
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.background.default,
        },
      },
      // Use pointer for hoverable rows
      hover: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      // Alternating head backgrounds
      head: {
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.background.paper,
        },
      },
    },
    // Tables are more dense than default mui tables
    MuiTableCell: {
      root: {
        wordBreak: 'break-word',
        overflow: 'hidden',
        verticalAlign: 'middle',
        lineHeight: '1',
        margin: 0,
        padding: theme.spacing(3, 2, 3, 2.5),
        borderBottom: 0,
      },
      sizeSmall: {
        padding: theme.spacing(1.5, 2, 1.5, 2.5),
      },
      head: {
        wordBreak: 'break-word',
        overflow: 'hidden',
        color: 'rgb(179, 179, 179)',
        fontWeight: 'normal',
        lineHeight: '1',
      },
    },
    MuiTabs: {
      // Tabs are smaller than default mui tab rows
      root: {
        minHeight: 24,
      },
    },
    MuiTab: {
      // Tabs are smaller and have a hover background
      root: {
        color: theme.palette.link,
        minHeight: 24,
        textTransform: 'initial',
        letterSpacing: '0.07em',
        '&:hover': {
          color: darken(theme.palette.link, 0.3),
          background: lighten(theme.palette.link, 0.95),
        },
        [theme.breakpoints.up('md')]: {
          minWidth: 120,
          fontSize: theme.typography.pxToRem(14),
          fontWeight: 500,
        },
      },
      textColorPrimary: {
        color: theme.palette.link,
      },
    },
    MuiTableSortLabel: {
      // No color change on hover, just rely on the arrow showing up instead.
      root: {
        color: 'inherit',
        '&:hover': {
          color: 'inherit',
        },
        '&:focus': {
          color: 'inherit',
        },
      },
      // Bold font for highlighting selected column
      active: {
        fontWeight: 'bold',
        color: 'inherit',
      },
    },
    MuiListItemText: {
      dense: {
        // Default dense list items to adding ellipsis for really long str...
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
    MuiButton: {
      text: {
        // Text buttons have less padding by default, but we want to keep the original padding
        padding: undefined,
      },
    },
    MuiChip: {
      root: {
        backgroundColor: '#D9D9D9',
        // By default there's no margin, but it's usually wanted, so we add some trailing margin
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        color: theme.palette.grey[900],
      },
      outlined: {
        color: theme.palette.text.primary,
      },
      label: {
        lineHeight: `${theme.spacing(2.5)}px`,
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: `${theme.spacing(1.75)}px`,
      },
      labelSmall: {
        fontSize: `${theme.spacing(1.5)}px`,
      },
      deleteIcon: {
        color: theme.palette.grey[500],
        width: `${theme.spacing(3)}px`,
        height: `${theme.spacing(3)}px`,
        margin: `0 ${theme.spacing(0.75)}px 0 -${theme.spacing(0.75)}px`,
      },
      deleteIconSmall: {
        width: `${theme.spacing(2)}px`,
        height: `${theme.spacing(2)}px`,
        margin: `0 ${theme.spacing(0.5)}px 0 -${theme.spacing(0.5)}px`,
      },
    },
    MuiCard: {
      root: {
        // When cards have a forced size, such as when they are arranged in a
        // CSS grid, the content needs to flex such that the actions (buttons
        // etc) end up at the bottom of the card instead of just below the body
        // contents.
        display: 'flex',
        flexDirection: 'column',
      },
    },
    MuiCardHeader: {
      root: {
        // Reduce padding between header and content
        paddingBottom: 0,
      },
    },
    MuiCardContent: {
      root: {
        // When cards have a forced size, such as when they are arranged in a
        // CSS grid, the content needs to flex such that the actions (buttons
        // etc) end up at the bottom of the card instead of just below the body
        // contents.
        flexGrow: 1,
        '&:last-child': {
          paddingBottom: undefined,
        },
      },
    },
    MuiCardActions: {
      root: {
        // We default to putting the card actions at the end
        justifyContent: 'flex-end',
      },
    },
  };
}

// Creates a Backstage MUI theme using a palette.
// The theme is created with the common Backstage options and component styles.
export function createTheme(options: SimpleThemeOptions): BackstageTheme {
  const themeOptions = createThemeOptions(options);
  const baseTheme = createMuiTheme(themeOptions) as BackstageTheme;
  const overrides = createThemeOverrides(baseTheme);
  const theme = { ...baseTheme, overrides };
  return theme;
}
