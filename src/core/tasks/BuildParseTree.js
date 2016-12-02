// @flow
import R from 'ramda';
import winston from 'winston';
import MetaEdErrorListener from '../../grammar/MetaEdErrorListener';
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';
import type { State } from '../State';
import { getAllContents } from './FileIndex';

// eslint-disable-next-line import/prefer-default-export
export const buildParseTree = R.curry(
  (parseTreeBuilder: (metaEdErrorListener: MetaEdErrorListener, metaEdContents: string) => MetaEdGrammar, state: State): State => {
    const errorMessageCollection = [];

    const errorListener = new MetaEdErrorListener(errorMessageCollection, state.get('fileIndex'));
    const parseTree = parseTreeBuilder(errorListener, getAllContents(state.get('fileIndex')));

    if (parseTree == null) {
      winston.error('BuildParseTree: parse tree builder returned null for state metaEdFileIndex contents');
    }

    if (errorMessageCollection.length > 0) {
      // TODO: error out if errorMessageCollection has a message
      winston.error(`BuildParseTree: errors during parsing ${errorMessageCollection.join()}`);
    }

    return state.set('parseTree', parseTree)
                .set('errorMessageCollection', state.get('errorMessageCollection').concat(errorMessageCollection))
                .set('action', state.get('action').push('BuildParseTree'));
  });
