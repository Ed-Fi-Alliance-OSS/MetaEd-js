// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import path from 'path';
import {
  State,
  Namespace,
  newMetaEdConfiguration,
  newState,
  buildMetaEd,
  buildParseTree,
  initializeNamespaces,
  loadFileIndex,
  loadFiles,
  runEnhancers,
  setupPlugins,
  walkBuilders,
  runValidators,
} from '@edfi/metaed-core';
import { metaEdPlugins } from '../PluginHelper';

jest.setTimeout(30000);

const metaEdConfiguration = {
  ...newMetaEdConfiguration(),
  artifactDirectory: './MetaEdOutput/',
  projectPaths: [
    path.resolve(__dirname, 'projects', 'edfi'),
    path.resolve(__dirname, 'projects', 'gb'),
    path.resolve(__dirname, 'projects', 'sample'),
  ],
  projects: [
    {
      projectName: 'Ed-Fi',
      namespaceName: 'EdFi',
      projectExtension: '',
      projectVersion: '3.2.0-c',
      description: '',
    },
    {
      projectName: 'Grand Bend',
      namespaceName: 'Gb',
      projectExtension: 'GrandBend',
      projectVersion: '1.0.0',
      description: '',
    },
    {
      projectName: 'Sample',
      namespaceName: 'Sample',
      projectExtension: 'Sample',
      projectVersion: '1.0.0',
      description: '',
    },
  ],
};

describe('when building a simple core and two simple extension projects', (): void => {
  let state: State;

  beforeAll(async (): Promise<void> => {
    state = {
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
      runValidators(metaEdPlugin, state);
      await runEnhancers(metaEdPlugin, state);
    }
  });

  it('should have no validation errors', (): void => {
    expect(state.validationFailure.length).toBe(0);
  });

  it('should have core domain entity', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('EdFi');
    if (namespace == null) throw new Error();
    expect(namespace.entity.domainEntity.get('EdfiDomainEntity')).toBeDefined();
  });

  it('should have gb domain entity', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Gb');
    if (namespace == null) throw new Error();
    expect(namespace.entity.domainEntity.get('GbDomainEntity')).toBeDefined();
  });

  it('should have sample domain entity', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Sample');
    if (namespace == null) throw new Error();
    expect(namespace.entity.domainEntity.get('SampleDomainEntity')).toBeDefined();
  });

  it('should have core entity definition', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('EdFi');
    if (namespace == null) throw new Error();
    const schemaSection = namespace.data.edfiXsd.xsdSchema.sections.find(
      (s) => s.complexTypes[0] && s.complexTypes[0].name === 'EdfiDomainEntity',
    );
    expect(schemaSection).toBeDefined();
  });

  it('should have gb entity definition', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Gb');
    if (namespace == null) throw new Error();
    const schemaSection = namespace.data.edfiXsd.xsdSchema.sections.find(
      (s) => s.complexTypes[0] && s.complexTypes[0].name === 'GrandBend-GbDomainEntity',
    );
    expect(schemaSection).toBeDefined();
  });

  it('should have sample entity definition', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Sample');
    if (namespace == null) throw new Error();
    const schemaSection = namespace.data.edfiXsd.xsdSchema.sections.find(
      (s) => s.complexTypes[0] && s.complexTypes[0].name === 'Sample-SampleDomainEntity',
    );
    expect(schemaSection).toBeDefined();
  });
});
