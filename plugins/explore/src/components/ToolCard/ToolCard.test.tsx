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

import { wrapInTestApp } from '@backstage/test-utils';
import { render } from '@testing-library/react';
import React from 'react';
import { ToolCard } from './ToolCard';

const minProps = {
  card: {
    title: 'Title',
    description: 'Something something',
    url: 'http://spotify.com/',
    image: 'https://developer.spotify.com/assets/WebAPI_intro.png',
    tags: ['tag1', 'tag2'],
  },
};

describe('<ToolCard />', () => {
  it('renders without exploding', () => {
    const { getByText } = render(wrapInTestApp(<ToolCard {...minProps} />));
    expect(getByText('Explore')).toBeInTheDocument();
  });

  it('renders props correctly', () => {
    const { getByText } = render(wrapInTestApp(<ToolCard {...minProps} />));
    expect(getByText(minProps.card.title)).toBeInTheDocument();
    expect(getByText(minProps.card.description)).toBeInTheDocument();
  });

  it('should link out', () => {
    const rendered = render(wrapInTestApp(<ToolCard {...minProps} />));
    const anchor = rendered.container.querySelector('a');
    expect(anchor).toHaveAttribute('href', minProps.card.url);
  });

  it('renders default description when missing', () => {
    const card = {
      title: 'Title',
      url: 'http://spotify.com/',
      image: 'https://developer.spotify.com/assets/WebAPI_intro.png',
    };
    const { getByText } = render(wrapInTestApp(<ToolCard card={card} />));
    expect(getByText('Description missing')).toBeInTheDocument();
  });

  it('renders lifecycle correctly', () => {
    const propsWithLifecycle = {
      card: {
        title: 'Title',
        url: 'http://spotify.com/',
        image: 'https://developer.spotify.com/assets/WebAPI_intro.png',
        lifecycle: 'GA',
      },
    };
    const { queryByText } = render(
      wrapInTestApp(<ToolCard {...propsWithLifecycle} />),
    );
    expect(queryByText('GA')).not.toBeInTheDocument();
  });

  it('renders tags correctly', () => {
    const { getByText } = render(wrapInTestApp(<ToolCard {...minProps} />));
    expect(getByText(minProps.card.tags[0])).toBeInTheDocument();
    expect(getByText(minProps.card.tags[1])).toBeInTheDocument();
  });
});
