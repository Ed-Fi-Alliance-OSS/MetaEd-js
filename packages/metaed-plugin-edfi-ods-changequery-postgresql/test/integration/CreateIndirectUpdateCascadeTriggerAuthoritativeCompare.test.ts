// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { promises as fs } from 'node:fs';
import path from 'path';
import { exec } from 'child_process';
import { GeneratedOutput, State } from '@edfi/metaed-core';
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

describe('when generating change event scripts and comparing to ODS/API 7.3 authoritative artifacts', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/indirect-update-trigger');
  const authoritativeFilename = 'IndirectUpdateTrigger-v7.3-Authoritative.sql';
  const generatedFilename = 'IndirectUpdateTrigger-v7.3.sql';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      defaultPluginTechVersion: '7.3.0',
      artifactDirectory: './MetaEdOutput/',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.2/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '5.2.0',
          description: '',
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
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runEnhancers(metaEdPlugin, state);
      await runGenerators(metaEdPlugin, state);
    }

    // eslint-disable-next-line prefer-destructuring
    generatedOutput = state.generatorResults.filter(
      (x) => x.generatorName === `${PLUGIN_NAME}.CreateIndirectUpdateCascadeTriggerGenerator`,
    )[0].generatedOutput[0];

    await fs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString);
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeFilename);
    const generated: string = path.resolve(artifactPath, generatedFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritative} ${generated}`;
    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});

describe('when generating change event scripts and comparing to ODS/API 7.3 authoritative artifacts in Alliance mode', (): void => {
  const artifactPath: string = path.resolve(__dirname, './artifact/indirect-update-trigger');
  const authoritativeFilename = 'IndirectUpdateTrigger-v7.3-Alliance-Authoritative.sql';
  const generatedFilename = 'IndirectUpdateTrigger-v7.3-Alliance.sql';

  let generatedOutput: GeneratedOutput;

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      defaultPluginTechVersion: '7.3.0',
      artifactDirectory: './MetaEdOutput/',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.2/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '5.2.0',
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
    state.metaEd.dataStandardVersion = '5.2.0';

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

    // eslint-disable-next-line prefer-destructuring
    generatedOutput = state.generatorResults.filter(
      (x) => x.generatorName === `${PLUGIN_NAME}.CreateIndirectUpdateCascadeTriggerGenerator`,
    )[0].generatedOutput[0];

    await fs.writeFile(path.resolve(artifactPath, generatedFilename), generatedOutput.resultString);
  });

  it('should have no differences', async () => {
    const authoritative: string = path.resolve(artifactPath, authoritativeFilename);
    const generated: string = path.resolve(artifactPath, generatedFilename);
    const gitCommand = `git diff --shortstat --no-index --ignore-space-at-eol --ignore-cr-at-eol -- ${authoritative} ${generated}`;
    const result = await new Promise((resolve) => exec(gitCommand, (_error, stdout) => resolve(stdout)));
    // two different ways to show no difference, depending on platform line endings
    const expectOneOf: string[] = ['', ' 1 file changed, 0 insertions(+), 0 deletions(-)\n'];
    expect(expectOneOf).toContain(result);
  });
});
