// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { State } from '../State';
import { ValidationFailure } from '../validator/ValidationFailure';
import { MetaEdFile, FileSet } from '../file/MetaEdFile';
import { createFileIndex, getFilenameAndLineNumber } from '../file/FileIndex';
import { MetaEdErrorListener } from './MetaEdErrorListener';
import { ParseTreeBuilder } from './ParseTreeBuilder';
import { Logger } from '../Logger';

export const validateSyntax = R.curry((parseTreeBuilder: ParseTreeBuilder, state: State): void => {
  if (state.loadedFileSet == null) {
    Logger.error('ValidateSyntax: no files to load found');
    return;
  }

  state.loadedFileSet.forEach((fileToLoad: FileSet) => {
    fileToLoad.files.forEach((file: MetaEdFile) => {
      const validationFailures: ValidationFailure[] = [];
      const errorListener = new MetaEdErrorListener(validationFailures, 'ValidateSyntax - MetaEdErrorListener');

      const parseTree = parseTreeBuilder(errorListener, file.contents);
      if (parseTree == null) {
        Logger.error(`ValidateSyntax: parse tree builder returned null for file ${file.fullPath}`);
      }

      validationFailures.forEach((failure: ValidationFailure) => {
        if (failure.sourceMap != null) {
          const lineNumber: number = failure.sourceMap.line;
          failure.fileMap = getFilenameAndLineNumber(createFileIndex([file]), lineNumber);
        }
      });

      state.validationFailure.push(...validationFailures);
    });
  });
});
