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

import { ExtractorMessage } from '@microsoft/api-extractor';
import { AstDeclaration } from '@microsoft/api-extractor/lib/analyzer/AstDeclaration';
import { Program } from 'typescript';
import { tryRunPrettier } from '../common';
import { targetPaths } from '@backstage/cli-common';

let applied = false;

export function patchApiReportGeneration() {
  // Make sure we only apply the patches once
  if (applied) {
    return;
  }
  applied = true;

  const {
    ApiReportGenerator,
  } = require('@microsoft/api-extractor/lib/generators/ApiReportGenerator');

  function patchFileMessageFetcher(
    router: any,
    transform: (messages: ExtractorMessage[], ast?: AstDeclaration) => void,
  ) {
    const {
      fetchAssociatedMessagesForReviewFile,
      fetchUnassociatedMessagesForReviewFile,
    } = router;

    router.fetchAssociatedMessagesForReviewFile =
      function patchedFetchAssociatedMessagesForReviewFile(
        ast: AstDeclaration | undefined,
      ) {
        const messages = fetchAssociatedMessagesForReviewFile.call(this, ast);
        return transform(messages, ast);
      };
    router.fetchUnassociatedMessagesForReviewFile =
      function patchedFetchUnassociatedMessagesForReviewFile() {
        const messages = fetchUnassociatedMessagesForReviewFile.call(this);
        return transform(messages);
      };
  }

  const originalGenerateReviewFileContent =
    ApiReportGenerator.generateReviewFileContent;
  ApiReportGenerator.generateReviewFileContent =
    function decoratedGenerateReviewFileContent(
      collector: { program: Program; messageRouter: any },
      ...moreArgs: any[]
    ) {
      const program = collector.program as Program;
      // The purpose of this override is to allow the @ignore tag to be used to ignore warnings
      // of the form "Warning: (ae-forgotten-export) The symbol "FooBar" needs to be exported by the entry point index.d.ts"
      patchFileMessageFetcher(
        collector.messageRouter,
        (messages: ExtractorMessage[]) => {
          return messages.filter(message => {
            if (message.messageId !== 'ae-forgotten-export') {
              return true;
            }

            // Symbol name has to be extracted from the message :(
            // There's frequently no AST for these exports because type literals
            // aren't traversed by the generator.
            const symbolMatch = message.text.match(/The symbol "([^"]+)"/);
            if (!symbolMatch) {
              throw new Error(
                `Failed to extract symbol name from message "${message.text}"`,
              );
            }
            const [, symbolName] = symbolMatch;

            const sourceFile =
              message.sourceFilePath &&
              program.getSourceFile(message.sourceFilePath);
            if (!sourceFile) {
              throw new Error(
                `Failed to find source file in program at path "${message.sourceFilePath}"`,
              );
            }

            // The local name of the symbol within the file, rather than the exported name
            let localName = (sourceFile as any).identifiers?.get(symbolName);

            if (!localName) {
              // Sometimes the symbol name is suffixed with a number to disambiguate,
              // e.g. "Props_14" instead of "Props" if there are multiple Props interfaces
              // so we try to strip that suffix and look up the symbol again.
              const [, trimmedSymbolName] = symbolName.match(/(.*)_\d+/) || [];
              localName = (sourceFile as any).identifiers?.get(
                trimmedSymbolName,
              );
            }

            if (!localName) {
              throw new Error(
                `Unable to find local name of "${symbolName}" in ${sourceFile.fileName}`,
              );
            }

            // The local AST node of the export that we're missing
            const local = (sourceFile as any).locals?.get(localName);
            if (!local) {
              return true;
            }

            // Use the type checker to look up the actual declaration(s) rather than the one in the local file
            const type = program
              .getTypeChecker()
              .getDeclaredTypeOfSymbol(local);
            if (!type) {
              throw new Error(
                `Unable to find type declaration of "${symbolName}" in ${sourceFile.fileName}`,
              );
            }
            const declarations = type.aliasSymbol?.declarations;
            if (!declarations || declarations.length === 0) {
              return true;
            }

            // If any of the TSDoc comments contain a @ignore tag, we ignore this message
            const isIgnored = declarations.some(declaration => {
              const tags = [(declaration as any).jsDoc]
                .flat()
                .filter(Boolean)
                .flatMap((tagNode: any) => tagNode.tags);

              return tags.some(tag => tag?.tagName.text === 'ignore');
            });

            return !isIgnored;
          });
        },
      );

      /**
       * This monkey patching is for applying prettier to the API reports. This has to be patched into
       * the middle of the process as API Extractor does a comparison of the contents of the old
       * and new files during generation. This inserts the formatting just before that comparison.
       */
      const content = originalGenerateReviewFileContent.call(
        this,
        collector,
        ...moreArgs,
      );
      return tryRunPrettier(content, {
        parser: 'markdown',
        // We need a real-looking filepath for proper config resolution, not just a directory
        // Ideally, the real filepath would be better, but it would require too much patching, for very little gain.
        filepath: `${targetPaths.workspaceRootDir}/report.api.md`,
      });
    };
}
