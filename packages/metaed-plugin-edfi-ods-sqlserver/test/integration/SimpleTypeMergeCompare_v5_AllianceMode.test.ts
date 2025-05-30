// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { promises as fs } from 'node:fs';
import path from 'path';
import { exec } from 'child_process';
import { GeneratedOutput, State, GeneratorResult } from '@edfi/metaed-core';
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
import { metaEdPlugins } from './PluginHelper';

jest.setTimeout(40000);

describe('when generating ods tables file with simple merges for ODS/API 5.0 in Alliance mode', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v5_AllianceMode/');
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
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2c/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0-c',
          description: '',
        },
        {
          projectName: 'Extension',
          namespaceName: 'Extension',
          projectExtension: 'Extension',
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
    state.metaEd.allianceMode = true;
    state.metaEd.dataStandardVersion = '3.2.0-c';

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

    const generatorResult: GeneratorResult = state.generatorResults.filter(
      (x) => x.generatorName === 'edfiOdsSqlServer.OdsGenerator',
    )[0];
    [generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    const coreFileBaseName: string = path.basename(generatedCoreOutput.fileName, '.sql');
    generatedCoreOdsFilename = `${artifactPath}/${coreFileBaseName}.sql`;
    authoritativeCoreOdsFilename = `${artifactPath}/${coreFileBaseName}-Authoritative.sql`;

    const extensionFileBaseName: string = path.basename(generatedExtensionOutput.fileName, '.sql');
    generatedExtensionOdsFilename = `${artifactPath}/SimpleType-${extensionFileBaseName}.sql`;
    authoritativeExtensionOdsFilename = `${artifactPath}/SimpleType-${extensionFileBaseName}-Authoritative.sql`;

    await fs.writeFile(generatedCoreOdsFilename, generatedCoreOutput.resultString);
    await fs.writeFile(generatedExtensionOdsFilename, generatedExtensionOutput.resultString);
  });

  it('should have core with no differences', async () => {
    expect(generatedCoreOutput).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-cr-at-eol --ignore-space-at-eol -- ${authoritativeCoreOdsFilename} ${generatedCoreOdsFilename}`;
    const result = await new Promise((resolve) => exec(gitCommand, (_, stdout) => resolve(stdout)));

    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have extension with no differences', async () => {
    expect(generatedExtensionOutput).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeExtensionOdsFilename} ${generatedExtensionOdsFilename}`;

    const result = await new Promise((resolve) => exec(gitCommand, (_, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating ods foreign keys file with simple merges for ODS/API v5.0 in Alliance mode', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/v5_AllianceMode/');
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
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2c/', sampleExtensionPath],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.2.0-c',
          description: '',
        },
        {
          projectName: 'Extension',
          namespaceName: 'Extension',
          projectExtension: 'Extension',
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
    state.metaEd.allianceMode = true;
    state.metaEd.dataStandardVersion = '3.2.0-c';

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

    const generatorResult: GeneratorResult = state.generatorResults.filter(
      (x) => x.generatorName === 'edfiOdsSqlServer.OdsGenerator',
    )[0];
    [, , generatedCoreOutput, generatedExtensionOutput] = generatorResult.generatedOutput;

    const coreFileBaseName: string = path.basename(generatedCoreOutput.fileName, '.sql');
    generatedCoreOdsFilename = `${artifactPath}/${coreFileBaseName}.sql`;
    authoritativeCoreOdsFilename = `${artifactPath}/${coreFileBaseName}-Authoritative.sql`;

    const extensionFileBaseName: string = path.basename(generatedExtensionOutput.fileName, '.sql');
    generatedExtensionOdsFilename = `${artifactPath}/SimpleType-${extensionFileBaseName}.sql`;
    authoritativeExtensionOdsFilename = `${artifactPath}/SimpleType-${extensionFileBaseName}-Authoritative.sql`;

    await fs.writeFile(generatedCoreOdsFilename, generatedCoreOutput.resultString);
    await fs.writeFile(generatedExtensionOdsFilename, generatedExtensionOutput.resultString);
  });

  it('should have core with no differences', async () => {
    expect(generatedCoreOutput).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeCoreOdsFilename} ${generatedCoreOdsFilename}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });

  it('should have extension with no differences', async () => {
    expect(generatedExtensionOutput).toBeDefined();
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritativeExtensionOdsFilename} ${generatedExtensionOdsFilename}`;
    // @ts-ignore "error" not used
    const result = await new Promise((resolve) => exec(gitCommand, (error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});
