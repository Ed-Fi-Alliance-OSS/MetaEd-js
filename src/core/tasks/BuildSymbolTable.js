// @flow
import { tree } from 'antlr4';
import type { State } from '../State';
import SymbolTableBuilder from '../validators/SymbolTableBuilder';

// eslint-disable-next-line import/prefer-default-export
export const buildSymbolTable = (state: State): State => {
  const symbolTableBuilder = new SymbolTableBuilder();
  symbolTableBuilder.withState(state);
  tree.ParseTreeWalker.DEFAULT.walk(symbolTableBuilder, state.get('parseTree'));
  return symbolTableBuilder.postBuildState();
};
