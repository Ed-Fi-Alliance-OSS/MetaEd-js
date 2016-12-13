// @flow
import R from 'ramda';
import loadFiles from './FileSystemFilenameLoader';
import { validateSyntax } from './ValidateSyntax';
import { buildTopLevelEntity, buildMetaEd } from '../../grammar/ParseTreeBuilder';
import loadFileIndex from './LoadFileIndex';
import { buildParseTree } from './BuildParseTree';
import { buildSymbolTable } from './BuildSymbolTable';
import { validateParseTree } from './ValidateParseTree';
import allValidationRules from '../validators/AllValidationRules';

import type { State } from '../State';

// TODO: not stopping on error -- need to review Either monad

export function startingFromFileLoad(initialState: State): State {
  return R.pipe(
    loadFiles,
    validateSyntax(buildTopLevelEntity),
    loadFileIndex,
    buildParseTree(buildMetaEd),
    buildSymbolTable,
    validateParseTree(allValidationRules()),
  )(initialState);
}
