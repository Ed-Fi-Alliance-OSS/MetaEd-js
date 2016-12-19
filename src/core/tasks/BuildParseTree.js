// @flow
import R from 'ramda';
import winston from 'winston';
import { addAction, setParseTree } from '../State';
import MetaEdErrorListener from '../../grammar/MetaEdErrorListener';
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';
import type { State } from '../State';
import { getAllContents } from './FileIndex';

// eslint-disable-next-line import/prefer-default-export
export const buildParseTree = R.curry(
  (parseTreeBuilder: (metaEdErrorListener: MetaEdErrorListener, metaEdContents: string) => MetaEdGrammar, state: State): State => {
    const errorMessages = [];

    const errorListener = new MetaEdErrorListener(errorMessages, state.get('fileIndex'));
    const parseTree = parseTreeBuilder(errorListener, getAllContents(state.get('fileIndex')));

    if (parseTree == null) {
      winston.error('BuildParseTree: parse tree builder returned null for state metaEdFileIndex contents');
    }

    if (errorMessages.length > 0) {
      // TODO: maybe error out if errorMessages has a message
//      winston.error(`BuildParseTree: errors during parsing ${errorMessages.join()}`);
    }

    // TODO: consider whether BuildParseTree should add errors, they would be the same as errors found in Validate Syntax
    return R.pipe(setParseTree(parseTree), addAction('BuildParseTree'))(state);
  });
