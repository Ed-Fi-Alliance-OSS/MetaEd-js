// @flow
import R from 'ramda';
import winston from 'winston';
import type { State } from '../State';
import SingleFileMetaEdFileIndex from './SingleFileMetaEdFileIndex';
import MetaEdErrorListener from '../../grammar/MetaEdErrorListener';
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';

export const validateSyntax = R.curry(
(parseTreeBuilder: (metaEdErrorListener: MetaEdErrorListener, metaEdContents: string) => MetaEdGrammar, state: State): State => {
  const errorMessageCollection = [];

  if (state.filesToLoad == null) {
    winston.error('ValidateSyntax: no files to load found');
    return state;
  }

  state.filesToLoad.forEach(fileToLoad => {
    fileToLoad.files.forEach(file => {
      const singleFileMetaEdFileIndex = new SingleFileMetaEdFileIndex();
      singleFileMetaEdFileIndex.add(file);

      const errorListener = new MetaEdErrorListener(errorMessageCollection, singleFileMetaEdFileIndex);

      const parseTree = parseTreeBuilder(errorListener, file.getContents());
      if (parseTree == null) {
        winston.error(`ValidateSyntax: parse tree builder returned null for file ${file.fullName()}`);
      }
    });
  });

  if (errorMessageCollection.length > 0) {
    // TODO: error out if errorMessageCollection has a message
    winston.error(`ValidateSyntax: errors during parsing ${errorMessageCollection.join()}`);
  }

  state.errorMessageCollection = state.errorMessageCollection.concat(errorMessageCollection);
  return state;
});
