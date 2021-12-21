import winston from 'winston';
import { loadFiles } from '../file/FileSystemFilenameLoader';
import { initializeMetaEdEnvironment } from './InitializeMetaEdEnvironment';
import { validateSyntax } from '../grammar/ValidateSyntax';
import { buildTopLevelEntity, buildMetaEd } from '../grammar/ParseTreeBuilder';
import { loadFileIndex } from '../file/LoadFileIndex';
import { buildParseTree } from '../grammar/BuildParseTree';
import { execute as walkBuilders } from '../builder/WalkBuilders';
import { loadPluginConfiguration } from '../plugin/LoadPluginConfiguration';
import { fileMapForValidationFailure } from './FileMapForValidationFailure';
import { nextMacroTask, versionSatisfies } from '../Utility';
// import { validateConfiguration } from './ValidateConfiguration';
import { execute as runValidators } from '../validator/RunValidators';
import { execute as runEnhancers } from '../enhancer/RunEnhancers';
import { execute as runGenerators } from '../generator/RunGenerators';
import { execute as writeOutput } from './WriteOutput';
import { loadPlugins } from '../plugin/LoadPlugins';
import { initializeNamespaces } from './InitializeNamespaces';
import { State } from '../State';
import { PluginEnvironment } from '../plugin/PluginEnvironment';

winston.configure({ transports: [new winston.transports.Console()], format: winston.format.cli() });

export async function executePipeline(state: State): Promise<{ state: State; failure: boolean }> {
  // winston.info('Validating configuration...');
  // validateConfiguration(state);
  // await nextMacroTask();

  let failure = false;

  winston.debug('Initialize MetaEdEnvironment');
  initializeMetaEdEnvironment(state);
  await nextMacroTask();

  winston.info('Loading plugins');
  loadPlugins(state);
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

  winston.debug('Loading plugin configuration files');
  await loadPluginConfiguration(state);

  winston.info('Running plugins');
  // eslint-disable-next-line no-restricted-syntax
  for (const pluginManifest of state.pluginManifest) {
    const pluginEnvironment: PluginEnvironment | undefined = state.metaEd.plugin.get(pluginManifest.shortName);
    if (
      pluginManifest.enabled &&
      pluginEnvironment != null &&
      versionSatisfies(pluginEnvironment.targetTechnologyVersion, pluginManifest.technologyVersion)
    ) {
      try {
        winston.info(`- ${pluginManifest.description}`);
        if (state.pipelineOptions.runValidators) {
          if (pluginManifest.metaEdPlugin.validator.length > 0) {
            winston.debug(`- Running ${pluginManifest.metaEdPlugin.validator.length} validators...`);
          }
          runValidators(pluginManifest, state);
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
          if (pluginManifest.metaEdPlugin.enhancer.length > 0) {
            winston.debug(`- Running ${pluginManifest.metaEdPlugin.enhancer.length} enhancers...`);
          }
          await runEnhancers(pluginManifest, state);
          await nextMacroTask();
        }

        if (state.pipelineOptions.runGenerators) {
          if (pluginManifest.metaEdPlugin.generator.length > 0) {
            winston.debug(`- Running ${pluginManifest.metaEdPlugin.generator.length} generators...`);
          }
          await runGenerators(pluginManifest, state);
          await nextMacroTask();
        }
      } catch (err) {
        const message = `Plugin ${pluginManifest.shortName} threw exception '${err.message}'`;
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
