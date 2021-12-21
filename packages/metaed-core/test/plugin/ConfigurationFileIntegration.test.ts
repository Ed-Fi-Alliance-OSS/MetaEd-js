import path from 'path';
import Joi from 'joi';
import { State } from '../../src/State';
import { validateConfiguration } from '../../src/pipeline/ValidateConfiguration';
import { newMetaEdConfiguration } from '../../src/MetaEdConfiguration';
import { loadFiles } from '../../src/file/FileSystemFilenameLoader';
import { loadPlugins } from '../../src/plugin/LoadPlugins';
import { loadPluginConfiguration } from '../../src/plugin/LoadPluginConfiguration';
import { initializeNamespaces } from '../../src/pipeline/InitializeNamespaces';
import { newState } from '../../src/State';
import { loadFileIndex } from '../../src/file/LoadFileIndex';
import { buildParseTree } from '../../src/grammar/BuildParseTree';
import { buildMetaEd } from '../../src/grammar/ParseTreeBuilder';
import { execute as walkBuilders } from '../../src/builder/WalkBuilders';
import { PluginManifest } from '../../src/plugin/PluginManifest';
import { PluginEnvironment } from '../../src/plugin/PluginEnvironment';
import { ConfigurationSchema } from '../../src/plugin/ConfigurationSchema';
import { newMetaEdPlugin } from '../../src/plugin/MetaEdPlugin';

jest.unmock('final-fs');
jest.setTimeout(40000);

describe('when loading a project with two invalid plugin configuration files', (): void => {
  const simpleExtensionPath: string = path.resolve(__dirname, './simple-extension-project');

  const metaEdConfiguration = {
    ...newMetaEdConfiguration(),
    artifactDirectory: './MetaEdOutput/',
    defaultPluginTechVersion: '3.0.0',
    projectPaths: ['./node_modules/ed-fi-model-3.0/', simpleExtensionPath],
    projects: [
      {
        projectName: 'Ed-Fi',
        namespaceName: 'EdFi',
        projectExtension: '',
        projectVersion: '3.0.0',
        description: '',
      },
      {
        projectName: 'Sample',
        namespaceName: 'sample',
        projectExtension: 'Sample',
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
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) => manifest.shortName === 'edfiUnified' || manifest.shortName === 'edfiXsd',
    );
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    await loadPluginConfiguration(state);
  });

  it('should report a validation error for each one', async () => {
    expect(state.validationFailure).toHaveLength(3);
    expect(state.validationFailure[0].message).toMatchSnapshot();
    expect(state.validationFailure[1].message).toMatchSnapshot();
    expect(state.validationFailure[2].message).toMatchSnapshot();
  });
});

function applyConfigFileRuleOnXsdPlugin(state: State) {
  const xsdPluginManifest: PluginManifest | undefined = state.pluginManifest.find(
    (manifest) => manifest.shortName === 'edfiXsd',
  );
  if (xsdPluginManifest == null) return;
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
  xsdPluginManifest.metaEdPlugin = {
    ...newMetaEdPlugin(),
    configurationSchemas,
  };
}

describe('when loading a project with one invalid and one valid plugin configuration file', (): void => {
  const simpleExtensionPath: string = path.resolve(__dirname, './simple-extension-project');

  const metaEdConfiguration = {
    ...newMetaEdConfiguration(),
    artifactDirectory: './MetaEdOutput/',
    defaultPluginTechVersion: '3.0.0',
    projectPaths: ['./node_modules/ed-fi-model-3.0/', simpleExtensionPath],
    projects: [
      {
        projectName: 'Ed-Fi',
        namespaceName: 'EdFi',
        projectExtension: '',
        projectVersion: '3.0.0',
        description: '',
      },
      {
        projectName: 'Sample',
        namespaceName: 'sample',
        projectExtension: 'Sample',
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
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) => manifest.shortName === 'edfiUnified' || manifest.shortName === 'edfiXsd',
    );

    applyConfigFileRuleOnXsdPlugin(state);

    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    await loadPluginConfiguration(state);
  });

  it('should report a validation error for unified plugin', async () => {
    expect(state.validationFailure).toHaveLength(1);
    expect(state.validationFailure[0].message).toMatchSnapshot();
  });

  it('should annotate xsd plugin with config data', async () => {
    const pluginEnvironment: PluginEnvironment | undefined = state.metaEd.plugin.get('edfiXsd');
    if (pluginEnvironment == null) throw new Error();
    expect(pluginEnvironment.config.DataGoesHere).toBe(true);
  });

  it('should annotate the edfi.Grade entity with edfiXsd config data', async () => {
    const coreNamespace = state.metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    const grade = coreNamespace.entity.domainEntity.get('Grade');
    if (grade == null) throw new Error();
    expect(grade.config.edfiXsd.DataGoesThere).toBe(true);
  });
});
