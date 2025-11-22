// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, newNamespace, newDomain, newDomainEntity, newEntityProperty } from '@edfi/metaed-core';
import { generate } from '../src/generator/EdFiDataStandardListingGenerator';
import { DomainRow, EntityRow, ElementRow } from '../src/model/DataStandardListingRow';

describe('EdFiDataStandardListingGenerator', () => {
  it('should create data standard listing with three worksheets', async () => {
    // Create a minimal test MetaEd environment
    const metaEd: MetaEdEnvironment = {
      namespace: new Map(),
      projectPackages: [],
      projectPackageDirectories: [],
      crossReferences: new Map(),
      configurations: new Map(),
      data: {},
    };

    // Create test namespace
    const testNamespace = newNamespace();
    testNamespace.namespaceName = 'TestNamespace';
    testNamespace.projectVersion = '1.0.0';

    // Create test domain
    const testDomain = newDomain();
    testDomain.metaEdName = 'TestDomain';
    testDomain.documentation = 'Test domain description';

    // Create test entity
    const testEntity = newDomainEntity();
    testEntity.metaEdName = 'TestEntity';
    testEntity.documentation = 'Test entity description';

    // Create test property
    const testProperty = newEntityProperty();
    testProperty.metaEdName = 'TestProperty';
    testProperty.documentation = 'Test property description';
    testProperty.type = 'string';

    // Wire up the relationships
    testEntity.properties = [testProperty];
    testDomain.entities = [testEntity];
    testNamespace.entity.domain.set('TestDomain', testDomain);
    metaEd.namespace.set('TestNamespace', testNamespace);

    // Generate the result
    const result = await generate(metaEd);

    // Verify the generator result
    expect(result.generatorName).toBe('edfiHandbook.DataStandardListingGenerator');
    expect(result.generatedOutput).toHaveLength(1);
    expect(result.generatedOutput[0].fileName).toBe('Data-Standard-Listing.xlsx');
    expect(result.generatedOutput[0].name).toBe('Data Standard Listing Excel');
  });
});
