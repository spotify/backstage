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

const path = require('path');

module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    if (filename.match(/\.icon\.svg$/)) {
      return `const React = require('react');
      const SvgIcon = require('@material-ui/core/SvgIcon').default;
      module.exports = {
        __esModule: true,
        default: props => React.createElement(SvgIcon, props, {
          $$typeof: Symbol.for('react.element'),
          type: 'svg',
          ref: ref,
          key: null,
          props: Object.assign({}, props, {
            children: ${assetFilename}
          })
        })
      };`;
    }

    return `module.exports = ${assetFilename};`;
  },
};
