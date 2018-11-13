// @flow
import path from 'path';
import ffs from 'final-fs';
import { exec } from 'child_process';
import type { GeneratedOutput, State, GeneratorResult } from 'metaed-core';
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

describe('when generating ods tables file with simple merges', () => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v3/');
  const sampleExtensionPath: string = path.resolve(__dirname, './simple-type-merge-project');

  let generatedCoreOdsFilename: string;
  let authoritativeCoreOdsFilename: string;
  let generatedExtensionOdsFilename: string;
  let authoritativeExtensionOdsFilename: string;

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '3.1.0',
      projectPaths: ['./node_modules/ed-fi-model-3.0/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'edfi',
          projectExtension: '',
          projectVersion: '3.0.0',
        },
        {
          projectName: 'Extension',
          namespaceName: 'extension',
          projectExtension: 'Extension',
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
      manifest => manifest.shortName === 'edfiUnified' || manifest.shortName === 'edfiOds',
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

    const generatorResult: GeneratorResult = state.generatorResults.filter(
      x => x.generatorName === 'edfiOds.OdsGenerator',
    )[0];
    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    const coreFileBaseName: string = path.basename(generatedCoreOutput.fileName, '.sql');
    generatedCoreOdsFilename = `${artifactPath}/${coreFileBaseName}.sql`;
    authoritativeCoreOdsFilename = `${artifactPath}/${coreFileBaseName}-Authoritative.sql`;

    const extensionFileBaseName: string = path.basename(generatedExtensionOutput.fileName, '.sql');
    generatedExtensionOdsFilename = `${artifactPath}/SimpleType-${extensionFileBaseName}.sql`;
    authoritativeExtensionOdsFilename = `${artifactPath}/SimpleType-${extensionFileBaseName}-Authoritative.sql`;

    await ffs.writeFile(generatedCoreOdsFilename, generatedCoreOutput.resultString, 'utf-8');
    await ffs.writeFile(generatedExtensionOdsFilename, generatedExtensionOutput.resultString, 'utf-8');
  });

  it('should have core with no differences', async () => {
    expect(generatedCoreOutput).toBeDefined();
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeCoreOdsFilename} ${generatedCoreOdsFilename}`;
    const result: string = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have extension with no differences', async () => {
    expect(generatedExtensionOutput).toBeDefined();
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeExtensionOdsFilename} ${generatedExtensionOdsFilename}`;
    const result: string = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating ods foreign keys file with simple merges', () => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v3/');
  const sampleExtensionPath: string = path.resolve(__dirname, './simple-type-merge-project');

  let generatedCoreOdsFilename: string;
  let authoritativeCoreOdsFilename: string;
  let generatedExtensionOdsFilename: string;
  let authoritativeExtensionOdsFilename: string;

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '3.1.0',
      projectPaths: ['./node_modules/ed-fi-model-3.0/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'edfi',
          projectExtension: '',
          projectVersion: '3.0.0',
        },
        {
          projectName: 'Extension',
          namespaceName: 'extension',
          projectExtension: 'Extension',
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
      manifest => manifest.shortName === 'edfiUnified' || manifest.shortName === 'edfiOds',
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

    const generatorResult: GeneratorResult = state.generatorResults.filter(
      x => x.generatorName === 'edfiOds.OdsGenerator',
    )[0];
    [, , generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    const coreFileBaseName: string = path.basename(generatedCoreOutput.fileName, '.sql');
    generatedCoreOdsFilename = `${artifactPath}/${coreFileBaseName}.sql`;
    authoritativeCoreOdsFilename = `${artifactPath}/${coreFileBaseName}-Authoritative.sql`;

    const extensionFileBaseName: string = path.basename(generatedExtensionOutput.fileName, '.sql');
    generatedExtensionOdsFilename = `${artifactPath}/SimpleType-${extensionFileBaseName}.sql`;
    authoritativeExtensionOdsFilename = `${artifactPath}/SimpleType-${extensionFileBaseName}-Authoritative.sql`;

    await ffs.writeFile(generatedCoreOdsFilename, generatedCoreOutput.resultString, 'utf-8');
    await ffs.writeFile(generatedExtensionOdsFilename, generatedExtensionOutput.resultString, 'utf-8');
  });

  it('should have core with no differences', async () => {
    expect(generatedCoreOutput).toBeDefined();
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeCoreOdsFilename} ${generatedCoreOdsFilename}`;
    const result: string = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have extension with no differences', async () => {
    expect(generatedExtensionOutput).toBeDefined();
    const gitCommand: string = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeExtensionOdsFilename} ${generatedExtensionOdsFilename}`;
    const result: string = await new Promise(resolve => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: Array<string> = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});
