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
import { collectComponentData, collectChildren } from './helpers';
import { attachComponentData } from '@backstage/core';

describe('Extension Helpers', () => {
  const createElementWithComponentData = ({
    type,
    data,
  }: {
    type: string;
    data: any;
  }) => {
    const element: React.ComponentType = () => null;
    attachComponentData(element, type, data);
    return element;
  };

  describe('collectChildren', () => {
    it('should return the children of the component which has the correct componentData flag', () => {
      const SearchElement = createElementWithComponentData({
        type: 'find.me',
        data: {},
      });

      const DontCareAboutme = createElementWithComponentData({
        type: 'dont.find.me',
        data: {},
      });

      const child1 = (
        <div>
          <b>hello</b>
        </div>
      );

      const child2 = (
        <div>
          <p>Hello2</p>
        </div>
      );

      const testCase = (
        <div>
          <SearchElement>
            {child1}
            {child1}
          </SearchElement>
          <SearchElement>{child2}</SearchElement>
          <DontCareAboutme>
            <p>Hello!</p>
            <SearchElement>{child1}</SearchElement>
          </DontCareAboutme>
        </div>
      );

      const children = collectChildren(testCase, 'find.me');

      expect(children).toEqual([[child1, child1], child2, child1]);
    });
  });

  describe('collectComponentData', () => {
    it('should return the componentData for particular nodes', () => {
      const componentData1 = { help: 'im something' };
      const componentData2 = { help: 'im something else' };

      const FirstElement = createElementWithComponentData({
        type: 'find.me',
        data: componentData1,
      });

      const SecondElement = createElementWithComponentData({
        type: 'dont.find.me',
        data: componentData2,
      });

      const testCase = [
        <FirstElement />,
        <FirstElement />,
        <SecondElement />,
        <FirstElement />,
      ];
      const returnedData = collectComponentData(testCase, 'find.me');

      expect(returnedData).toEqual([
        componentData1,
        componentData1,
        componentData1,
      ]);
    });
  });
});
