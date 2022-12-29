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
import { Logger } from '../Logger';

export async function executePipeline(state: State): Promise<{ state: State; failure: boolean }> {
  // Logger.info('Validating configuration...');
  // validateConfiguration(state);
  // await nextMacroTask();

  let failure = false;

  Logger.debug('Initialize MetaEdEnvironment');
  initializeMetaEdEnvironment(state);
  await nextMacroTask();

  Logger.info('Loading plugins');
  loadPlugins(state);
  await nextMacroTask();

  Logger.info('Loading .metaed files');
  if (!loadFiles(state)) return { state, failure: true };
  await nextMacroTask();

  Logger.debug('Validating syntax');
  validateSyntax(buildTopLevelEntity, state);
  await nextMacroTask();

  Logger.debug('Loading file indexes');
  loadFileIndex(state);
  await nextMacroTask();

  Logger.debug('Building parse tree');
  buildParseTree(buildMetaEd, state);
  await nextMacroTask();

  Logger.debug('Walking builders');
  await walkBuilders(state);

  initializeNamespaces(state);
  await nextMacroTask();

  Logger.debug('Loading plugin configuration files');
  await loadPluginConfiguration(state);

  Logger.info('Running plugins');
  // eslint-disable-next-line no-restricted-syntax
  for (const pluginManifest of state.pluginManifest) {
    const pluginEnvironment: PluginEnvironment | undefined = state.metaEd.plugin.get(pluginManifest.shortName);
    if (
      pluginManifest.enabled &&
      pluginEnvironment != null &&
      versionSatisfies(pluginEnvironment.targetTechnologyVersion, pluginManifest.technologyVersion)
    ) {
      try {
        Logger.info(`- ${pluginManifest.description}`);
        if (state.pipelineOptions.runValidators) {
          if (pluginManifest.metaEdPlugin.validator.length > 0) {
            Logger.debug(`- Running ${pluginManifest.metaEdPlugin.validator.length} validators...`);
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
            Logger.debug(`- Running ${pluginManifest.metaEdPlugin.enhancer.length} enhancers...`);
          }
          await runEnhancers(pluginManifest, state);
          await nextMacroTask();
        }

        if (state.pipelineOptions.runGenerators) {
          if (pluginManifest.metaEdPlugin.generator.length > 0) {
            Logger.debug(`- Running ${pluginManifest.metaEdPlugin.generator.length} generators...`);
          }
          await runGenerators(pluginManifest, state);
          await nextMacroTask();
        }
      } catch (err) {
        const message = `Plugin ${pluginManifest.shortName} threw exception '${err.message}'`;
        Logger.error(`  ${message}`);
        state.pipelineFailure.push({ category: 'error', message });
        Logger.error(err.stack);
        failure = true;
      }
    }
  }

  if (state.pipelineOptions.runGenerators && !failure) {
    Logger.info('Writing output');
    if (!writeOutput(state)) return { state, failure: true };
    await nextMacroTask();
  }

  fileMapForValidationFailure(state);
  await nextMacroTask();

  return { state, failure };
}
