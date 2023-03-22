import * as R from 'ramda';
import winston from 'winston';
import type MetaEdGrammar from './gen/MetaEdGrammar';
import { ValidationFailure } from '../validator/ValidationFailure';
import { MetaEdErrorListener } from './MetaEdErrorListener';
import { State } from '../State';
import { getAllContents, getFilenameAndLineNumber } from '../file/FileIndex';
import { ParseTreeBuilder } from './ParseTreeBuilder';

export const buildParseTree = R.curry((parseTreeBuilder: ParseTreeBuilder, state: State): void => {
  const validationFailures: ValidationFailure[] = [];

  const errorListener = new MetaEdErrorListener(validationFailures, 'BuildParseTree - MetaEdErrorListener');
  const parseTree: MetaEdGrammar = parseTreeBuilder(errorListener, getAllContents(state.fileIndex));

  if (parseTree == null) {
    winston.error('BuildParseTree: parse tree builder returned null for state metaEdFileIndex contents');
  }

  validationFailures.forEach((failure) => {
    if (failure.sourceMap && state.fileIndex) {
      failure.fileMap = getFilenameAndLineNumber(state.fileIndex, failure.sourceMap.line);
    }
  });

  state.parseTree = parseTree.metaEd();
});
