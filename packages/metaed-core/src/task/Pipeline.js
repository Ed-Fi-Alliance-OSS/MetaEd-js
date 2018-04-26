// @flow
import winston from 'winston';
import { loadFiles } from './FileSystemFilenameLoader';
import { validateSyntax } from './ValidateSyntax';
import { buildTopLevelEntity, buildMetaEd } from '../grammar/ParseTreeBuilder';
import { loadFileIndex } from './LoadFileIndex';
import { buildParseTree } from './BuildParseTree';
import { execute as walkBuilders } from './WalkBuilders';
import { fileMapForFailure } from './FileMapForFailure';
import { nextMacroTask } from './NextMacroTask';
// import { validateConfiguration } from './ValidateConfiguration';
import { execute as runValidators } from './RunValidators';
import { execute as runEnhancers } from './RunEnhancers';
import { execute as runGenerators } from './RunGenerators';
import { execute as writeOutput } from './WriteOutput';
import { loadPlugins } from './LoadPlugins';
import { addProjectNameToNamespaceInfo } from './AddProjectNameToNamespaceInfo';
import type { State } from '../State';

winston.cli();

export async function executePipeline(state: State): Promise<{ state: State, failure: boolean }> {
  // winston.info('Validating configuration...');
  // validateConfiguration(state);
  // await nextMacroTask();

  let failure: boolean = false;

  winston.info('Loading plugins:');
  loadPlugins(state);
  await nextMacroTask();

  winston.info('Loading source files:');
  if (!loadFiles(state)) return { state, failure: true };
  await nextMacroTask();

  winston.info('Validating syntax...');
  validateSyntax(buildTopLevelEntity, state);
  await nextMacroTask();

  winston.info('Loading file indexes...');
  loadFileIndex(state);
  await nextMacroTask();

  winston.info('Building parse tree...');
  buildParseTree(buildMetaEd, state);
  await nextMacroTask();

  winston.info('Walking builders...');
  await walkBuilders(state);

  addProjectNameToNamespaceInfo(state);
  await nextMacroTask();

  // eslint-disable-next-line no-restricted-syntax
  for (const pluginManifest of state.pluginManifest) {
    if (pluginManifest.enabled) {
      try {
        winston.info(`${pluginManifest.shortName} plugin:`);
        if (state.pipelineOptions.runValidators) {
          if (pluginManifest.metaEdPlugin.validator.length > 0) {
            winston.info(`  Running ${pluginManifest.metaEdPlugin.validator.length} validators...`);
          }
          runValidators(pluginManifest, state);
          await nextMacroTask();
          if (state.validationFailure.some(vf => vf.category === 'error') && state.pipelineOptions.stopOnValidationFailure) {
            failure = true;
            break;
          }
        }

        if (state.pipelineOptions.runEnhancers) {
          if (pluginManifest.metaEdPlugin.enhancer.length > 0) {
            winston.info(`  Running ${pluginManifest.metaEdPlugin.enhancer.length} enhancers...`);
          }
          await runEnhancers(pluginManifest, state);
          await nextMacroTask();
        }

        if (state.pipelineOptions.runGenerators) {
          if (pluginManifest.metaEdPlugin.generator.length > 0) {
            winston.info(`  Running ${pluginManifest.metaEdPlugin.generator.length} generators...`);
          }
          await runGenerators(pluginManifest, state);
          await nextMacroTask();
        }
      } catch (err) {
        winston.error(`Plugin ${pluginManifest.shortName} threw exception '${err.message}'`);
        winston.error(err.stack);
        failure = true;
        break;
      }
    }
  }

  if (state.pipelineOptions.runGenerators && !failure) {
    winston.info('Writing output:');
    if (!writeOutput(state)) return { state, failure: true };
    await nextMacroTask();
  }

  fileMapForFailure(state);
  await nextMacroTask();

  return { state, failure };
}
