// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  newNamespace,
  newDomain,
  newSubdomain,
  newDomainEntity,
  newEntityProperty,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import writeXlsxFile from 'write-excel-file';
import { enhance as dataCatalogEnhancer } from '../../src/enhancer/DataCatalogEnhancer';
import { generate } from '../../src/generator/EdFiDataStandardListingGenerator';

// Mock writeXlsxFile
jest.mock('write-excel-file', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('EdFiDataStandardListingGenerator', () => {
  let capturedData: any[][] = [];
  let capturedOptions: any = {};

  beforeEach(() => {
    capturedData = [];
    capturedOptions = {};

    // Mock writeXlsxFile to capture the data and return a mock Blob
    (writeXlsxFile as jest.Mock).mockImplementation(async (data: any[][], options: any) => {
      capturedData = data;
      capturedOptions = options;

      // Return a mock Blob with arrayBuffer method
      const mockBlob = {
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
      };
      return mockBlob;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

    // Create subdomain with undefined documentation
    const testSubdomain = newSubdomain();
    testSubdomain.metaEdName = 'TestSubdomain';
    testSubdomain.documentation = '';

    // Create entity for subdomain with undefined documentation
    const subdomainEntity = newDomainEntity();
    subdomainEntity.metaEdName = 'SubdomainEntity';
    subdomainEntity.documentation = '';

    // Create property for subdomain entity
    const subdomainProperty = newEntityProperty();
    subdomainProperty.metaEdName = 'SubdomainProperty';
    subdomainProperty.documentation = '';
    subdomainProperty.type = 'integer';

    // Wire up the relationships
    testEntity.properties = [testProperty];
    subdomainEntity.properties = [subdomainProperty];
    testSubdomain.entities = [subdomainEntity];
    testDomain.entities = [testEntity];
    testDomain.subdomains = [testSubdomain];
    testNamespace.entity.domain.set('TestDomain', testDomain);
    metaEd.namespace.set('TestNamespace', testNamespace);

    // Run the enhancer first
    dataCatalogEnhancer(metaEd);

    // Generate the result
    const result = await generate(metaEd);

    // Verify the generator result
    expect(result.generatorName).toBe('edfiDataCatalog.DataStandardListingGenerator');
    expect(result.generatedOutput).toHaveLength(1);
    expect(result.generatedOutput[0].fileName).toBe('Data-Catalog.xlsx');
    expect(result.generatedOutput[0].name).toBe('Data Standard Listing Excel');

    // Verify writeXlsxFile was called
    expect(writeXlsxFile).toHaveBeenCalledTimes(1);

    // Verify the data structure - should have 3 sheets
    expect(capturedData).toHaveLength(3);

    // Inspect the Domains worksheet (first sheet)
    const domainsData = capturedData[0];
    expect(domainsData).toHaveLength(1);
    expect(domainsData[0]).toEqual({
      projectVersion: '1.0.0',
      namespace: 'TestNamespace',
      domainName: 'TestDomain',
      domainDescription: 'Test domain description',
    });

    // Inspect the Entities worksheet (second sheet)
    const entitiesData = capturedData[1];
    expect(entitiesData).toHaveLength(2);
    expect(entitiesData[0]).toEqual({
      projectVersion: '1.0.0',
      domainName: 'TestDomain',
      namespace: 'TestNamespace',
      domainEntityName: 'TestEntity',
      domainEntityDescription: 'Test entity description',
    });
    expect(entitiesData[1]).toEqual({
      projectVersion: '1.0.0',
      domainName: 'TestSubdomain',
      namespace: 'TestNamespace',
      domainEntityName: 'SubdomainEntity',
      domainEntityDescription: '',
    });

    // Inspect the Elements worksheet (third sheet)
    // Elements are sorted by entity name, then element name
    const elementsData = capturedData[2];
    expect(elementsData).toHaveLength(2);
    // SubdomainEntity comes after TestEntity alphabetically
    expect(elementsData[0]).toEqual({
      projectVersion: '1.0.0',
      domainName: 'TestDomain',
      namespace: 'TestNamespace',
      domainEntityName: 'TestEntity',
      elementName: 'TestProperty',
      elementDescription: 'Test property description',
      isPartOfIdentity: false,
      isCollection: false,
      isRequired: false,
      isDeprecated: false,
      elementDataType: 'string(0,undefined)',
    });
    expect(elementsData[1]).toEqual({
      projectVersion: '1.0.0',
      domainName: 'TestSubdomain',
      namespace: 'TestNamespace',
      domainEntityName: 'SubdomainEntity',
      elementName: 'SubdomainProperty',
      elementDescription: '',
      isPartOfIdentity: false,
      isCollection: false,
      isRequired: false,
      isDeprecated: false,
      elementDataType: 'int32',
    });

    // Verify sheet names
    expect(capturedOptions.sheets).toEqual(['Domains', 'Entities', 'Elements']);
  });
});
