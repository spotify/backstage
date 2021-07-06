/*
 * Copyright 2021 The Backstage Authors
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

/* eslint-disable import/no-extraneous-dependencies */

// eslint-disable-next-line no-restricted-imports
import {
  resolve as resolvePath,
  relative as relativePath,
  dirname,
  join,
} from 'path';
import fs from 'fs-extra';
import {
  Extractor,
  ExtractorConfig,
  CompilerState,
  ExtractorLogLevel,
} from '@microsoft/api-extractor';
import { ApiPackage, ApiModel } from '@microsoft/api-extractor-model';
import { MarkdownDocumenter } from '@microsoft/api-documenter/lib/documenters/MarkdownDocumenter';

const tmpDir = resolvePath(__dirname, '../node_modules/.cache/api-extractor');

/**
 * All of this monkey patching below is because MUI has these bare package.json file as a method
 * for making TypeScript accept imports like `@material-ui/core/Button`, and improve tree-shaking
 * by declaring them side effect free.
 *
 * The package.json lookup logic in api-extractor really doesn't like that though, as it enforces
 * that the 'name' field exists in all package.json files that it discovers. This below is just
 * making sure that we ignore those file package.json files instead of crashing.
 */
const {
  PackageJsonLookup,
} = require('@rushstack/node-core-library/lib/PackageJsonLookup');

const old = PackageJsonLookup.prototype.tryGetPackageJsonFilePathFor;
PackageJsonLookup.prototype.tryGetPackageJsonFilePathFor = function tryGetPackageJsonFilePathForPatch(
  path: string,
) {
  if (
    path.includes('@material-ui') &&
    !dirname(path).endsWith('@material-ui')
  ) {
    return undefined;
  }
  return old.call(this, path);
};

const PACKAGE_ROOTS = ['packages', 'plugins'];

const SKIPPED_PACKAGES = [
  'packages/app',
  'packages/backend',
  'packages/cli',
  'packages/codemods',
  'packages/create-app',
  'packages/docgen',
  'packages/e2e-test',
  'packages/storybook',
  'packages/techdocs-cli',

  // TODO(Rugvip): Enable these once `import * as ...` and `import()` PRs have landed, #1796 & #1916.
  'packages/core-components',
  'plugins/catalog',
  'plugins/catalog-backend',
  'plugins/catalog-react',
  'plugins/github-deployments',
  'plugins/sentry-backend',
];

async function findPackageDirs() {
  const packageDirs = new Array<string>();
  const projectRoot = resolvePath(__dirname, '..');

  for (const packageRoot of PACKAGE_ROOTS) {
    const dirs = await fs.readdir(resolvePath(projectRoot, packageRoot));
    for (const dir of dirs) {
      const fullPackageDir = resolvePath(packageRoot, dir);

      const stat = await fs.stat(fullPackageDir);
      if (!stat.isDirectory()) {
        continue;
      }

      try {
        const packageJsonPath = join(fullPackageDir, 'package.json');
        await fs.access(packageJsonPath);
      } catch (_) {
        continue;
      }

      const packageDir = relativePath(projectRoot, fullPackageDir);
      if (!SKIPPED_PACKAGES.includes(packageDir)) {
        packageDirs.push(packageDir);
      }
    }
  }

  return packageDirs;
}

interface ApiExtractionOptions {
  packageDirs: string[];
  outputDir: string;
  isLocalBuild: boolean;
}

async function runApiExtraction({
  packageDirs,
  outputDir,
  isLocalBuild,
}: ApiExtractionOptions) {
  await fs.remove(outputDir);

  const entryPoints = packageDirs.map(packageDir => {
    return resolvePath(__dirname, `../dist-types/${packageDir}/src/index.d.ts`);
  });

  let compilerState: CompilerState | undefined = undefined;

  for (const packageDir of packageDirs) {
    console.log(`## Processing ${packageDir}`);
    const projectFolder = resolvePath(__dirname, '..', packageDir);
    const packagePath = resolvePath(__dirname, `../${packageDir}/package.json`);

    const extractorConfig = ExtractorConfig.prepare({
      configObject: {
        mainEntryPointFilePath: resolvePath(
          __dirname,
          '../dist-types',
          packageDir,
          'src/index.d.ts',
        ),
        bundledPackages: [],

        compiler: {
          tsconfigFilePath: resolvePath(__dirname, '../tsconfig.json'),
        },

        apiReport: {
          enabled: true,
          reportFileName: 'api-report.md',
          reportFolder: projectFolder,
          reportTempFolder: resolvePath(outputDir, '<unscopedPackageName>'),
        },

        docModel: {
          enabled: true,
          apiJsonFilePath: resolvePath(
            outputDir,
            '<unscopedPackageName>.api.json',
          ),
        },

        dtsRollup: {
          enabled: false,
        },

        tsdocMetadata: {
          enabled: false,
        },

        messages: {
          // Silence warnings, as these will prevent the CI build to work
          compilerMessageReporting: {
            default: {
              logLevel: 'none' as ExtractorLogLevel.None,
              // These contain absolute file paths, so can't be included in the report
              // addToApiReportFile: true,
            },
          },
          extractorMessageReporting: {
            default: {
              logLevel: 'none' as ExtractorLogLevel.Warning,
              // addToApiReportFile: true,
            },
          },
          tsdocMessageReporting: {
            default: {
              logLevel: 'none' as ExtractorLogLevel.Warning,
              // addToApiReportFile: true,
            },
          },
        },

        newlineKind: 'lf',

        projectFolder,
      },
      configObjectFullPath: projectFolder,
      packageJsonFullPath: packagePath,
    });

    if (!compilerState) {
      compilerState = CompilerState.create(extractorConfig, {
        additionalEntryPoints: entryPoints,
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
        if (
          message.text.includes(
            'You have changed the public API signature for this project.',
          )
        ) {
          shouldLogInstructions = true;
          const match = message.text.match(
            /Please copy the file "(.*)" to "api-report\.md"/,
          );
          if (match) {
            conflictingFile = match[1];
          }
        }
      },
      compilerState,
    });

    if (!extractorResult.succeeded) {
      if (shouldLogInstructions) {
        console.log('');
        console.log(
          '*************************************************************************************',
        );
        console.log(
          '* You have uncommitted changes to the public API of a package.                      *',
        );
        console.log(
          '* To solve this, run `yarn build:api-reports` and commit all api-report.md changes. *',
        );
        console.log(
          '*************************************************************************************',
        );
        console.log('');

        if (conflictingFile) {
          console.log('');
          console.log(
            `The conflicting file is ${relativePath(
              tmpDir,
              conflictingFile,
            )}, with the following content:`,
          );
          console.log('');

          const content = await fs.readFile(conflictingFile, 'utf8');
          console.log(content);
          console.log('');
        }
      }

      throw new Error(
        `API Extractor completed with ${extractorResult.errorCount} errors` +
          ` and ${extractorResult.warningCount} warnings`,
      );
    }
  }
}

function isComponentMember(member: any) {
  // React components are annotated with @component, and we want to skip those
  return Boolean(member.docComment.match(/\n\s*\**\s*@component/m));
}

async function buildDocs({
  inputDir,
  outputDir,
}: {
  inputDir: string;
  outputDir: string;
}) {
  const parseFile = async (filename: string): Promise<any> => {
    console.log(`Reading ${filename}`);
    return fs.readJson(resolvePath(inputDir, filename));
  };

  const filenames = await fs.readdir(inputDir);
  const serializedPackages = await Promise.all(
    filenames
      .filter(filename => filename.match(/\.api\.json$/i))
      .map(parseFile),
  );

  const newModel = new ApiModel();
  for (const serialized of serializedPackages) {
    serialized.members[0].members = serialized.members[0].members.filter(
      member => !isComponentMember(member),
    );

    const pkg = ApiPackage.deserialize(
      serialized,
      serialized.metadata,
    ) as ApiPackage;
    newModel.addMember(pkg);
  }

  await fs.remove(outputDir);
  await fs.ensureDir(outputDir);

  const documenter = new MarkdownDocumenter({
    apiModel: newModel,
    documenterConfig: {
      outputTarget: 'markdown',
      newlineKind: '\n',
      // De ba dålig kod
      configFilePath: '',
      configFile: {},
    } as any,
    outputFolder: outputDir,
  });

  documenter.generateFiles();
}

async function main() {
  const isCiBuild = process.argv.includes('--ci');
  const isDocsBuild = process.argv.includes('--docs');

  const packageDirs = await findPackageDirs();

  console.log('# Generating package API reports');
  await runApiExtraction({
    packageDirs,
    outputDir: tmpDir,
    isLocalBuild: !isCiBuild,
  });

  if (isDocsBuild) {
    console.log('# Generating package documentation');
    await buildDocs({
      inputDir: tmpDir,
      outputDir: resolvePath(__dirname, '..', 'docs/reference'),
    });
  }
}

main().catch(error => {
  console.error(error.stack || String(error));
  process.exit(1);
});
