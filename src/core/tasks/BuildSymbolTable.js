// @flow
import R from 'ramda';
import { tree } from 'antlr4';
import type { State } from '../State';
import SymbolTableBuilder from '../validators/SymbolTableBuilder';

export const buildSymbolTable = R.curry(
  (symbolTableBuilder: SymbolTableBuilder, state: State): State => {
    // TODO: mutates state
    symbolTableBuilder.withState(state);

    tree.ParseTreeWalker.DEFAULT.walk(symbolTableBuilder, state.parseTree);

    // TODO: mutates state
    return symbolTableBuilder.postBuildState();
  }
);
