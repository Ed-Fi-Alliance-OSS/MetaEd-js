import fs from 'node:fs';
import util from 'node:util';
import path from 'path';
import cosmic from 'cosmiconfig';
import { State } from '../State';
import { ValidationFailure, ValidationFailureCategory } from '../validator/ValidationFailure';
import { PluginConfiguration } from './PluginConfiguration';
import { PluginEnvironment } from './PluginEnvironment';
import { InputDirectory } from '../file/InputDirectory';
import { JoiSchema, JoiResult, JoiErrorDetail } from './JoiTypes';
import { ConfigurationSchema, ConfigurationRule } from './ConfigurationSchema';
import { configurationStructureSchema } from './ConfigurationSchema';
import { annotateModelWithConfiguration } from './AnnotateModelWithConfiguration';

const existsAsync = util.promisify(fs.exists);

interface CosmicResult {
  config?: any;
  filepath: string;
  isEmpty?: boolean;
}

const sliceConfigFromObject = ({ config }) => ({ config });

export function validateConfigurationStructure(pluginConfiguration: PluginConfiguration): ValidationFailure[] {
  const result: JoiResult = configurationStructureSchema.validate(pluginConfiguration.configObject, { abortEarly: false });
  if (result.error == null) return [];

  const category: ValidationFailureCategory = 'error';
  return result.error.details.map((detail: JoiErrorDetail) => ({
    validatorName: 'LoadPluginConfiguration',
    category,
    message: `${detail.message} at path ${detail.path.join('/')}`,
    sourceMap: null,
    fileMap: {
      fullPath: pluginConfiguration.filepath,
      lineNumber: 0,
    },
  }));
}

export function validatePluginSpecificStructure(
  pluginConfiguration: PluginConfiguration,
  configurationSchemas: ConfigurationSchema,
): ValidationFailure[] {
  const validationFailures: ValidationFailure[] = [];

  const configRuleArray: ConfigurationRule[] = [].concat(pluginConfiguration.configObject.config as any);
  configRuleArray.forEach((configRule: ConfigurationRule) => {
    const schemaForRule: JoiSchema | null = configurationSchemas.get(configRule.rule);
    if (schemaForRule == null) {
      validationFailures.push({
        validatorName: 'LoadPluginConfiguration',
        category: 'error',
        message: `Rule named "${configRule.rule}" is not a valid plugin rule.`,
        sourceMap: null,
        fileMap: {
          fullPath: pluginConfiguration.filepath,
          lineNumber: 0,
        },
      });
    } else {
      const result: JoiResult = schemaForRule.validate(configRule.data, { abortEarly: false });
      if (result.error) {
        result.error.details.forEach((detail: JoiErrorDetail) =>
          validationFailures.push({
            validatorName: 'LoadPluginConfiguration',
            category: 'error',
            message: `${detail.message} at path data/${detail.path.join('/')}`,
            sourceMap: null,
            fileMap: {
              fullPath: pluginConfiguration.filepath,
              lineNumber: 0,
            },
          }),
        );
      }
    }
  });
  return validationFailures;
}

function validatePluginConfiguration(
  pluginConfiguration: PluginConfiguration,
  configurationSchemas: ConfigurationSchema,
): ValidationFailure[] {
  const validationFailures: ValidationFailure[] = [];

  validationFailures.push(...validateConfigurationStructure(pluginConfiguration));
  if (validationFailures.length === 0 && configurationSchemas != null) {
    validationFailures.push(...validatePluginSpecificStructure(pluginConfiguration, configurationSchemas));
  }

  return validationFailures;
}

export async function loadPluginConfiguration(state: State): Promise<void> {
  const searchDirectories: string[] =
    state.metaEdConfiguration.pluginConfigDirectories.length === 0
      ? state.inputDirectories.map((inputDirectory: InputDirectory) => inputDirectory.path)
      : state.metaEdConfiguration.pluginConfigDirectories;

  // eslint-disable-next-line no-restricted-syntax
  for (const searchDirectory of searchDirectories) {
    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      const pluginShortName: string = pluginManifest.shortName;
      const expectedConfigPath = path.join(searchDirectory, `${pluginShortName}.config.json`);
      try {
        const fileExists = await existsAsync(expectedConfigPath);
        if (fileExists) {
          const explorer = cosmic(pluginShortName);
          const cosmicResult: CosmicResult = await explorer.load(expectedConfigPath);
          if (cosmicResult.config) {
            const pluginConfiguration: PluginConfiguration = {
              filepath: expectedConfigPath,
              configObject: sliceConfigFromObject(cosmicResult.config),
            };

            const failuresForPluginConfiguration: ValidationFailure[] = validatePluginConfiguration(
              pluginConfiguration,
              pluginManifest.metaEdPlugin.configurationSchemas,
            );

            if (failuresForPluginConfiguration.length > 0) {
              state.validationFailure.push(...failuresForPluginConfiguration);
            } else {
              const pluginEnvironment: PluginEnvironment | undefined = state.metaEd.plugin.get(pluginShortName);
              if (pluginEnvironment != null) {
                const annotationFailuresForPlugin: ValidationFailure[] = annotateModelWithConfiguration(
                  pluginConfiguration,
                  pluginEnvironment,
                  state.metaEd.namespace,
                );
                state.validationFailure.push(...annotationFailuresForPlugin);
              }
            }
          }
        }
      } catch (err) {
        state.validationFailure.push({
          validatorName: 'LoadPluginConfiguration',
          category: 'error',
          message: err.message,
          sourceMap: null,
          fileMap: {
            fullPath: expectedConfigPath,
            lineNumber: 0,
          },
        });
      }
    }
  }
}
