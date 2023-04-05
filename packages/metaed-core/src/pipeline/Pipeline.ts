import winston from 'winston';
import { loadFiles } from '../file/FileSystemFilenameLoader';
import { initializeMetaEdEnvironment } from './InitializeMetaEdEnvironment';
import { validateSyntax } from '../grammar/ValidateSyntax';
import { buildTopLevelEntity, buildMetaEd } from '../grammar/ParseTreeBuilder';
import { loadFileIndex } from '../file/LoadFileIndex';
import { buildParseTree } from '../grammar/BuildParseTree';
import { execute as walkBuilders } from '../builder/WalkBuilders';
import { fileMapForValidationFailure } from './FileMapForValidationFailure';
import { nextMacroTask } from '../Utility';
import { execute as runValidators } from '../validator/RunValidators';
import { execute as runEnhancers } from '../enhancer/RunEnhancers';
import { execute as runGenerators } from '../generator/RunGenerators';
import { execute as writeOutput } from './WriteOutput';
import { initializeNamespaces } from './InitializeNamespaces';
import { State } from '../State';
import { PluginEnvironment } from '../plugin/PluginEnvironment';
import { setupPlugins } from '../plugin/PluginSetup';

export async function executePipeline(state: State): Promise<{ state: State; failure: boolean }> {
  let failure = false;

  winston.debug('Initialize MetaEdEnvironment');
  initializeMetaEdEnvironment(state);
  await nextMacroTask();

  winston.debug('Plugin Setup');
  setupPlugins(state);
  await nextMacroTask();

  winston.info('Loading .metaed files');
  if (!loadFiles(state)) return { state, failure: true };
  await nextMacroTask();

  winston.debug('Validating syntax');
  validateSyntax(buildTopLevelEntity, state);
  await nextMacroTask();

  winston.debug('Loading file indexes');
  loadFileIndex(state);
  await nextMacroTask();

  winston.debug('Building parse tree');
  buildParseTree(buildMetaEd, state);
  await nextMacroTask();

  winston.debug('Walking builders');
  await walkBuilders(state);

  initializeNamespaces(state);
  await nextMacroTask();

  winston.info('Running plugins');
  // eslint-disable-next-line no-restricted-syntax
  for (const metaEdPlugin of state.metaEdPlugins) {
    const pluginEnvironment: PluginEnvironment | undefined = state.metaEd.plugin.get(metaEdPlugin.shortName);
    if (pluginEnvironment != null) {
      try {
        winston.info(`- ${metaEdPlugin.shortName}`);
        if (state.pipelineOptions.runValidators) {
          if (metaEdPlugin.validator.length > 0) {
            winston.debug(`- Running ${metaEdPlugin.validator.length} validators...`);
          }
          runValidators(metaEdPlugin, state);
          await nextMacroTask();
          if (
            state.validationFailure.some((vf) => vf.category === 'error') &&
            state.pipelineOptions.stopOnValidationFailure
          ) {
            failure = true;
            break;
          }
        }

        if (state.pipelineOptions.runEnhancers) {
          if (metaEdPlugin.enhancer.length > 0) {
            winston.debug(`- Running ${metaEdPlugin.enhancer.length} enhancers...`);
          }
          await runEnhancers(metaEdPlugin, state);
          await nextMacroTask();
        }

        if (state.pipelineOptions.runGenerators) {
          if (metaEdPlugin.generator.length > 0) {
            winston.debug(`- Running ${metaEdPlugin.generator.length} generators...`);
          }
          await runGenerators(metaEdPlugin, state);
          await nextMacroTask();
        }
      } catch (err) {
        const message = `Plugin ${metaEdPlugin.shortName} threw exception '${err.message}'`;
        winston.error(`  ${message}`);
        state.pipelineFailure.push({ category: 'error', message });
        winston.error(err.stack);
        failure = true;
      }
    }
  }

  if (state.pipelineOptions.runGenerators && !failure) {
    winston.info('Writing output');
    if (!writeOutput(state)) return { state, failure: true };
    await nextMacroTask();
  }

  fileMapForValidationFailure(state);
  await nextMacroTask();

  return { state, failure };
}
