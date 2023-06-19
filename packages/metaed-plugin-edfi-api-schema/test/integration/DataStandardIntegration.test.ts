import { State, MetaEdEnvironment, newMetaEdEnvironment } from '@edfi/metaed-core';
import {
  buildMetaEd,
  buildParseTree,
  loadFileIndex,
  loadFiles,
  initializeNamespaces,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  setupPlugins,
  walkBuilders,
} from '@edfi/metaed-core';
import { metaEdPlugins } from './PluginHelper';

jest.setTimeout(40000);

describe('when generating api schema targeting tech version 5.3 with data standard 3.3b', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '5.3.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.3b/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.3.1-b',
          description: 'A description',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEd,
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '3.3.1-b';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runEnhancers(metaEdPlugin, state);
    }
  });

  it('should have metaEd', async () => {
    // Placeholder for better testing - right now the "test" is that nothing crashes
    expect(metaEd).not.toBeUndefined();
  });
});

describe('when generating api schema targeting tech version 6.1 with data standard 4.0', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '6.1.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-4.0/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '4.0.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEd,
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '4.0.0';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runEnhancers(metaEdPlugin, state);
    }
  });

  it('should have metaEd', async () => {
    // Placeholder for better testing - right now the "test" is that nothing crashes
    expect(metaEd).not.toBeUndefined();
  });
});

describe('when generating api schema targeting tech version 7.0 with data standard 5.0-pre.1', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '7.0.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.0-pre.1/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '4.0.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEd,
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '4.0.0';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runEnhancers(metaEdPlugin, state);
    }
  });

  it('should have metaEd', async () => {
    // Placeholder for better testing - right now the "test" is that nothing crashes
    expect(metaEd).not.toBeUndefined();
  });
});
