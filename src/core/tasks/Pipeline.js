// @flow
import R from 'ramda';
import load from './FileSystemFilenameLoader';
import { validateSyntax } from './ValidateSyntax';
import { buildTopLevelEntity, buildMetaEd } from '../../grammar/ParseTreeBuilder';
import loadMetaEdFileIndex from './LoadMetaEdFileIndex';
import { buildParseTree } from './BuildParseTree';
import { buildSymbolTable } from './BuildSymbolTable';
import { validateParseTree } from './ValidateParseTree';
import allValidationRules from '../validators/AllValidationRules';

import type { State } from '../State';

// TODO: not stopping on error -- need to review Either monad

export default function start(initialState: State): State {
  return R.pipe(
    load,
    validateSyntax(buildTopLevelEntity),
    loadMetaEdFileIndex,
    buildParseTree(buildMetaEd),
    buildSymbolTable,
    validateParseTree(allValidationRules()),
  )(initialState);
}
