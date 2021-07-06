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

import { createTheme } from './baseTheme';
import { pageTheme } from './pageTheme';
import { yellow } from '@material-ui/core/colors';

export const lightTheme = createTheme({
  palette: {
    type: 'light',
    background: {
      default: '#F8F8F8',
    },
    status: {
      ok: '#1DB954',
      warning: '#FF9800',
      error: '#E22134',
      running: '#2E77D0',
      pending: '#FFED51',
      aborted: '#757575',
    },
    bursts: {
      fontColor: '#FEFEFE',
      slackChannelText: '#ddd',
      backgroundColor: {
        default: '#7C3699',
      },
    },
    primary: {
      main: '#2E77D0',
    },
    banner: {
      info: '#2E77D0',
      error: '#E22134',
      text: '#FFFFFF',
      link: '#000000',
    },
    border: '#E6E6E6',
    textContrast: '#000000',
    textVerySubtle: '#DDD',
    textSubtle: '#6E6E6E',
    highlight: '#FFFBCC',
    errorBackground: '#FFEBEE',
    warningBackground: '#F59B23',
    infoBackground: '#ebf5ff',
    errorText: '#CA001B',
    infoText: '#004e8a',
    warningText: '#000000',
    linkHover: '#2196F3',
    link: '#0A6EBE',
    gold: yellow.A700,
    navigation: {
      background: '#171717',
      indicator: '#9BF0E1',
      color: '#b5b5b5',
      selectedColor: '#FFF',
    },
    pinSidebarButton: {
      icon: '#181818',
      background: '#BDBDBD',
    },
    tabbar: {
      indicator: '#9BF0E1',
    },
  },
  defaultPageTheme: 'home',
  pageTheme,
});

export const darkTheme = createTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#333333',
    },
    status: {
      ok: '#71CF88',
      warning: '#FFB84D',
      error: '#F84C55',
      running: '#3488E3',
      pending: '#FEF071',
      aborted: '#9E9E9E',
    },
    bursts: {
      fontColor: '#FEFEFE',
      slackChannelText: '#ddd',
      backgroundColor: {
        default: '#7C3699',
      },
    },
    primary: {
      main: '#9CC9FF',
      dark: '#82BAFD',
    },
    secondary: {
      main: '#FF88B2',
    },
    banner: {
      info: '#2E77D0',
      error: '#E22134',
      text: '#FFFFFF',
      link: '#000000',
    },
    border: '#E6E6E6',
    textContrast: '#FFFFFF',
    textVerySubtle: '#727272',
    textSubtle: '#CCCCCC',
    highlight: '#FFFBCC',
    errorBackground: '#FFEBEE',
    warningBackground: '#F59B23',
    infoBackground: '#ebf5ff',
    errorText: '#CA001B',
    infoText: '#004e8a',
    warningText: '#000000',
    linkHover: '#82BAFD',
    link: '#9CC9FF',
    gold: yellow.A700,
    navigation: {
      background: '#424242',
      indicator: '#9BF0E1',
      color: '#b5b5b5',
      selectedColor: '#FFF',
    },
    pinSidebarButton: {
      icon: '#404040',
      background: '#BDBDBD',
    },
    tabbar: {
      indicator: '#9BF0E1',
    },
  },
  defaultPageTheme: 'home',
  pageTheme,
});
