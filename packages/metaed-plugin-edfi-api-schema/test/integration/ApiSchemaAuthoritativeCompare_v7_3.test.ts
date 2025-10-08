// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { promises as fs } from 'node:fs';
import path from 'path';
import { exec } from 'child_process';
import {
  State,
  buildMetaEd,
  buildParseTree,
  loadFileIndex,
  loadFiles,
  setupPlugins,
  initializeNamespaces,
  loadPluginConfiguration,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  runGenerators,
  walkBuilders,
  GeneratorResult,
} from '@edfi/metaed-core';
import { metaEdPlugins } from './PluginHelper';
import { createFlatteningReportPath, runFlatteningValidator } from './FlatteningMetadataValidation';

jest.setTimeout(40000);

describe('when generating ApiSchema for data standard 5.2 and TPDM 1.1 for ODS/API 7.3', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v7_3/');
  const authoritativeCoreFilename = 'ds-5.2-api-schema-authoritative.json';
  const generatedCoreFilename = 'ds-5.2-api-schema-generated.json';
  const authoritativeExtensionFilename = 'tpdm-api-schema-authoritative.json';
  const generatedExtensionFilename = 'tpdm-api-schema-generated.json';

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '7.3.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.2/', path.resolve(__dirname, './tpdm-project')],
      pluginConfigDirectories: [path.resolve(__dirname)],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '5.2.0',
          description: 'The Ed-Fi Data Standard v5.2',
        },
        {
          projectName: 'TPDM',
          namespaceName: 'TPDM',
          projectExtension: 'TPDM',
          projectVersion: '1.1.0',
          description: 'TPDM-Core',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '5.2.0';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    await loadPluginConfiguration(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runEnhancers(metaEdPlugin, state);
      await runGenerators(metaEdPlugin, state);
    }

    const generatorResult: GeneratorResult = state.generatorResults.filter(
      (x) => x.generatorName === 'edfiApiSchema.ApiSchemaGenerator',
    )[0];
    const [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    await fs.writeFile(path.resolve(artifactPath, generatedCoreFilename), generatedCoreOutput.resultString);
    await fs.writeFile(path.resolve(artifactPath, generatedExtensionFilename), generatedExtensionOutput.resultString);
  });

  it('should have complete flattening metadata coverage', async () => {
    const generatedCorePath: string = path.resolve(artifactPath, generatedCoreFilename);
    const coreReportPath: string = createFlatteningReportPath(artifactPath, generatedCoreFilename);
    await runFlatteningValidator(generatedCorePath, coreReportPath);

    const generatedExtensionPath: string = path.resolve(artifactPath, generatedExtensionFilename);
    const extensionReportPath: string = createFlatteningReportPath(artifactPath, generatedExtensionFilename);
    await runFlatteningValidator(generatedExtensionPath, extensionReportPath);
  });

  it('should have no DS file differences', async () => {
    const authoritativeCore: string = path.resolve(artifactPath, authoritativeCoreFilename);
    const generatedCore: string = path.resolve(artifactPath, generatedCoreFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeCore} ${generatedCore}`;

    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have no TPDM file differences', async () => {
    const authoritativeExtension: string = path.resolve(artifactPath, authoritativeExtensionFilename);
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeExtension} ${generatedExtension}`;

    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

// Sample
describe('when generating ApiSchema for data standard 5.2 and Sample 1.1 for ODS/API 7.3', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v7_3/');
  const authoritativeExtensionFilename = 'sample-api-schema-authoritative.json';
  const generatedExtensionFilename = 'sample-api-schema-generated.json';

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '7.3.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.2/', path.resolve(__dirname, './sample-project')],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '5.2.0',
          description: 'The Ed-Fi Data Standard v5.2',
        },
        {
          projectName: 'Sample',
          namespaceName: 'Sample',
          projectExtension: 'Sample',
          projectVersion: '1.1.0',
          description: 'Sample-Core',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '5.2.0';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    await loadPluginConfiguration(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runEnhancers(metaEdPlugin, state);
      await runGenerators(metaEdPlugin, state);
    }

    const generatorResult: GeneratorResult = state.generatorResults.filter(
      (x) => x.generatorName === 'edfiApiSchema.ApiSchemaGenerator',
    )[0];
    const [, generatedExtensionOutput] = generatorResult.generatedOutput;

    await fs.writeFile(path.resolve(artifactPath, generatedExtensionFilename), generatedExtensionOutput.resultString);
  });

  it('should have no Sample file differences', async () => {
    const authoritativeExtension: string = path.resolve(artifactPath, authoritativeExtensionFilename);
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeExtension} ${generatedExtension}`;

    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have complete flattening metadata coverage', async () => {
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const reportPath: string = createFlatteningReportPath(artifactPath, generatedExtensionFilename);
    await runFlatteningValidator(generatedExtension, reportPath);
  });
});

// Homograph
describe('when generating ApiSchema for data standard 5.2 and Homograph 1.0 for ODS/API 7.3', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v7_3/');
  const authoritativeExtensionFilename = 'homograph-api-schema-authoritative.json';
  const generatedExtensionFilename = 'homograph-api-schema-generated.json';

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '7.3.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.2/', path.resolve(__dirname, './homograph-project')],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '5.2.0',
          description: 'The Ed-Fi Data Standard v5.2',
        },
        {
          projectName: 'Homograph',
          namespaceName: 'Homograph',
          projectExtension: 'Homograph',
          projectVersion: '1.0.0',
          description: 'Homograph',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '5.2.0';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    await loadPluginConfiguration(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runEnhancers(metaEdPlugin, state);
      await runGenerators(metaEdPlugin, state);
    }

    const generatorResult: GeneratorResult = state.generatorResults.filter(
      (x) => x.generatorName === 'edfiApiSchema.ApiSchemaGenerator',
    )[0];
    const [, generatedExtensionOutput] = generatorResult.generatedOutput;

    await fs.writeFile(path.resolve(artifactPath, generatedExtensionFilename), generatedExtensionOutput.resultString);
  });

  it('should have no Homograph file differences', async () => {
    const authoritativeExtension: string = path.resolve(artifactPath, authoritativeExtensionFilename);
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeExtension} ${generatedExtension}`;

    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have complete flattening metadata coverage', async () => {
    const generatedExtension: string = path.resolve(artifactPath, generatedExtensionFilename);
    const reportPath: string = createFlatteningReportPath(artifactPath, generatedExtensionFilename);
    await runFlatteningValidator(generatedExtension, reportPath);
  });
});
