// @flow
import R from 'ramda';
import winston from 'winston';
import { addAction, concatenateErrorMessages } from '../State';
import type { State } from '../State';
import { createFileIndex } from './FileIndex';
import MetaEdErrorListener from '../../grammar/MetaEdErrorListener';
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';

// eslint-disable-next-line import/prefer-default-export
export const validateSyntax = R.curry(
(parseTreeBuilder: (metaEdErrorListener: MetaEdErrorListener, metaEdContents: string) => MetaEdGrammar, state: State): State => {
  const errorMessages = [];

  if (state.get('loadedFileSet') == null) {
    winston.error('ValidateSyntax: no files to load found');
    return state;
  }

  state.get('loadedFileSet').forEach(fileToLoad => {
    fileToLoad.files.forEach(file => {
      const errorListener = new MetaEdErrorListener(errorMessages, createFileIndex([file]));

      const parseTree = parseTreeBuilder(errorListener, file.get('contents'));
      if (parseTree == null) {
        winston.error(`ValidateSyntax: parse tree builder returned null for file ${file.fullName()}`);
      }
    });
  });

  if (errorMessages.length > 0) {
    // TODO: maybe error out if errorMessages has a message
//    winston.error(`ValidateSyntax: errors during parsing ${errorMessages.join()}`);
  }
  return R.pipe(concatenateErrorMessages(errorMessages), addAction('ValidateSyntax'))(state);
});
