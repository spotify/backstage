/*
 * Copyright 2023 The Backstage Authors
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

import { useCallback, useEffect, useState } from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { mockApis, TestApiProvider } from '@backstage/frontend-test-utils';
import {
  useAnalytics,
  createRouteRef,
  createExternalRouteRef,
  useRouteRef,
  identityApiRef,
  useApi,
  ApiBlueprint,
  createFrontendPlugin,
  discoveryApiRef,
} from '@backstage/frontend-plugin-api';
import { Routes, Route } from 'react-router-dom';
import { renderInTestApp } from './renderInTestApp';

describe('renderInTestApp', () => {
  it('should throw for app errors that would show the error page', () => {
    const conflictingPlugin = createFrontendPlugin({
      pluginId: 'conflict',
      extensions: [
        ApiBlueprint.make({
          name: 'discovery',
          params: defineParams =>
            defineParams({
              api: discoveryApiRef,
              deps: {},
              factory: () => ({ getBaseUrl: async () => '' }),
            }),
        }),
      ],
    });

    expect(() =>
      renderInTestApp(<div />, { features: [conflictingPlugin] }),
    ).toThrow(/API_FACTORY_CONFLICT: API 'core.discovery'/);
  });

  it('should not throw for app warnings', () => {
    const pluginWithInvalidFlag = createFrontendPlugin({
      pluginId: 'flags',
      featureFlags: [{ name: 'Invalid_Flag' }],
    });

    renderInTestApp(<div>rendered</div>, {
      features: [pluginWithInvalidFlag],
    });

    expect(screen.getByText('rendered')).toBeInTheDocument();
  });

  it('should render the given component in a page', async () => {
    const IndexPage = () => <div>Index Page</div>;
    renderInTestApp(<IndexPage />);
    expect(screen.getByText('Index Page')).toBeInTheDocument();
  });

  it('should works with apis provider', async () => {
    const IndexPage = () => {
      const analyticsApi = useAnalytics();
      const handleClick = useCallback(() => {
        analyticsApi.captureEvent('click', 'See details');
      }, [analyticsApi]);
      return (
        <div>
          Index Page
          <a href="/details" onClick={handleClick}>
            See details
          </a>
        </div>
      );
    };

    const analyticsApiMock = mockApis.analytics();

    renderInTestApp(
      <TestApiProvider apis={[analyticsApiMock]}>
        <IndexPage />
      </TestApiProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'See details' }));

    expect(analyticsApiMock.getEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: 'click',
          subject: 'See details',
        }),
      ]),
    );
  });

  it('should support setting different locations in the history stack', async () => {
    renderInTestApp(
      <Routes>
        <Route path="/" element={<h1>Index Page</h1>} />
        <Route path="/second-page" element={<h1>Second Page</h1>} />
      </Routes>,
      {
        initialRouteEntries: ['/second-page'],
      },
    );

    expect(screen.getByText('Second Page')).toBeInTheDocument();
  });

  it('should support API overrides via options', async () => {
    const IndexPage = () => {
      const analyticsApi = useAnalytics();
      const handleClick = useCallback(() => {
        analyticsApi.captureEvent('click', 'Test action');
      }, [analyticsApi]);
      return (
        <div>
          <button onClick={handleClick}>Click me</button>
        </div>
      );
    };

    const analyticsApiMock = mockApis.analytics();

    renderInTestApp(<IndexPage />, {
      apis: [analyticsApiMock],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Click me' }));

    expect(analyticsApiMock.getEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: 'click',
          subject: 'Test action',
        }),
      ]),
    );
  });

  it('should allow mounting route refs', () => {
    const testRouteRef = createRouteRef({
      params: ['name'],
    });

    const LinkComponent = () => {
      const link = useRouteRef(testRouteRef);
      return <div>Link: {link?.({ name: 'test-name' }) ?? 'none'}</div>;
    };

    renderInTestApp(<LinkComponent />, {
      mountedRoutes: {
        '/test-path/:name': testRouteRef,
      },
    });

    expect(screen.getByText('Link: /test-path/test-name')).toBeInTheDocument();
  });

  it('should allow mounting external route refs', () => {
    const externalRef = createExternalRouteRef({ params: ['name'] });

    const ExternalLinkComponent = () => {
      const link = useRouteRef(externalRef);
      return <div>Link: {link?.({ name: 'test' }) ?? 'none'}</div>;
    };

    renderInTestApp(<ExternalLinkComponent />, {
      mountedRoutes: {
        '/items/:name': externalRef,
      },
    });

    expect(screen.getByText('Link: /items/test')).toBeInTheDocument();
  });

  describe('identity api', () => {
    const IdentityPage = () => {
      const identityApi = useApi(identityApiRef);
      const [userEntityRef, setUserEntityRef] = useState<string>();

      useEffect(() => {
        identityApi
          .getBackstageIdentity()
          .then(identity => setUserEntityRef(identity.userEntityRef));
      }, [identityApi]);

      return <div>{userEntityRef ?? 'Loading...'}</div>;
    };

    it('should use the overridden identity API instead of the default proxy', async () => {
      renderInTestApp(<IdentityPage />, {
        apis: [
          mockApis.identity({
            userEntityRef: 'user:default/i-just-made-this-up',
          }),
        ],
      });

      expect(
        await screen.findByText('user:default/i-just-made-this-up'),
      ).toBeInTheDocument();
    });

    it('should render with test user entity when no custom value provided', async () => {
      renderInTestApp(<IdentityPage />, {
        apis: [mockApis.identity()],
      });

      expect(await screen.findByText('user:default/test')).toBeInTheDocument();
    });

    it('should not render guest user entity when custom identity is provided', async () => {
      renderInTestApp(<IdentityPage />, {
        apis: [
          mockApis.identity({
            userEntityRef: 'user:default/i-just-made-this-up',
          }),
        ],
      });

      await screen.findByText('user:default/i-just-made-this-up');
      expect(screen.queryByText('user:default/guest')).not.toBeInTheDocument();
    });
  });
});
