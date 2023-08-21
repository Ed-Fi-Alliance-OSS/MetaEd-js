import { promises as fs } from 'node:fs';
import * as R from 'ramda';
import path from 'path';
import { exec } from 'child_process';
import { GeneratedOutput, GeneratorResult, State } from '@edfi/metaed-core';
import {
  buildMetaEd,
  buildParseTree,
  loadFileIndex,
  loadFiles,
  setupPlugins,
  initializeNamespaces,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  runGenerators,
  walkBuilders,
} from '@edfi/metaed-core';
import { PLUGIN_NAME } from '../../src/PluginHelper';
import { metaEdPlugins } from './PluginTestHelper';

jest.setTimeout(40000);

describe('when generating add column changeversion and comparing to ODS/API 5.0 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/add-column-changeversion');
  const authoritativeCoreFilename = 'AddColumnChangeVersion-v5.0-Authoritative.sql';
  const generatedCoreFilename = 'AddColumnChangeVersion-v5.0.sql';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '5.0.0',
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
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '3.2.0';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runEnhancers(metaEdPlugin, state);
      await runGenerators(metaEdPlugin, state);
    }

    generatedOutput = R.head(
      R.head(
        state.generatorResults.filter((x) => x.generatorName === `${PLUGIN_NAME}.AddColumnChangeVersionForTableGenerator`),
      ).generatedOutput,
    );

    await fs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedOutput.resultString);
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeCoreFilename);
    const generated: string = path.resolve(artifactPath, generatedCoreFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritative} ${generated}`;
    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating add column changeversion with simple extensions and comparing to ODS/API 6.0.0 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/add-column-changeversion');
  const sampleExtensionPath: string = path.resolve(__dirname, './student-transcript-extension-project');
  const authoritativeCoreFilename = 'AddColumnChangeVersion-v6.0-Authoritative.sql';
  const generatedCoreFilename = 'AddColumnChangeVersion-v6.0.sql';
  const authoritativeExtensionFilename = 'sample-AddColumnChangeVersion-v6.0-Authoritative.sql';
  const generatedExtensionFilename = 'sample-AddColumnChangeVersion-v6.0.sql';

  let generatedCoreOutput: GeneratedOutput;
  let generatedExtensionOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '6.0.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-4.0a/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '4.0.0-a',
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
    state.metaEd.dataStandardVersion = '4.0.0-a';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runEnhancers(metaEdPlugin, state);
      await runGenerators(metaEdPlugin, state);
    }

    const generatorResult: GeneratorResult = R.head(
      state.generatorResults.filter((x) => x.generatorName === `${PLUGIN_NAME}.AddColumnChangeVersionForTableGenerator`),
    );

    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    await fs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString);
    await fs.writeFile(path.resolve(artifactPath, generatedExtensionFilename), generatedExtensionOutput.resultString);
  });

  it('should have no core file differences', async () => {
    const authoritativeCore: string = path.resolve(artifactPath, authoritativeCoreFilename);
    const generatedCore: string = path.resolve(artifactPath, generatedCoreFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeCore} ${generatedCore}`;
    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have no extension file differences', async () => {
    const authoritativeExtension: string = path.resolve(artifactPath, authoritativeExtensionFilename);
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol -- ${authoritativeExtension} ${generatedExtension}`;
    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});
