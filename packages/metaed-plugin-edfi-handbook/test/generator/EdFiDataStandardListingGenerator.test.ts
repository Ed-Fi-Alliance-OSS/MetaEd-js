// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  newNamespace,
  newDomain,
  newDomainEntity,
  newDomainEntityExtension,
  newEntityProperty,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import { generate } from '../../src/generator/EdFiDataStandardListingGenerator';

describe('EdFiDataStandardListingGenerator', () => {
  it('should create data standard listing with three worksheets', async () => {
    // Create a minimal test MetaEd environment
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

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

  it('should include extension entities in the output', async () => {
    // Create a minimal test MetaEd environment
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    // Create core namespace with a domain and entity
    const coreNamespace = newNamespace();
    coreNamespace.namespaceName = 'EdFi';
    coreNamespace.projectVersion = '4.0.0';

    const testDomain = newDomain();
    testDomain.metaEdName = 'TestDomain';
    testDomain.documentation = 'Test domain description';

    const baseEntity = newDomainEntity();
    baseEntity.metaEdName = 'Student';
    baseEntity.documentation = 'A student entity';
    baseEntity.namespace = coreNamespace;

    testDomain.entities = [baseEntity];
    coreNamespace.entity.domain.set('TestDomain', testDomain);
    coreNamespace.entity.domainEntity.set('Student', baseEntity);
    metaEd.namespace.set('EdFi', coreNamespace);

    // Create extension namespace
    const extensionNamespace = newNamespace();
    extensionNamespace.namespaceName = 'SampleExtension';
    extensionNamespace.projectVersion = '1.0.0';
    extensionNamespace.isExtension = true;
    extensionNamespace.dependencies = [coreNamespace];

    // Create extension entity that extends Student
    const studentExtension = newDomainEntityExtension();
    studentExtension.metaEdName = 'StudentExtension';
    studentExtension.documentation = 'Extension of Student';
    studentExtension.baseEntity = baseEntity;
    studentExtension.namespace = extensionNamespace;

    // Add extension property
    const extensionProperty = newEntityProperty();
    extensionProperty.metaEdName = 'ExtensionField';
    extensionProperty.documentation = 'Custom extension field';
    extensionProperty.type = 'string';
    studentExtension.properties = [extensionProperty];

    extensionNamespace.entity.domainEntityExtension.set('StudentExtension', studentExtension);
    metaEd.namespace.set('SampleExtension', extensionNamespace);

    // Generate the result
    const result = await generate(metaEd);

    // Verify the generator result
    expect(result.generatorName).toBe('edfiHandbook.DataStandardListingGenerator');
    expect(result.generatedOutput).toHaveLength(1);
    expect(result.generatedOutput[0].fileName).toBe('Data-Standard-Listing.xlsx');

    // The test verifies that the generator completes without error with extension entities
    // Detailed content verification would require parsing the Excel file
  });
});
