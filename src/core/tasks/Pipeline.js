// @flow
import R from 'ramda';
import load from './FileSystemFilenameLoader';
import { validateSyntax } from './ValidateSyntax';
import { buildTopLevelEntity, buildMetaEd } from '../../grammar/ParseTreeBuilder';
import loadMetaEdFileIndex from './LoadMetaEdFileIndex';
import { buildParseTree } from './BuildParseTree';
import type { State } from '../State';

export default function start(initialState: State): State {
  return R.pipe(
    load(initialState),
    validateSyntax(buildTopLevelEntity),
    loadMetaEdFileIndex,
    buildParseTree(buildMetaEd)
  );
}
