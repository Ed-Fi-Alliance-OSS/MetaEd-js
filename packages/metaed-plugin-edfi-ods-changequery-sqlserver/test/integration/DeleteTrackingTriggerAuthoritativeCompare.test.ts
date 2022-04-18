import R from 'ramda';
import path from 'path';
import ffs from 'final-fs';
import { exec } from 'child_process';
import { GeneratedOutput, State, GeneratorResult } from '@edfi/metaed-core';
import {
  buildMetaEd,
  buildParseTree,
  loadFileIndex,
  loadFiles,
  loadPlugins,
  initializeNamespaces,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  runGenerators,
  validateConfiguration,
  walkBuilders,
} from '@edfi/metaed-core';
import { PLUGIN_NAME } from '../../src/PluginHelper';

jest.unmock('final-fs');
jest.setTimeout(40000);

describe('when generating change event scripts and comparing to ODS/API 3.1 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/tracking-trigger');
  const authoritativeFilename = 'DeleteTrackingTrigger-v3.1-Authoritative.sql';
  const generatedFilename = 'DeleteTrackingTrigger-v3.1.sql';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsSqlServer: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsChangeQuery: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '3.1.0',
        },
      },
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.0/'],
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

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
        manifest.shortName === 'edfiOdsChangeQuery' ||
        manifest.shortName === PLUGIN_NAME,
    );
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runEnhancers(pluginManifest, state);
      await runGenerators(pluginManifest, state);
    }

    generatedOutput = R.head(
      R.head(
        state.generatorResults.filter((x) => x.generatorName === `${PLUGIN_NAME}.CreateDeletedForTrackingTriggersGenerator`),
      ).generatedOutput,
    );

    await ffs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString, 'utf-8');
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeFilename);
    const generated: string = path.resolve(artifactPath, generatedFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritative} ${generated}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating change event scripts with simple extensions and comparing to ODS/API 3.1 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/tracking-trigger');
  const sampleExtensionPath: string = path.resolve(__dirname, './student-transcript-extension-project');
  const authoritativeCoreFilename = 'DeleteTrackingTrigger-v3.1-Authoritative.sql';
  const authoritativeExtensionFilename = 'sample-DeleteTrackingTrigger-v3.1-Authoritative.sql';
  const generatedCoreFilename = 'DeleteTrackingTrigger-v3.1.sql';
  const generatedExtensionFilename = 'sample-DeleteTrackingTrigger-v3.1.sql';

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsSqlServer: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiOdsChangeQuery: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '3.1.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '3.1.0',
        },
      },
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.0/', sampleExtensionPath],
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
    };
    state.metaEd.dataStandardVersion = '3.0.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
        manifest.shortName === 'edfiOdsChangeQuery' ||
        manifest.shortName === PLUGIN_NAME,
    );
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runEnhancers(pluginManifest, state);
      await runGenerators(pluginManifest, state);
    }

    const generatorResult: GeneratorResult = R.head(
      state.generatorResults.filter((x) => x.generatorName === `${PLUGIN_NAME}.CreateDeletedForTrackingTriggersGenerator`),
    );

    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    await ffs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString, 'utf-8');
    await ffs.writeFile(
      path.resolve(artifactPath, generatedExtensionFilename),
      generatedExtensionOutput.resultString,
      'utf-8',
    );
  });

  it('should have no core file differences', async () => {
    const authoritativeCore: string = path.resolve(artifactPath, authoritativeCoreFilename);
    const generatedCore: string = path.resolve(artifactPath, generatedCoreFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeCore} ${generatedCore}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have no extension file differences', async () => {
    const authoritativeExtension: string = path.resolve(artifactPath, authoritativeExtensionFilename);
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeExtension} ${generatedExtension}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating change event scripts and comparing to ODS/API 3.4 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/tracking-trigger');
  const authoritativeFilename = 'DeleteTrackingTrigger-v3.4-Authoritative.sql';
  const generatedFilename = 'DeleteTrackingTrigger-v3.4.sql';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiOdsSqlServer: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiOdsChangeQuery: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '3.4.0',
        },
      },
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2a/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.2.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
        manifest.shortName === 'edfiOdsChangeQuery' ||
        manifest.shortName === PLUGIN_NAME,
    );
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runEnhancers(pluginManifest, state);
      await runGenerators(pluginManifest, state);
    }

    generatedOutput = R.head(
      R.head(
        state.generatorResults.filter((x) => x.generatorName === `${PLUGIN_NAME}.CreateDeletedForTrackingTriggersGenerator`),
      ).generatedOutput,
    );

    await ffs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString, 'utf-8');
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeFilename);
    const generated: string = path.resolve(artifactPath, generatedFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritative} ${generated}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating change event scripts with simple extensions and comparing to ODS/API 3.4 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/tracking-trigger');
  const sampleExtensionPath: string = path.resolve(__dirname, './student-transcript-extension-project');
  const authoritativeCoreFilename = 'DeleteTrackingTrigger-v3.4-Authoritative.sql';
  const authoritativeExtensionFilename = 'sample-DeleteTrackingTrigger-v3.4-Authoritative.sql';
  const generatedCoreFilename = 'DeleteTrackingTrigger-v3.4.sql';
  const generatedExtensionFilename = 'sample-DeleteTrackingTrigger-v3.4.sql';

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiOdsSqlServer: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiOdsChangeQuery: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '3.4.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '3.4.0',
        },
      },
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2a/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0',
          description: '',
        },
        {
          projectName: 'Sample',
          namespaceName: 'Sample',
          projectExtension: 'Sample',
          projectVersion: '3.2.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.2.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
        manifest.shortName === 'edfiOdsChangeQuery' ||
        manifest.shortName === PLUGIN_NAME,
    );
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runEnhancers(pluginManifest, state);
      await runGenerators(pluginManifest, state);
    }

    const generatorResult: GeneratorResult = R.head(
      state.generatorResults.filter((x) => x.generatorName === `${PLUGIN_NAME}.CreateDeletedForTrackingTriggersGenerator`),
    );

    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    await ffs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString, 'utf-8');
    await ffs.writeFile(
      path.resolve(artifactPath, generatedExtensionFilename),
      generatedExtensionOutput.resultString,
      'utf-8',
    );
  });

  it('should have no core file differences', async () => {
    const authoritativeCore: string = path.resolve(artifactPath, authoritativeCoreFilename);
    const generatedCore: string = path.resolve(artifactPath, generatedCoreFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeCore} ${generatedCore}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have no extension file differences', async () => {
    const authoritativeExtension: string = path.resolve(artifactPath, authoritativeExtensionFilename);
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeExtension} ${generatedExtension}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating change event scripts and comparing to ODS/API 5.0 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/tracking-trigger');
  const authoritativeFilename = 'DeleteTrackingTrigger-v5.0-Authoritative.sql';
  const generatedFilename = 'DeleteTrackingTrigger-v5.0.sql';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsSqlServer: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsChangeQuery: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '5.0.0',
        },
      },
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2a/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.2.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
        manifest.shortName === 'edfiOdsChangeQuery' ||
        manifest.shortName === PLUGIN_NAME,
    );
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runEnhancers(pluginManifest, state);
      await runGenerators(pluginManifest, state);
    }

    generatedOutput = R.head(
      R.head(
        state.generatorResults.filter((x) => x.generatorName === `${PLUGIN_NAME}.CreateDeletedForTrackingTriggersGenerator`),
      ).generatedOutput,
    );

    await ffs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString, 'utf-8');
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeFilename);
    const generated: string = path.resolve(artifactPath, generatedFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritative} ${generated}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating change event scripts with simple extensions and comparing to ODS/API 5.0 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/tracking-trigger');
  const sampleExtensionPath: string = path.resolve(__dirname, './student-transcript-extension-project');
  const authoritativeCoreFilename = 'DeleteTrackingTrigger-v5.0-Authoritative.sql';
  const authoritativeExtensionFilename = 'sample-DeleteTrackingTrigger-v5.0-Authoritative.sql';
  const generatedCoreFilename = 'DeleteTrackingTrigger-v5.0.sql';
  const generatedExtensionFilename = 'sample-DeleteTrackingTrigger-v5.0.sql';

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsSqlServer: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsChangeQuery: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '5.0.0',
        },
      },
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2a/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0',
          description: '',
        },
        {
          projectName: 'Sample',
          namespaceName: 'Sample',
          projectExtension: 'Sample',
          projectVersion: '3.2.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.2.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
        manifest.shortName === 'edfiOdsChangeQuery' ||
        manifest.shortName === PLUGIN_NAME,
    );
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runEnhancers(pluginManifest, state);
      await runGenerators(pluginManifest, state);
    }

    const generatorResult: GeneratorResult = R.head(
      state.generatorResults.filter((x) => x.generatorName === `${PLUGIN_NAME}.CreateDeletedForTrackingTriggersGenerator`),
    );

    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    await ffs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString, 'utf-8');
    await ffs.writeFile(
      path.resolve(artifactPath, generatedExtensionFilename),
      generatedExtensionOutput.resultString,
      'utf-8',
    );
  });

  it('should have no core file differences', async () => {
    const authoritativeCore: string = path.resolve(artifactPath, authoritativeCoreFilename);
    const generatedCore: string = path.resolve(artifactPath, generatedCoreFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeCore} ${generatedCore}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have no extension file differences', async () => {
    const authoritativeExtension: string = path.resolve(artifactPath, authoritativeExtensionFilename);
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeExtension} ${generatedExtension}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating change event scripts and comparing to ODS/API 5.0 authoritative artifacts in Alliance mode', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/tracking-trigger');
  const authoritativeFilename = 'DeleteTrackingTrigger-v5.0-Alliance-Authoritative.sql';
  const generatedFilename = 'DeleteTrackingTrigger-v5.0-Alliance.sql';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsSqlServer: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsChangeQuery: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '5.0.0',
        },
      },
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2a/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.allianceMode = true;
    state.metaEd.dataStandardVersion = '3.2.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
        manifest.shortName === 'edfiOdsChangeQuery' ||
        manifest.shortName === PLUGIN_NAME,
    );
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runEnhancers(pluginManifest, state);
      await runGenerators(pluginManifest, state);
    }

    generatedOutput = R.head(
      R.head(
        state.generatorResults.filter((x) => x.generatorName === `${PLUGIN_NAME}.CreateDeletedForTrackingTriggersGenerator`),
      ).generatedOutput,
    );

    await ffs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString, 'utf-8');
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeFilename);
    const generated: string = path.resolve(artifactPath, generatedFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritative} ${generated}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating change event scripts with simple extensions and comparing to ODS/API 5.0 authoritative artifacts in Alliance mode', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/tracking-trigger');
  const sampleExtensionPath: string = path.resolve(__dirname, './student-transcript-extension-project');
  const authoritativeCoreFilename = 'DeleteTrackingTrigger-v5.0-Alliance-Authoritative.sql';
  const authoritativeExtensionFilename = 'sample-DeleteTrackingTrigger-v5.0-Alliance-Authoritative.sql';
  const generatedCoreFilename = 'DeleteTrackingTrigger-v5.0-Alliance.sql';
  const generatedExtensionFilename = 'sample-DeleteTrackingTrigger-v5.0-Alliance.sql';

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsSqlServer: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiOdsChangeQuery: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '5.0.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '5.0.0',
        },
      },
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2a/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0',
          description: '',
        },
        {
          projectName: 'Sample',
          namespaceName: 'Sample',
          projectExtension: 'Sample',
          projectVersion: '3.2.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.allianceMode = true;
    state.metaEd.dataStandardVersion = '3.2.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
        manifest.shortName === 'edfiOdsChangeQuery' ||
        manifest.shortName === PLUGIN_NAME,
    );
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runEnhancers(pluginManifest, state);
      await runGenerators(pluginManifest, state);
    }

    const generatorResult: GeneratorResult = R.head(
      state.generatorResults.filter((x) => x.generatorName === `${PLUGIN_NAME}.CreateDeletedForTrackingTriggersGenerator`),
    );

    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    await ffs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString, 'utf-8');
    await ffs.writeFile(
      path.resolve(artifactPath, generatedExtensionFilename),
      generatedExtensionOutput.resultString,
      'utf-8',
    );
  });

  it('should have no core file differences', async () => {
    const authoritativeCore: string = path.resolve(artifactPath, authoritativeCoreFilename);
    const generatedCore: string = path.resolve(artifactPath, generatedCoreFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeCore} ${generatedCore}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have no extension file differences', async () => {
    const authoritativeExtension: string = path.resolve(artifactPath, authoritativeExtensionFilename);
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeExtension} ${generatedExtension}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating change event scripts with simple extensions and comparing to ODS/API 6.0.0 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/tracking-trigger');
  const sampleExtensionPath: string = path.resolve(__dirname, './student-transcript-extension-project');
  const authoritativeCoreFilename = 'DeleteTrackingTrigger-v6.0-Authoritative.sql';
  const authoritativeExtensionFilename = 'sample-DeleteTrackingTrigger-v6.0-Authoritative.sql';
  const generatedCoreFilename = 'DeleteTrackingTrigger-v6.0.sql';
  const generatedExtensionFilename = 'sample-DeleteTrackingTrigger-v6.0.sql';

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      pluginTechVersion: {
        edfiUnified: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiOdsRelational: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiOdsSqlServer: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiOdsApi: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiOdsChangeQuery: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiXsd: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiHandbook: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiInterchangeBrief: {
          targetTechnologyVersion: '6.0.0',
        },
        edfiXmlDictionary: {
          targetTechnologyVersion: '6.0.0',
        },
      },
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.3b/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.3.1-b',
          description: '',
        },
        {
          projectName: 'Sample',
          namespaceName: 'Sample',
          projectExtension: 'Sample',
          projectVersion: '3.2.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.3.1-b';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
        manifest.shortName === 'edfiOdsChangeQuery' ||
        manifest.shortName === PLUGIN_NAME,
    );
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const pluginManifest of state.pluginManifest) {
      await runEnhancers(pluginManifest, state);
      await runGenerators(pluginManifest, state);
    }

    const generatorResult: GeneratorResult = R.head(
      state.generatorResults.filter((x) => x.generatorName === `${PLUGIN_NAME}.CreateDeletedForTrackingTriggersGenerator`),
    );

    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    await ffs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString, 'utf-8');
    await ffs.writeFile(
      path.resolve(artifactPath, generatedExtensionFilename),
      generatedExtensionOutput.resultString,
      'utf-8',
    );
  });

  it('should have no core file differences', async () => {
    const authoritativeCore: string = path.resolve(artifactPath, authoritativeCoreFilename);
    const generatedCore: string = path.resolve(artifactPath, generatedCoreFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeCore} ${generatedCore}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have no extension file differences', async () => {
    const authoritativeExtension: string = path.resolve(artifactPath, authoritativeExtensionFilename);
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeExtension} ${generatedExtension}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});
