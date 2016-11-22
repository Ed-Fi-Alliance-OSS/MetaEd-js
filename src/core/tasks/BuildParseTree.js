// @flow
import R from 'ramda';
import winston from 'winston';
import type { State } from '../State';
import MetaEdErrorListener from '../../grammar/MetaEdErrorListener';
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';

export const buildParseTree = R.curry(
  (parseTreeBuilder: (metaEdErrorListener: MetaEdErrorListener, metaEdContents: string) => MetaEdGrammar, state: State): State => {
    const errorMessageCollection = [];

    const errorListener = new MetaEdErrorListener(errorMessageCollection, state.metaEdFileIndex);
    const parseTree = parseTreeBuilder(errorListener, state.metaEdFileIndex.getAllContents());

    if (parseTree == null) {
      winston.error('BuildParseTree: parse tree builder returned null for state metaEdFileIndex contents');
    }

    if (errorMessageCollection.length > 0) {
      // TODO: error out if errorMessageCollection has a message
      winston.error(`ValidateSyntax: errors during parsing ${errorMessageCollection.join()}`);
    }

    // TODO: mutates state
    state.parseTree = parseTree;

    state.errorMessageCollection = state.errorMessageCollection.concat(errorMessageCollection);
    return state;
  }
);
