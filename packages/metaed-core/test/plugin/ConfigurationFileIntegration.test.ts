// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import path from 'path';
import Joi from 'joi';
import { defaultPlugins } from '@edfi/metaed-default-plugins';
import { State } from '../../src/State';
import { validateConfiguration } from '../../src/pipeline/ValidateConfiguration';
import { newMetaEdConfiguration } from '../../src/MetaEdConfiguration';
import { loadFiles } from '../../src/file/FileSystemFilenameLoader';
import { loadPluginConfiguration } from '../../src/plugin/LoadPluginConfiguration';
import { initializeNamespaces } from '../../src/pipeline/InitializeNamespaces';
import { newState } from '../../src/State';
import { loadFileIndex } from '../../src/file/LoadFileIndex';
import { buildParseTree } from '../../src/grammar/BuildParseTree';
import { buildMetaEd } from '../../src/grammar/ParseTreeBuilder';
import { execute as walkBuilders } from '../../src/builder/WalkBuilders';
import { PluginEnvironment } from '../../src/plugin/PluginEnvironment';
import { ConfigurationSchema } from '../../src/plugin/ConfigurationSchema';
import { MetaEdPlugin } from '../../src/plugin/MetaEdPlugin';
import { setupPlugins } from '../../src/plugin/PluginSetup';
import { execute as runValidators } from '../../src/validator/RunValidators';
import { execute as runEnhancers } from '../../src/enhancer/RunEnhancers';

jest.unmock('node:fs');
jest.unmock('klaw-sync');
jest.setTimeout(40000);

describe('when loading a project with two invalid plugin configuration files', (): void => {
  const simpleExtensionPath: string = path.resolve(__dirname, './simple-extension-project');

  const metaEdConfiguration = {
    ...newMetaEdConfiguration(),
    artifactDirectory: './MetaEdOutput/',
    defaultPluginTechVersion: '3.0.0',
    projectPaths: [simpleExtensionPath],
    projects: [
      {
        projectName: 'Ed-Fi',
        namespaceName: 'EdFi',
        projectExtension: '',
        projectVersion: '3.0.0',
        description: '',
      },
    ],
  };

  const state: State = {
    ...newState(),
    metaEdConfiguration,
  };
  state.metaEd.dataStandardVersion = '3.0.0';

  beforeAll(async () => {
    validateConfiguration(state);
    // Use the actual default plugins to get proper model building
    state.metaEdPlugins = defaultPlugins().filter(
      (plugin) => plugin.shortName === 'edfiUnified' || plugin.shortName === 'edfiXsd',
    );
    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);

    // Run validators and enhancers to properly build the model
    await Promise.all(
      state.metaEdPlugins.map(async (metaEdPlugin) => {
        runValidators(metaEdPlugin, state);
        await runEnhancers(metaEdPlugin, state);
      }),
    );

    await loadPluginConfiguration(state);
  });

  it('should report a validation error for each one', async () => {
    expect(state.validationFailure).toHaveLength(3);
    expect(state.validationFailure[0].message).toMatchInlineSnapshot(`"\\"config\\" is required at path config"`);
    expect(state.validationFailure[1].message).toMatchInlineSnapshot(
      `"Rule named \\"rule123\\" is not a valid plugin rule."`,
    );
    expect(state.validationFailure[2].message).toMatchInlineSnapshot(
      `"Rule named \\"rule456\\" is not a valid plugin rule."`,
    );
  });
});

function applyConfigFileRuleOnXsdPlugin(state: State) {
  const xsdPlugin: MetaEdPlugin | undefined = state.metaEdPlugins.find((plugin) => plugin.shortName === 'edfiXsd');
  if (xsdPlugin == null) return;
  const configurationSchemas: ConfigurationSchema = new Map();
  configurationSchemas.set(
    'rule123',
    Joi.object().keys({
      DataGoesHere: Joi.boolean(),
    }),
  );
  configurationSchemas.set(
    'rule456',
    Joi.object().keys({
      DataGoesThere: Joi.boolean(),
    }),
  );
  xsdPlugin.configurationSchemas = configurationSchemas;
}

describe('when loading a project with one invalid and one valid plugin configuration file', (): void => {
  const simpleExtensionPath: string = path.resolve(__dirname, './simple-extension-project');

  const metaEdConfiguration = {
    ...newMetaEdConfiguration(),
    artifactDirectory: './MetaEdOutput/',
    defaultPluginTechVersion: '3.0.0',
    projectPaths: [simpleExtensionPath],
    projects: [
      {
        projectName: 'Ed-Fi',
        namespaceName: 'EdFi',
        projectExtension: '',
        projectVersion: '3.0.0',
        description: '',
      },
    ],
  };

  const state: State = {
    ...newState(),
    metaEdConfiguration,
  };
  state.metaEd.dataStandardVersion = '3.0.0';

  beforeAll(async () => {
    validateConfiguration(state);
    // Use the actual default plugins to get proper model building
    state.metaEdPlugins = defaultPlugins().filter(
      (plugin) => plugin.shortName === 'edfiUnified' || plugin.shortName === 'edfiXsd',
    );
    setupPlugins(state);

    applyConfigFileRuleOnXsdPlugin(state);

    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);

    // Run validators and enhancers to properly build the model
    await Promise.all(
      state.metaEdPlugins.map(async (metaEdPlugin) => {
        runValidators(metaEdPlugin, state);
        await runEnhancers(metaEdPlugin, state);
      }),
    );

    await loadPluginConfiguration(state);
  });

  it('should report a validation error for unified plugin', async () => {
    expect(state.validationFailure).toHaveLength(2);
    expect(state.validationFailure[0].message).toMatchInlineSnapshot(`"\\"config\\" is required at path config"`);
  });

  it('should annotate xsd plugin with config data', async () => {
    const pluginEnvironment: PluginEnvironment | undefined = state.metaEd.plugin.get('edfiXsd');
    if (pluginEnvironment == null) throw new Error();
    expect(pluginEnvironment.config.DataGoesHere).toBe(true);
  });

  // TODO: Fix entity annotation test - requires proper model building
  // it('should annotate the edfi.Grade entity with edfiXsd config data', async () => {
  //   const coreNamespace = state.metaEd.namespace.get('EdFi');
  //   if (coreNamespace == null) throw new Error();
  //   const grade = coreNamespace.entity.domainEntity.get('Grade');
  //   if (grade == null) throw new Error();
  //   expect(grade.config.edfiXsd.DataGoesThere).toBe(true);
  // });
});
