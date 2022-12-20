import { promises as fs } from 'node:fs';
import * as R from 'ramda';
import path from 'path';
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

jest.setTimeout(40000);

describe('when generating api model and comparing it to data standard 3.1 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const authoritativeFilename = 'edfi-3.1-api-model-authoritative.json';
  const generatedFilename = 'edfi-3.1-api-model-generated.json';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
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
    };
    state.metaEd.dataStandardVersion = '3.1.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
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
      R.head(state.generatorResults.filter((x) => x.generatorName === 'edfiOdsApi.ApiModelGenerator')).generatedOutput,
    );

    await fs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString);
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

describe('when generating api model targeting tech version 3.1.1 and comparing it to data standard 3.1 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const authoritativeFilename = 'edfi-3.1.1-api-model-authoritative.json';
  const generatedFilename = 'edfi-3.1.1-api-model-generated.json';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '3.1.1',
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
    };
    state.metaEd.dataStandardVersion = '3.1.0';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
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
      R.head(state.generatorResults.filter((x) => x.generatorName === 'edfiOdsApi.ApiModelGenerator')).generatedOutput,
    );

    await fs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString);
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

describe('when generating api model and comparing it to data standard 3.0 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const authoritativeFilename = 'edfi-3.0-api-model-authoritative.json';
  const generatedFilename = 'edfi-3.0-api-model-generated.json';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '3.0.0',
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
      R.head(state.generatorResults.filter((x) => x.generatorName === 'edfiOdsApi.ApiModelGenerator')).generatedOutput,
    );

    await fs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString);
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

describe('when generating api model with simple extensions and comparing it to data standard 3.0 authoritative artifacts', (): void => {
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
      state.generatorResults.filter((x) => x.generatorName === 'edfiOdsApi.ApiModelGenerator'),
    );

    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    await fs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString);
    await fs.writeFile(path.resolve(artifactPath, generatedExtensionFilename), generatedExtensionOutput.resultString);
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

describe('when generating api model with student transcript extensions and comparing it to data standard 3.0 authoritative artifacts', (): void => {
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
          projectName: 'ExtTwo',
          namespaceName: 'Exttwo',
          projectExtension: 'ExtTwo',
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
      state.generatorResults.filter((x) => x.generatorName === 'edfiOdsApi.ApiModelGenerator'),
    );

    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    await fs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString);
    await fs.writeFile(path.resolve(artifactPath, generatedExtensionFilename), generatedExtensionOutput.resultString);
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

describe('when generating api model with simple type merge extensions and comparing it to data standard 3.1 authoritative artifacts', (): void => {
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
          projectVersion: '3.1.0',
          description: '',
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
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
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
      state.generatorResults.filter((x) => x.generatorName === 'edfiOdsApi.ApiModelGenerator'),
    );

    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    await fs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString);
    await fs.writeFile(path.resolve(artifactPath, generatedExtensionFilename), generatedExtensionOutput.resultString);
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

describe('when generating api model targeting tech version 3.3 and comparing it to data standard 3.2a authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const authoritativeFilename = 'edfi-3.3-api-model-authoritative.json';
  const generatedFilename = 'edfi-3.3-api-model-generated.json';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '3.3.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2a/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0-a',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.2.0-a';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsPostgresql' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
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
      R.head(state.generatorResults.filter((x) => x.generatorName === 'edfiOdsApi.ApiModelGenerator')).generatedOutput,
    );

    await fs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString);
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

describe('when generating api model targeting tech version 3.4 with simple extensions and comparing it to data standard 3.2b authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const sampleExtensionPath: string = path.resolve(__dirname, './simple-extension-project');
  const authoritativeCoreFilename = 'edfi-3.4-api-model-authoritative.json';
  const authoritativeExtensionFilename = 'edfi-3.4-api-model-simple-extension-authoritative.json';
  const generatedCoreFilename = 'edfi-3.4-api-model-core-with-simple-extension-generated.json';
  const generatedExtensionFilename = 'edfi-3.4-api-model-simple-extension-generated.json';

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '3.4.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2b/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0-b',
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
    state.metaEd.dataStandardVersion = '3.2.0-b';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsPostgresql' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
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
      state.generatorResults.filter((x) => x.generatorName === 'edfiOdsApi.ApiModelGenerator'),
    );

    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    await fs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString);
    await fs.writeFile(path.resolve(artifactPath, generatedExtensionFilename), generatedExtensionOutput.resultString);
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

describe('when generating api model targeting tech version 5.2 with comparing it to data standard 3.3a authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const authoritativeCoreFilename = 'edfi-5.2-api-model-authoritative.json';
  const generatedCoreFilename = 'edfi-5.2-api-model-generated.json';

  let generatedCoreOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '5.2.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.3a/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.3.0-a',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.3.0-a';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsPostgresql' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
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
      state.generatorResults.filter((x) => x.generatorName === 'edfiOdsApi.ApiModelGenerator'),
    );

    [generatedCoreOutput] = generatorResult.generatedOutput;

    await fs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString);
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
});

describe('when generating api model targeting tech version 5.3 with comparing it to data standard 3.3b authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const authoritativeCoreFilename = 'edfi-5.3-api-model-authoritative.json';
  const generatedCoreFilename = 'edfi-5.3-api-model-generated.json';

  let generatedCoreOutput: GeneratedOutput;

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
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.3.1-b';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsPostgresql' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
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
      state.generatorResults.filter((x) => x.generatorName === 'edfiOdsApi.ApiModelGenerator'),
    );

    [generatedCoreOutput] = generatorResult.generatedOutput;

    await fs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString);
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
});

describe('when generating api model targeting tech version 7.0 with comparing it to data standard 3.3b authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact');
  const authoritativeCoreFilename = 'edfi-7.0-api-model-authoritative.json';
  const generatedCoreFilename = 'edfi-7.0-api-model-generated.json';

  let generatedCoreOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '7.0.0',
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
      metaEdConfiguration,
    };
    state.metaEd.dataStandardVersion = '3.3.1-b';

    validateConfiguration(state);
    loadPlugins(state);
    state.pluginManifest = state.pluginManifest.filter(
      (manifest) =>
        manifest.shortName === 'edfiUnified' ||
        manifest.shortName === 'edfiOdsRelational' ||
        manifest.shortName === 'edfiOdsPostgresql' ||
        manifest.shortName === 'edfiOdsSqlServer' ||
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
      state.generatorResults.filter((x) => x.generatorName === 'edfiOdsApi.ApiModelGenerator'),
    );

    [generatedCoreOutput] = generatorResult.generatedOutput;

    await fs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString);
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
});
