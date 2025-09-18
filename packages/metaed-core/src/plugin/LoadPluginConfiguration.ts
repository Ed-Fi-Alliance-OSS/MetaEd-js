// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { State } from '../State';
import { ValidationFailure, ValidationFailureCategory } from '../validator/ValidationFailure';
import { PluginConfiguration } from './PluginConfiguration';
import { PluginEnvironment } from './PluginEnvironment';
import { InputDirectory } from '../file/InputDirectory';
import { JoiSchema, JoiResult, JoiErrorDetail } from './JoiTypes';
import { ConfigurationSchema, ConfigurationRule } from './ConfigurationSchema';
import { configurationStructureSchema } from './ConfigurationSchema';
import { annotateModelWithConfiguration } from './AnnotateModelWithConfiguration';
import { loadConfigurationFile, findConfigurationFile } from './JsonnetConfigLoader';

/**
 * Extracts only the 'config' property from an object.
 */
const sliceConfigFromObject = ({ config }) => ({ config });

/**
 * Validates the overall structure of a plugin configuration against the configuration schema.
 */
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

/**
 * Validates plugin-specific configuration rules against their respective schemas.
 */
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

/**
 * Performs comprehensive validation of plugin configuration.
 * Validates both the general structure and plugin-specific rules.
 */
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

/**
 * Loads and validates configuration files for all plugins.
 * Searches for configuration files in specified directories and applies them to the model.
 * Supports both JSON (.config.json) and Jsonnet (.config.jsonnet) configuration files.
 */
export async function loadPluginConfiguration(state: State): Promise<void> {
  // Determine which directories to search for configuration files
  // Use plugin config directories if specified, otherwise use input directories
  const searchDirectories: string[] =
    state.metaEdConfiguration.pluginConfigDirectories.length === 0
      ? state.inputDirectories.map((inputDirectory: InputDirectory) => inputDirectory.path)
      : state.metaEdConfiguration.pluginConfigDirectories;

  // Iterate through each search directory
  // eslint-disable-next-line no-restricted-syntax
  for (const searchDirectory of searchDirectories) {
    // Process configuration for each registered plugin
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      const pluginShortName: string = metaEdPlugin.shortName;

      try {
        // Find configuration file (prefers .jsonnet over .json)
        const configPath = await findConfigurationFile(searchDirectory, pluginShortName);
        if (configPath) {
          // Load and evaluate the configuration file
          const configData = await loadConfigurationFile(configPath, {
            externalVariables: state.metaEdConfiguration.externalVariables || {},
          });

          // Create plugin configuration object with filepath and config data
          const pluginConfiguration: PluginConfiguration = {
            filepath: configPath,
            configObject: sliceConfigFromObject(configData),
          };

          // Validate the configuration against plugin schemas
          const failuresForPluginConfiguration: ValidationFailure[] = validatePluginConfiguration(
            pluginConfiguration,
            metaEdPlugin.configurationSchemas || new Map(),
          );

          if (failuresForPluginConfiguration.length > 0) {
            state.validationFailure.push(...failuresForPluginConfiguration);
          } else {
            // Configuration is valid, apply it to the model
            const pluginEnvironment: PluginEnvironment | undefined = state.metaEd.plugin.get(pluginShortName);
            if (pluginEnvironment != null) {
              // Annotate model entities with configuration data
              const annotationFailuresForPlugin: ValidationFailure[] = annotateModelWithConfiguration(
                pluginConfiguration,
                pluginEnvironment,
                state.metaEd.namespace,
              );
              // Add any annotation failures to state
              state.validationFailure.push(...annotationFailuresForPlugin);
            }
          }
        }
      } catch (err) {
        // Handle any errors during configuration loading
        state.validationFailure.push({
          validatorName: 'LoadPluginConfiguration',
          category: 'error',
          message: err.message,
          sourceMap: null,
          fileMap: {
            fullPath: `${searchDirectory}/${pluginShortName}.config.[json|jsonnet]`,
            lineNumber: 0,
          },
        });
      }
    }
  }
}
