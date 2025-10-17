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

describe('when generating api model and comparing it to data standard 4.0 authoritative artifacts', (): void => {
  const metaEdConfiguration = {
    ...newMetaEdConfiguration(),
    artifactDirectory: './MetaEdOutput/',
    defaultPluginTechVersion,
    projectPaths: ['./node_modules/@edfi/ed-fi-model-4.0/'],
    projects: [
      {
        projectName: 'Ed-Fi',
        namespaceName: 'EdFi',
        projectExtension: '',
        projectVersion: '4.0.0',
        description: '',
      },
    ],
  };

  const state: State = {
    ...newState(),
    metaEdConfiguration,
    metaEdPlugins: metaEdPlugins(),
  };
  state.metaEd.dataStandardVersion = '4.0.0';
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
