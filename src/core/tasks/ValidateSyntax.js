// @flow
import R from 'ramda';
import winston from 'winston';
import type { State } from '../State';
import { createFileIndex } from './FileIndex';
import MetaEdErrorListener from '../../grammar/MetaEdErrorListener';
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';

// eslint-disable-next-line import/prefer-default-export
export const validateSyntax = R.curry(
(parseTreeBuilder: (metaEdErrorListener: MetaEdErrorListener, metaEdContents: string) => MetaEdGrammar, state: State): State => {
  const errorMessageCollection = [];

  if (state.get('loadedFileSet') == null) {
    winston.error('ValidateSyntax: no files to load found');
    return state;
  }

  state.get('loadedFileSet').forEach(fileToLoad => {
    fileToLoad.files.forEach(file => {
      const errorListener = new MetaEdErrorListener(errorMessageCollection, createFileIndex([file]));

      const parseTree = parseTreeBuilder(errorListener, file.get('contents'));
      if (parseTree == null) {
        winston.error(`ValidateSyntax: parse tree builder returned null for file ${file.fullName()}`);
      }
    });
  });

  if (errorMessageCollection.length > 0) {
    // TODO: maybe error out if errorMessageCollection has a message
//    winston.error(`ValidateSyntax: errors during parsing ${errorMessageCollection.join()}`);
  }

  return state.set('errorMessageCollection', state.get('errorMessageCollection').concat(errorMessageCollection))
              .set('action', state.get('action').push('ValidateSyntax'));
});
