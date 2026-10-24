/*
 * Copyright 2024 The Backstage Authors
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

import {
  CompilerState,
  Extractor,
  ExtractorConfig,
  ExtractorLogLevel,
} from '@microsoft/api-extractor';
import { TSDocTagSyntaxKind } from '@microsoft/tsdoc';
import { TSDocConfigFile } from '@microsoft/tsdoc-config';
import fs from 'fs-extra';
import { groupBy } from 'lodash';
import { minimatch } from 'minimatch';
import {
  join,
  relative as relativePath,
  resolve as resolvePath,
} from 'node:path';
import { getPackageExportDetails } from '../../../lib/getPackageExportDetails';
import { targetPaths } from '@backstage/cli-common';
import { logApiReportInstructions, logReportDiff } from '../common';
import { patchApiReportGeneration } from './patchApiReportGeneration';

export async function countApiReportWarnings(reportPath: string) {
  try {
    const content = await fs.readFile(reportPath, 'utf8');
    const lines = content.split('\n');

    const lineWarnings = lines.filter(line =>
      line.includes('// Warning:'),
    ).length;

    const trailerStart = lines.findIndex(
      line => line === '// Warnings were encountered during analysis:',
    );
    const trailerWarnings =
      trailerStart === -1
        ? 0
        : lines.length -
          trailerStart -
          4; /* 4 lines at the trailer and after are not warnings */

    return lineWarnings + trailerWarnings;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return 0;
    }
    throw error;
  }
}

export async function getTsDocConfig() {
  const tsdocConfigFile = await TSDocConfigFile.loadFile(
    require.resolve('@microsoft/api-extractor/extends/tsdoc-base.json'),
  );
  tsdocConfigFile.addTagDefinition({
    tagName: '@ignore',
    syntaxKind: TSDocTagSyntaxKind.ModifierTag,
  });
  tsdocConfigFile.addTagDefinition({
    tagName: '@config',
    syntaxKind: TSDocTagSyntaxKind.BlockTag,
  });
  tsdocConfigFile.setSupportForTag('@ignore', true);
  tsdocConfigFile.setSupportForTag('@config', true);
  return tsdocConfigFile;
}

async function findPackageEntryPoints(packageDirs: string[]): Promise<
  Array<{
    // package dir relative to root, e.g. "packages/backend-app-api"
    packageDir: string;
    // the name of the export, e.g. "index" or "alpha"
    name: string;
    // the path within the dist directory for this export, e.g. "alpha.d.ts"
    distPath: string;
    // the path within the dist-types directory of this package for this export,
    // e.g. "src/entrypoints/foo/index.d.ts"
    distTypesPath: string;
  }>
> {
  return Promise.all(
    packageDirs.map(async packageDir => {
      const pkg = await fs.readJson(
        targetPaths.resolveWorkspaceRoot(packageDir, 'package.json'),
      );

      return getPackageExportDetails(pkg).map(details => {
        return { packageDir, ...details };
      });
    }),
  ).then(results => results.flat());
}

interface ApiExtractionOptions {
  packageDirs: string[];
  outputDir: string;
  isLocalBuild: boolean;
  tsconfigFilePath: string;
  allowWarnings?: boolean | string[];
  omitMessages?: string[];
  validateReleaseTags?: boolean;
}

export async function runApiExtraction({
  packageDirs,
  outputDir,
  isLocalBuild,
  tsconfigFilePath,
  allowWarnings = false,
  omitMessages = [],
  validateReleaseTags = false,
}: ApiExtractionOptions) {
  patchApiReportGeneration();

  await fs.remove(outputDir);

  // The collection of all entry points of all packages, as a single list
  const allEntryPoints = await findPackageEntryPoints(packageDirs);

  // The path (relative to the root) to ALL dist-types entry points (e.g.
  // "dist-types/packages/backend-app-api/src/index.d.ts"). These are used as
  // "extra"/contextual entry points for the extractor so that it can see the
  // full context of things that are required by the local entry point being
  // inspected.
  const allDistTypesEntryPointPaths = allEntryPoints.map(
    ({ packageDir, distTypesPath }) => {
      return targetPaths.resolveWorkspaceRoot(
        './dist-types',
        packageDir,
        distTypesPath,
      );
    },
  );

  let compilerState: CompilerState | undefined = undefined;

  const allowWarningPkg = Array.isArray(allowWarnings) ? allowWarnings : [];

  const messagesConf: { [key: string]: { logLevel: string } } = {};
  for (const messageCode of omitMessages) {
    messagesConf[messageCode] = {
      logLevel: 'none',
    };
  }

  const warnings = new Array<string>();

  for (const [packageDir, packageEntryPoints] of Object.entries(
    groupBy(allEntryPoints, ep => ep.packageDir),
  )) {
    console.log(`## Processing ${packageDir}`);
    const noBail = Array.isArray(allowWarnings)
      ? allowWarnings.some(aw => aw === packageDir || minimatch(packageDir, aw))
      : allowWarnings;

    const projectFolder = targetPaths.resolveWorkspaceRoot(packageDir);
    const packageFolder = targetPaths.resolveWorkspaceRoot(
      './dist-types',
      packageDir,
    );

    const remainingReportFiles = new Set(
      fs.readdirSync(projectFolder).filter(
        filename =>
          // https://regex101.com/r/QDZIV0/2
          filename !== 'knip-report.md' &&
          !filename.startsWith('cli-report') &&
          !filename.endsWith('.sql.md') &&
          // this has to temporarily match all old api report formats
          filename.match(/^.*?(api-)?report(-[^.-]+)?(.*?)\.md$/),
      ),
    );

    for (const packageEntryPoint of packageEntryPoints) {
      const suffix =
        packageEntryPoint.name === 'index' ? '' : `-${packageEntryPoint.name}`;
      const reportFileName = `report${suffix}`;
      const reportPath = resolvePath(projectFolder, `${reportFileName}.api.md`);

      const warningCountBefore = await countApiReportWarnings(reportPath);

      const extractorConfig = ExtractorConfig.prepare({
        configObject: {
          mainEntryPointFilePath: resolvePath(
            packageFolder,
            packageEntryPoint.distTypesPath,
          ),
          bundledPackages: [],

          compiler: {
            tsconfigFilePath,
          },

          apiReport: {
            enabled: true,
            reportFileName,
            reportFolder: projectFolder,
            reportTempFolder: resolvePath(
              outputDir,
              `<unscopedPackageName>${suffix}`,
            ),
          },

          docModel: {
            // TODO(Rugvip): This skips docs for non-index entry points. We can try to work around it, but
            //               most likely it makes sense to wait for API Extractor to natively support exports.
            enabled: packageEntryPoint.name === 'index',
            apiJsonFilePath: resolvePath(
              outputDir,
              `<unscopedPackageName>${suffix}.api.json`,
            ),
          },

          dtsRollup: {
            enabled: false,
          },

          tsdocMetadata: {
            enabled: false,
          },

          messages: {
            // Silence compiler warnings, as these will prevent the CI build to work
            compilerMessageReporting: {
              default: {
                logLevel: 'none' as ExtractorLogLevel.None,
                // These contain absolute file paths, so can't be included in the report
                // addToApiReportFile: true,
              },
            },
            extractorMessageReporting: {
              default: {
                logLevel: 'warning' as ExtractorLogLevel.Warning,
                addToApiReportFile: true,
              },
              ...messagesConf,
            },
            tsdocMessageReporting: {
              default: {
                logLevel: 'warning' as ExtractorLogLevel.Warning,
                addToApiReportFile: true,
              },
            },
          },

          newlineKind: 'lf',

          projectFolder,
        },
        configObjectFullPath: projectFolder,
        packageJsonFullPath: resolvePath(projectFolder, 'package.json'),
        tsdocConfigFile: await getTsDocConfig(),
        ignoreMissingEntryPoint: true,
      });

      // remove extracted reports from current list
      for (const reportConfig of extractorConfig.reportConfigs) {
        remainingReportFiles.delete(reportConfig.fileName);
      }

      // The `packageFolder` needs to point to the location within `dist-types` in order for relative
      // paths to be logged. Unfortunately the `prepare` method above derives it from the `packageJsonFullPath`,
      // which needs to point to the actual file, so we override `packageFolder` afterwards.
      (
        extractorConfig as {
          packageFolder: string;
        }
      ).packageFolder = packageFolder;

      if (!compilerState) {
        compilerState = CompilerState.create(extractorConfig, {
          additionalEntryPoints: allDistTypesEntryPointPaths,
        });
      }

      // Message verbosity can't be configured, so just skip the check instead
      (Extractor as any)._checkCompilerCompatibility = () => {};

      let shouldLogInstructions = false;
      let conflictingFile: undefined | string = undefined;

      // Invoke API Extractor
      const extractorResult = Extractor.invoke(extractorConfig, {
        localBuild: isLocalBuild,
        showVerboseMessages: false,
        showDiagnostics: false,
        messageCallback(message) {
          // Detect messages like the following being output by the generator:
          // Warning: You have changed the API signature for this project. Please copy the file "/home/runner/work/backstage/backstage/node_modules/.cache/api-extractor/backend-test-utils/report.api.md" to "report.api.md", or perform a local build (which does this automatically). See the Git repo documentation for more info.
          // The same instruction follows "The API report file is missing." for new reports.
          if (
            message.text.includes('The API report file is missing') ||
            message.text.includes(
              'You have changed the API signature for this project.',
            )
          ) {
            shouldLogInstructions = true;
            const match = message.text.match(
              /Please copy the file "(.*)" to "[^"]*\.api\.md"/,
            );
            if (match) {
              conflictingFile = match[1];
            }
          }
        },
        compilerState,
      });

      // This release tag validation makes sure that the release tag of known entry points match expectations.
      // The root index entry point is only allowed @public exports, while /alpha and /beta only allow @alpha and @beta.
      if (
        validateReleaseTags &&
        fs.pathExistsSync(extractorConfig.reportFilePath)
      ) {
        if (['index', 'alpha', 'beta'].includes(packageEntryPoint.name)) {
          const report = await fs.readFile(
            extractorConfig.reportFilePath,
            'utf8',
          );
          const lines = report.split(/\r?\n/);
          const expectedTag =
            packageEntryPoint.name === 'index'
              ? 'public'
              : packageEntryPoint.name;
          for (let i = 0; i < lines.length; i += 1) {
            const line = lines[i];
            const match = line.match(/^\/\/ @(alpha|beta|public)/);
            if (match && match[1] !== expectedTag) {
              // Because of limitations in the type script rollup logic we need to allow public exports from the other release stages
              // TODO(Rugvip): Try to work around the need for this exception
              if (expectedTag !== 'public' && match[1] === 'public') {
                continue;
              }
              throw new Error(
                `Unexpected release tag ${match[1]} in ${
                  extractorConfig.reportFilePath
                } at line ${i + 1}`,
              );
            }
          }
        }
      }

      if (!extractorResult.succeeded) {
        if (shouldLogInstructions) {
          logApiReportInstructions();

          if (conflictingFile) {
            const existing = await fs
              .readFile(extractorConfig.reportFilePath, 'utf8')
              .catch(error => {
                if (error.code === 'ENOENT') {
                  return undefined;
                }
                throw error;
              });
            const expected = await fs.readFile(conflictingFile, 'utf8');
            logReportDiff(
              relativePath(
                targetPaths.workspaceRootDir,
                extractorConfig.reportFilePath,
              ),
              existing,
              expected,
            );

            logApiReportInstructions();
          }
        }

        throw new Error(
          `API Extractor completed with ${extractorResult.errorCount} errors` +
            ` and ${extractorResult.warningCount} warnings`,
        );
      }

      const warningCountAfter = await countApiReportWarnings(reportPath);

      if (noBail) {
        console.log(`Skipping warnings check for ${packageDir}`);
      }
      if (warningCountAfter > 0 && !noBail) {
        throw new Error(
          `The API Report for ${packageDir} is not allowed to have warnings`,
        );
      }
      if (warningCountAfter === 0 && allowWarningPkg.includes(packageDir)) {
        console.log(
          `No need to allow warnings for ${packageDir}, it does not have any`,
        );
      }
      if (warningCountAfter > warningCountBefore) {
        warnings.push(
          `The API Report for ${packageDir} introduces new warnings. ` +
            'Please fix these warnings in order to keep the API Reports tidy.',
        );
      }
    }

    if (remainingReportFiles.size > 0) {
      if (isLocalBuild) {
        for (const f of remainingReportFiles) {
          fs.rmSync(resolvePath(projectFolder, f));
          console.log(`Deleted deprecated API report ${f}`);
        }
      } else {
        const staleList = [...remainingReportFiles]
          .map(f => join(packageDir, f))
          .join(', ');
        throw new Error(
          `The API Report(s) ${staleList} are no longer relevant and should be deleted`,
        );
      }
    }
  }

  if (warnings.length > 0) {
    console.warn();
    for (const warning of warnings) {
      console.warn(warning);
    }
    console.warn();
  }
}
