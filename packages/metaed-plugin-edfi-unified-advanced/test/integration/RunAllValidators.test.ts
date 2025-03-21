// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import path from 'path';
import {
  defaultPluginTechVersion,
  State,
  ValidationFailure,
  buildMetaEd,
  buildParseTree,
  loadFileIndex,
  loadFiles,
  setupPlugins,
  initializeNamespaces,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  runValidators,
  walkBuilders,
} from '@edfi/metaed-core';
import { metaEdPlugins } from '../PluginHelper';

jest.setTimeout(100000);

describe('when running enhancers and validators against DS 3.2c and a simple extension', (): void => {
  const sampleExtensionPath: string = path.resolve(__dirname, './simple-extension-project');
  let failures: ValidationFailure[] = [];

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion,
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
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '3.2.0-c';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runValidators(metaEdPlugin, state);
      await runEnhancers(metaEdPlugin, state);
    }

    failures = state.validationFailure;
  });

  it('should have no failures', async () => {
    expect(failures.length).toBe(0);
  });
});
