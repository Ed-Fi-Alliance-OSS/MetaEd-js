import * as R from 'ramda';
import winston from 'winston';
import { State } from '../State';
import { ValidationFailure } from '../validator/ValidationFailure';
import { MetaEdFile, FileSet } from '../file/MetaEdFile';
import { createFileIndex, getFilenameAndLineNumber } from '../file/FileIndex';
import { MetaEdErrorListener } from './MetaEdErrorListener';
import { ParseTreeBuilder } from './ParseTreeBuilder';

export const validateSyntax = R.curry((parseTreeBuilder: ParseTreeBuilder, state: State): void => {
  if (state.loadedFileSet == null) {
    winston.error('ValidateSyntax: no files to load found');
    return;
  }

  state.loadedFileSet.forEach((fileToLoad: FileSet) => {
    fileToLoad.files.forEach((file: MetaEdFile) => {
      const validationFailures: ValidationFailure[] = [];
      const errorListener = new MetaEdErrorListener(validationFailures, 'ValidateSyntax - MetaEdErrorListener');

      const parseTree = parseTreeBuilder(errorListener, file.contents);
      if (parseTree == null) {
        winston.error(`ValidateSyntax: parse tree builder returned null for file ${file.fullPath}`);
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
