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

/* eslint-disable jest/no-disabled-tests */

import { wrapInTestApp } from '@backstage/test-utils';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import LighthouseIntro from './index';

describe('LighthouseIntro', () => {
  it('renders successfully', () => {
    const rendered = render(wrapInTestApp(<LighthouseIntro />));
    expect(
      rendered.queryByText('Welcome to Lighthouse in Backstage!'),
    ).toBeInTheDocument();
  });

  describe('tabs', () => {
    const firstTabRe = /This plugin allows you to/;
    const secondTabRe = /you will need a running instance of/;

    it('selects the first text element', () => {
      const rendered = render(wrapInTestApp(<LighthouseIntro />));
      expect(rendered.queryByText(firstTabRe)).toBeInTheDocument();
      expect(rendered.queryByText(secondTabRe)).not.toBeInTheDocument();
    });

    it('shows the other text when the tab is clicked', () => {
      const rendered = render(wrapInTestApp(<LighthouseIntro />));
      fireEvent.click(rendered.getByText('Setup'));
      expect(rendered.queryByText(firstTabRe)).not.toBeInTheDocument();
      expect(rendered.queryByText(secondTabRe)).toBeInTheDocument();
    });
  });

  describe('closing', () => {
    it('hides the content on click', () => {
      const rendered = render(wrapInTestApp(<LighthouseIntro />));
      const welcomeMessage = rendered.queryByText(
        'Welcome to Lighthouse in Backstage!',
      );
      expect(welcomeMessage).toBeInTheDocument();
      fireEvent.click(rendered.getByText('Hide intro'));

      expect(welcomeMessage).not.toBeInTheDocument();
    });
  });
});
