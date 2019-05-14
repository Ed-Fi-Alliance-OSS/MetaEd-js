import path from 'path';
import {
  State,
  ValidationFailure,
  buildMetaEd,
  buildParseTree,
  loadFileIndex,
  loadFiles,
  loadPlugins,
  initializeNamespaces,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  runValidators,
  validateConfiguration,
  walkBuilders,
} from 'metaed-core';

jest.unmock('final-fs');
jest.setTimeout(40000);

describe('when running enhancers and validators against DS 3.1 and a simple extension', () => {
  const sampleExtensionPath: string = path.resolve(__dirname, './simple-extension-project');
  let failures: Array<ValidationFailure> = [];

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '3.1.0',
      projectPaths: ['./node_modules/ed-fi-model-3.1/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.1.0',
        },
        {
          projectName: 'Sample',
          namespaceName: 'Sample',
          projectExtension: 'Sample',
          projectVersion: '3.0.0',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.1.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      manifest => manifest.shortName === 'edfiUnified' || manifest.shortName === 'edfiUnifiedAdvanced',
    );
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runValidators(pluginManifest, state);
      await runEnhancers(pluginManifest, state);
    }

    failures = state.validationFailure;
  });

  it('should have no failures', async () => {
    expect(failures.length).toBe(0);
  });
});
