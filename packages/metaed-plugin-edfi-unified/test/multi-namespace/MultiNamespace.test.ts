// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import path from 'path';
import {
  newMetaEdConfiguration,
  newState,
  buildMetaEd,
  buildParseTree,
  initializeNamespaces,
  loadFileIndex,
  loadFiles,
  runEnhancers,
  runValidators,
  setupPlugins,
  walkBuilders,
  ReferentialProperty,
} from '@edfi/metaed-core';
import { State } from '@edfi/metaed-core';
import { metaEdPlugins } from './PluginHelper';

jest.setTimeout(100000);

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

  beforeAll(async () => {
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

  it('should have extension domain entities referencing core entity (meaning unified enhancers ran)', (): void => {
    const coreNamespace = state.metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    const edfiDomainEntity = coreNamespace.entity.domainEntity.get('EdfiDomainEntity');
    if (edfiDomainEntity == null) throw new Error();
    expect(edfiDomainEntity.namespace.namespaceName).toBe('EdFi');

    const gbNamespace = state.metaEd.namespace.get('Gb');
    if (gbNamespace == null) throw new Error();
    const gbDomainEntity = gbNamespace.entity.domainEntity.get('GbDomainEntity');
    if (gbDomainEntity == null) throw new Error();
    expect(gbDomainEntity.namespace.namespaceName).toBe('Gb');
    expect(gbDomainEntity.properties[2].metaEdName).toBe('EdfiDomainEntity');
    expect((gbDomainEntity.properties[2] as ReferentialProperty).referencedEntity).toBe(edfiDomainEntity);

    const sampleNamespace = state.metaEd.namespace.get('Sample');
    if (sampleNamespace == null) throw new Error();
    const sampleDomainEntity = sampleNamespace.entity.domainEntity.get('SampleDomainEntity');
    if (sampleDomainEntity == null) throw new Error();
    expect(sampleDomainEntity.namespace.namespaceName).toBe('Sample');
    expect(sampleDomainEntity.properties[2].metaEdName).toBe('EdfiDomainEntity');
    expect((sampleDomainEntity.properties[2] as ReferentialProperty).referencedEntity).toBe(edfiDomainEntity);
  });
});
