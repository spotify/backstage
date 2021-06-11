/*
 * Copyright 2021 Spotify AB
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
import React from 'react';
import { getComponentData } from '@backstage/core';

export const collectComponentData = <T>(
  children: React.ReactNode,
  componentDataKey: string,
) => {
  const stack = [children];
  const found: T[] = [];

  while (stack.length) {
    const current: React.ReactNode = stack.pop()!;

    React.Children.forEach(current, child => {
      if (!React.isValidElement(child)) {
        return;
      }

      const data = getComponentData<T>(child, componentDataKey);
      if (data) {
        found.push(data);
      }

      if (child.props.children) {
        stack.push(child.props.children);
      }
    });
  }

  return found;
};

export const collectChildren = (
  component: React.ReactNode,
  componentDataKey: string,
) => {
  const stack = [component];
  const found: React.ReactNode[] = [];

  while (stack.length) {
    const current: React.ReactNode = stack.pop()!;

    React.Children.forEach(current, child => {
      if (!React.isValidElement(child)) {
        return;
      }

      if (child.props.children) {
        if (getComponentData(child, componentDataKey)) {
          found.push(child.props.children);
        }
        stack.push(child.props.children);
      }
    });
  }

  return found;
};
