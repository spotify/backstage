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

/**
 * When building storybook, we can have warnings which may cause issues in the future. One of the example case is
 * https://github.com/backstage/backstage/issues/718. To make sure new warnings are not introduced with new PRs, we
 * want to fail CI builds if there are warnings when building storybook.
 *
 * This webpack plugin makes sure the CI builds fail on Webpack warnings. We also have an allowlist of warnings here
 * which we think are non-critical.
 *
 * Note that this implementation will not detect other warnings emitted by storybook build that are separate from
 * Webpack. A better solution over this plugin should be preferred, possibly on Storybook level (CLI options etc.)
 *
 * The case with #718 is caused because we are using `ts-loader` for `webpack` to load all our JS/TS files, but we
 * have disabled type checking during build. This is done by setting `transpileOnly` to `true` in storybook/main.js
 * and it improves the Storybook build speed. Because of this, Webpack emits warnings when we try to re-export types.
 * Reference: https://github.com/TypeStrong/ts-loader#transpileonly
 */
class WebpackPluginFailBuildOnWarning {
  // Ignore the following warnings in the Webpack build.
  warningsAllowlist = new Set([
    'AssetsOverSizeLimitWarning',
    'EntrypointsOverSizeLimitWarning',
    'NoAsyncChunksWarning',
  ]);

  /* Entry point for the Webpack plugin. */
  apply(compiler) {
    // Invoke plugin logic when Webpack build is 'done'.
    compiler.hooks.done.tap('FailBuildOnWarning', this.execute.bind(this));
  }

  execute(stats) {
    // All the compilation warnings are stored in stats.compilation.warnings
    let warnings = stats.compilation.warnings;
    if (warnings.length > 0) {
      // Throw error if there are unexpected warnings.
      for (let warning of warnings) {
        if (!this.warningsAllowlist.has(warning.name)) {
          process.on('beforeExit', () => {
            console.log(
              `You have some unexpected warning(s) in your webpack build. Exiting process as error.`,
            );
            process.exit(1);
          });
          // No need to go over the rest of warnings from here.
          break;
        }
      }
    }
  }
}

module.exports = WebpackPluginFailBuildOnWarning;
