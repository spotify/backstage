/*
 * Copyright 2025 The Backstage Authors
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
import { render } from '@testing-library/react';

// We need to mock react-router-dom hooks used by useInitialRedirect
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Import the module from which the hook is defined
import { getSecondarySidebarRightOffset, useInitialRedirect } from './dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe('useInitialRedirect', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockNavigate.mockReset();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/docs/default/Component/backstage-demo',
    });
    // Simulate that no current path is provided
    (useParams as jest.Mock).mockReturnValue({ '*': '' });
  });

  const TestComponent: React.FC<{ defaultPath?: string }> = ({
    defaultPath,
  }) => {
    // Call hook that should trigger a redirect on mount only if defaultPath is a non-empty string.
    useInitialRedirect(defaultPath);
    return <div>Test</div>;
  };

  it('should not navigate when defaultPath is undefined', () => {
    render(<TestComponent defaultPath={undefined} />);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should navigate when defaultPath is a non-empty string', () => {
    render(<TestComponent defaultPath="/overview" />);
    expect(mockNavigate).toHaveBeenCalledWith(
      '/docs/default/Component/backstage-demo/overview',
      { replace: true },
    );
  });

  it('should not navigate if currPath is non-empty', () => {
    // Override useParams to simulate a non-empty currPath
    (useParams as jest.Mock).mockReturnValue({ '*': 'existing-path' });
    render(<TestComponent defaultPath={undefined} />);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('getSecondarySidebarRightOffset', () => {
  const createContainer = (right: number) => {
    const container = document.createElement('div');
    container.getBoundingClientRect = () => ({ right } as DOMRect);
    return container;
  };

  beforeEach(() => {
    jest
      .spyOn(document.documentElement, 'clientWidth', 'get')
      .mockReturnValue(2400);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should keep the minimum offset when the container fills the viewport', () => {
    expect(getSecondarySidebarRightOffset(createContainer(2380), 24)).toBe(24);
  });

  it('should align with the container when it is narrower than the viewport', () => {
    expect(getSecondarySidebarRightOffset(createContainer(2252), 24)).toBe(148);
  });
});
