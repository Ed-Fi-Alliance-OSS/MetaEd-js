// @flow
import R from 'ramda';
import { loadFiles } from './FileSystemFilenameLoader';
import { validateSyntax } from './ValidateSyntax';
import { buildTopLevelEntity, buildMetaEd } from '../grammar/ParseTreeBuilder';
import loadFileIndex from './LoadFileIndex';
import { buildParseTree } from './BuildParseTree';
import { execute as walkBuilders } from './WalkBuilders';
import { fileMapForFailure } from './FileMapForFailure';
import { execute as walkBuildersMultiplexed } from './WalkBuildersMultiplexed';
import { execute as runValidators } from './RunValidators';
import { loadPlugins } from './LoadPlugins';
import type { State } from '../State';

function nextMacroTask<T>(value: T): Promise<T> {
  return new Promise(resolve => setImmediate(() => resolve(value)));
}

export function oldStartingFromFileLoadP(state: State): Promise<State> {
  return Promise.resolve(loadFiles(state))
    .then(nextMacroTask)
    .then(s => loadPlugins(s))
    .then(nextMacroTask)
    .then(s => validateSyntax(buildTopLevelEntity, s))
    .then(nextMacroTask)
    .then(s => loadFileIndex(s))
    .then(nextMacroTask)
    .then(s => buildParseTree(buildMetaEd, s))
    .then(nextMacroTask)
    .then(s => walkBuilders(s))
    .then(nextMacroTask)
    .then(s => runValidators(s))
    .then(nextMacroTask)
    .then(s => fileMapForFailure(s))
    .then(nextMacroTask);
}

export function startingFromFileLoadP(state: State): Promise<State> {
  return Promise.resolve(loadFiles(state))
    .then(nextMacroTask)
    .then(s => loadPlugins(s))
    .then(nextMacroTask)
    .then(s => validateSyntax(buildTopLevelEntity, s))
    .then(nextMacroTask)
    .then(s => loadFileIndex(s))
    .then(nextMacroTask)
    .then(s => buildParseTree(buildMetaEd, s))
    .then(nextMacroTask)
    .then(s => walkBuildersMultiplexed(s))
    .then(nextMacroTask)
    .then(s => runValidators(s))
    .then(nextMacroTask)
    .then(s => fileMapForFailure(s))
    .then(nextMacroTask);
}

export function startingFromFileLoad(state: State): State {
  return R.pipe(
    loadFiles,
    validateSyntax(buildTopLevelEntity),
    loadFileIndex,
    buildParseTree(buildMetaEd),
    walkBuilders,
    runValidators,
    fileMapForFailure,
  )(state);
}
