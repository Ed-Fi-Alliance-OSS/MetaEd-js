import R from 'ramda';
import path from 'path';
import ffs from 'final-fs';
import { exec } from 'child_process';
import { GeneratedOutput, GeneratorResult, State } from 'metaed-core';
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
} from 'metaed-core';

jest.unmock('final-fs');
jest.setTimeout(40000);

describe('when generating api model and comparing it to data standard 3.1 authoritative artifacts', () => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const authoritativeFilename = 'edfi-3.1-api-model-authoritative.json';
  const generatedFilename = 'edfi-3.1-api-model-generated.json';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '3.1.0',
      projectPaths: ['./node_modules/ed-fi-model-3.1/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.1.0',
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
      manifest =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOds' ||
        manifest.shortName === 'edfiXsd' ||
        manifest.shortName === 'edfiOdsApi',
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
      R.head(state.generatorResults.filter(x => x.generatorName === 'edfiOdsApi.ApiModelGenerator')).generatedOutput,
    );

    await ffs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString, 'utf-8');
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeFilename);
    const generated: string = path.resolve(artifactPath, generatedFilename);
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritative} ${generated}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating api model targeting tech version 3.1.1 and comparing it to data standard 3.1 authoritative artifacts', () => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const authoritativeFilename = 'edfi-3.1.1-api-model-authoritative.json';
  const generatedFilename = 'edfi-3.1.1-api-model-generated.json';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '3.1.1',
      projectPaths: ['./node_modules/ed-fi-model-3.1/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.1.0',
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
      manifest =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOds' ||
        manifest.shortName === 'edfiXsd' ||
        manifest.shortName === 'edfiOdsApi',
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
      R.head(state.generatorResults.filter(x => x.generatorName === 'edfiOdsApi.ApiModelGenerator')).generatedOutput,
    );

    await ffs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString, 'utf-8');
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeFilename);
    const generated: string = path.resolve(artifactPath, generatedFilename);
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritative} ${generated}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating api model and comparing it to data standard 3.0 authoritative artifacts', () => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const authoritativeFilename = 'edfi-3.0-api-model-authoritative.json';
  const generatedFilename = 'edfi-3.0-api-model-generated.json';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '3.0.0',
      projectPaths: ['./node_modules/ed-fi-model-3.0/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.0.0',
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
      manifest =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOds' ||
        manifest.shortName === 'edfiXsd' ||
        manifest.shortName === 'edfiOdsApi',
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
      R.head(state.generatorResults.filter(x => x.generatorName === 'edfiOdsApi.ApiModelGenerator')).generatedOutput,
    );

    await ffs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString, 'utf-8');
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeFilename);
    const generated: string = path.resolve(artifactPath, generatedFilename);
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritative} ${generated}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating api model with simple extensions and comparing it to data standard 3.0 authoritative artifacts', () => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const sampleExtensionPath: string = path.resolve(__dirname, './simple-extension-project');
  const authoritativeCoreFilename = 'edfi-3.0-api-model-authoritative.json';
  const authoritativeExtensionFilename = 'edfi-3.0-api-model-simple-extension-authoritative.json';
  const generatedCoreFilename = 'edfi-3.0-api-model-core-with-simple-extension-generated.json';
  const generatedExtensionFilename = 'edfi-3.0-api-model-simple-extension-generated.json';

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '3.0.0',
      projectPaths: ['./node_modules/ed-fi-model-3.0/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.0.0',
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
    state.metaEd.dataStandardVersion = '3.0.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      manifest =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOds' ||
        manifest.shortName === 'edfiXsd' ||
        manifest.shortName === 'edfiOdsApi',
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
      state.generatorResults.filter(x => x.generatorName === 'edfiOdsApi.ApiModelGenerator'),
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
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeCore} ${generatedCore}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have no extension file differences', async () => {
    const authoritativeExtension: string = path.resolve(artifactPath, authoritativeExtensionFilename);
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeExtension} ${generatedExtension}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating api model with student transcript extensions and comparing it to data standard 3.0 authoritative artifacts', () => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const authoritativeCoreFilename = 'edfi-3.0-api-model-authoritative.json';
  const generatedCoreFilename = 'edfi-3.0-api-model-core-with-student-transcript-extension-generated.json';
  const sampleExtensionPath: string = path.resolve(__dirname, './student-transcript-extension-project');
  const authoritativeExtensionFilename = 'edfi-3.0-api-model-student-transcript-extension-authoritative.json';
  const generatedExtensionFilename = 'edfi-3.0-api-model-student-transcript-extension-generated.json';

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '3.0.0',
      projectPaths: ['./node_modules/ed-fi-model-3.0/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.0.0',
        },
        {
          projectName: 'ExtTwo',
          namespaceName: 'Exttwo',
          projectExtension: 'ExtTwo',
          projectVersion: '3.0.0',
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
      manifest =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOds' ||
        manifest.shortName === 'edfiXsd' ||
        manifest.shortName === 'edfiOdsApi',
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
      state.generatorResults.filter(x => x.generatorName === 'edfiOdsApi.ApiModelGenerator'),
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
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeCore} ${generatedCore}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have no extension file differences', async () => {
    const authoritativeExtension: string = path.resolve(artifactPath, authoritativeExtensionFilename);
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeExtension} ${generatedExtension}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating api model with simple type merge extensions and comparing it to data standard 3.1 authoritative artifacts', () => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const sampleExtensionPath: string = path.resolve(__dirname, './simple-type-merge-project');
  const authoritativeCoreFilename = 'edfi-3.1-api-model-authoritative.json';
  const authoritativeExtensionFilename = 'edfi-3.1-api-model-simple-type-merge-extension-authoritative.json';
  const generatedCoreFilename = 'edfi-3.1-api-model-core-with-simple-type-merge-generated.json';
  const generatedExtensionFilename = 'edfi-3.1-api-model-simple-type-merge-extension-generated.json';

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

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
          projectVersion: '3.1.0',
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
      manifest =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOds' ||
        manifest.shortName === 'edfiXsd' ||
        manifest.shortName === 'edfiOdsApi',
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
      state.generatorResults.filter(x => x.generatorName === 'edfiOdsApi.ApiModelGenerator'),
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
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeCore} ${generatedCore}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have no extension file differences', async () => {
    const authoritativeExtension: string = path.resolve(artifactPath, authoritativeExtensionFilename);
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeExtension} ${generatedExtension}`;
    // @ts-ignore "error" not used
    const result = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});
