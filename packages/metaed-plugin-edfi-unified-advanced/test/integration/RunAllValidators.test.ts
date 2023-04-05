import path from 'path';
import {
  State,
  ValidationFailure,
  buildMetaEd,
  buildParseTree,
  loadFileIndex,
  loadFiles,
  setupPlugins,
  initializeNamespaces,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  runValidators,
  walkBuilders,
} from '@edfi/metaed-core';
import { metaEdPlugins } from '../PluginHelper';

jest.setTimeout(100000);

describe('when running enhancers and validators against DS 3.1 and a simple extension', (): void => {
  const sampleExtensionPath: string = path.resolve(__dirname, './simple-extension-project');
  let failures: ValidationFailure[] = [];

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '3.1.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.1/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.1.0',
          description: '',
        },
        {
          projectName: 'Sample',
          namespaceName: 'Sample',
          projectExtension: 'Sample',
          projectVersion: '3.0.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '3.1.0';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runValidators(metaEdPlugin, state);
      await runEnhancers(metaEdPlugin, state);
    }

    failures = state.validationFailure;
  });

  it('should have no failures', async () => {
    expect(failures.length).toBe(0);
  });
});
