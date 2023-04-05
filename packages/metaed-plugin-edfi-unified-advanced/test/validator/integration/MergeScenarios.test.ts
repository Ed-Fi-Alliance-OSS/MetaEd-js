import {
  newMetaEdConfiguration,
  newState,
  State,
  setupPlugins,
  loadFiles,
  loadFileIndex,
  buildParseTree,
  walkBuilders,
  initializeNamespaces,
  runValidators,
  runEnhancers,
  buildMetaEd,
} from '@edfi/metaed-core';
import { metaEdPlugins } from '../../PluginHelper';

jest.setTimeout(100000);

describe('when generating api model and comparing it to data standard 3.1 authoritative artifacts', (): void => {
  const metaEdConfiguration = {
    ...newMetaEdConfiguration(),
    artifactDirectory: './MetaEdOutput/',
    defaultPluginTechVersion: '3.1.0',
    projectPaths: ['./node_modules/@edfi/ed-fi-model-3.1/'],
    projects: [
      {
        projectName: 'Ed-Fi',
        namespaceName: 'EdFi',
        projectExtension: '',
        projectVersion: '3.1.0',
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
  beforeAll(async () => {
    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      runValidators(metaEdPlugin, state);
      await runEnhancers(metaEdPlugin, state);
    }
  });

  it('should have no validation errors', async () => {
    expect(state.validationFailure).toHaveLength(0);
  });
});
