// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  defaultPluginTechVersion,
  newMetaEdConfiguration,
  newState,
  State,
  setupPlugins,
  loadFiles,
  loadFileIndex,
  buildParseTree,
  walkBuilders,
  initializeNamespaces,
  runValidators,
  runEnhancers,
  buildMetaEd,
} from '@edfi/metaed-core';
import { metaEdPlugins } from '../../PluginHelper';

jest.setTimeout(100000);

describe('when generating api model and comparing it to data standard 3.1 authoritative artifacts', (): void => {
  const metaEdConfiguration = {
    ...newMetaEdConfiguration(),
    artifactDirectory: './MetaEdOutput/',
    defaultPluginTechVersion,
    projectPaths: ['./node_modules/@edfi/ed-fi-model-3.2c/'],
    projects: [
      {
        projectName: 'Ed-Fi',
        namespaceName: 'EdFi',
        projectExtension: '',
        projectVersion: '3.2.0-c',
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
  beforeAll(async () => {
    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      runValidators(metaEdPlugin, state);
      await runEnhancers(metaEdPlugin, state);
    }
  });

  it('should have no validation errors', async () => {
    expect(state.validationFailure).toHaveLength(0);
  });
});
