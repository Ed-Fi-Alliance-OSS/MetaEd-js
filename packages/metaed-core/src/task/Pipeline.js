// @flow
import R from 'ramda';
import { Logger, transports } from 'winston';
import { loadFiles } from './FileSystemFilenameLoader';
import { validateSyntax } from './ValidateSyntax';
import { buildTopLevelEntity, buildMetaEd } from '../grammar/ParseTreeBuilder';
import loadFileIndex from './LoadFileIndex';
import { buildParseTree } from './BuildParseTree';
import { execute as walkBuilders } from './WalkBuilders';
import { fileMapForFailure } from './FileMapForFailure';
import { execute as walkBuildersMultiplexed } from './WalkBuildersMultiplexed';
import { execute as runValidators } from './RunValidators';
import { execute as runEnhancers } from './RunEnhancers';
import { execute as runGenerators } from './RunGenerators';
import { execute as writeOutput } from './WriteOutput';
import { loadPlugins } from './LoadPlugins';
import type { State } from '../State';

const logger = new Logger({
  transports: [
    new transports.Console(),
  ],
});
logger.cli();

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

export const pipeLog = (text: string) => R.tap(() => logger.info(text));

export function build(state: State): State {
  return R.pipe(
    pipeLog('Load Plugins...'),
    loadPlugins,
    pipeLog('Load Files...'),
    loadFiles,
    pipeLog('Load File Index...'),
    loadFileIndex,
    pipeLog('Build Parse Tree...'),
    buildParseTree(buildMetaEd),
    pipeLog('Walk Builders...'),
    walkBuilders,
    pipeLog('Run Validators...'),
    runValidators,
    pipeLog('Run Enhancers...'),
    runEnhancers,
    pipeLog('Run Generators...'),
    runGenerators,
    pipeLog('Map Failures...'),
    fileMapForFailure,
    pipeLog('Writing Output...'),
    writeOutput,
  )(state);
}
