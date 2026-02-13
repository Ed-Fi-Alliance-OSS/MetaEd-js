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
  EntityProperty,
} from '@edfi/metaed-core';
import { enhance as dataCatalogEnhancer, extractDataType } from '../../src/enhancer/DataCatalogEnhancer';
import { NamespaceDataCatalogData } from '../../src/model/NamespaceDataCatalogData';

describe('DataCatalogEnhancer', () => {
  it('should extract and store domain, entity, and element data on namespace', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const testNamespace = newNamespace();
    testNamespace.namespaceName = 'TestNamespace';
    testNamespace.projectVersion = '1.0.0';

    const testDomain = newDomain();
    testDomain.metaEdName = 'TestDomain';
    testDomain.documentation = 'Test domain description';

    const testEntity = newDomainEntity();
    testEntity.metaEdName = 'TestEntity';
    testEntity.documentation = 'Test entity description';

    const testProperty = newEntityProperty();
    testProperty.metaEdName = 'TestProperty';
    testProperty.documentation = 'Test property description';
    testProperty.type = 'string';
    testProperty.isPartOfIdentity = true;
    testProperty.isCollection = false;
    testProperty.isRequired = true;
    testProperty.isDeprecated = false;

    const testSubdomain = newSubdomain();
    testSubdomain.metaEdName = 'TestSubdomain';
    testSubdomain.documentation = 'Test subdomain description';

    const subdomainEntity = newDomainEntity();
    subdomainEntity.metaEdName = 'SubdomainEntity';
    subdomainEntity.documentation = 'Subdomain entity description';

    const subdomainProperty = newEntityProperty();
    subdomainProperty.metaEdName = 'SubdomainProperty';
    subdomainProperty.documentation = 'Subdomain property description';
    subdomainProperty.type = 'integer';
    subdomainProperty.isPartOfIdentity = false;
    subdomainProperty.isCollection = true;
    subdomainProperty.isRequired = false;
    subdomainProperty.isDeprecated = true;

    testEntity.properties = [testProperty];
    subdomainEntity.properties = [subdomainProperty];
    testSubdomain.entities = [subdomainEntity];
    testDomain.entities = [testEntity];
    testDomain.subdomains = [testSubdomain];
    testNamespace.entity.domain.set('TestDomain', testDomain);
    metaEd.namespace.set('TestNamespace', testNamespace);

    const result = dataCatalogEnhancer(metaEd);

    expect(result.enhancerName).toBe('DataCatalogEnhancer');
    expect(result.success).toBe(true);

    const dataCatalogData = testNamespace.data.edfiDataCatalog as NamespaceDataCatalogData;
    expect(dataCatalogData).toBeDefined();

    expect(dataCatalogData.domainRows).toHaveLength(1);
    expect(dataCatalogData.domainRows[0]).toMatchInlineSnapshot(`
{
  "domainDescription": "Test domain description",
  "domainName": "TestDomain",
  "namespace": "TestNamespace",
  "projectVersion": "1.0.0",
}
`);

    expect(dataCatalogData.entityRows).toHaveLength(2);
    expect(dataCatalogData.entityRows[0]).toMatchInlineSnapshot(`
{
  "domainEntityDescription": "Test entity description",
  "domainEntityName": "TestEntity",
  "domainName": "TestDomain",
  "namespace": "TestNamespace",
  "projectVersion": "1.0.0",
}
`);
    expect(dataCatalogData.entityRows[1]).toMatchInlineSnapshot(`
{
  "domainEntityDescription": "Subdomain entity description",
  "domainEntityName": "SubdomainEntity",
  "domainName": "TestSubdomain",
  "namespace": "TestNamespace",
  "projectVersion": "1.0.0",
}
`);

    expect(dataCatalogData.elementRows).toHaveLength(2);
    expect(dataCatalogData.elementRows[0]).toMatchInlineSnapshot(`
{
  "domainEntityName": "SubdomainEntity",
  "domainName": "TestSubdomain",
  "elementDataType": "int32",
  "elementDescription": "Subdomain property description",
  "elementName": "SubdomainProperty",
  "isCollection": true,
  "isDeprecated": true,
  "isPartOfIdentity": false,
  "isRequired": false,
  "namespace": "TestNamespace",
  "projectVersion": "1.0.0",
}
`);
    expect(dataCatalogData.elementRows[1]).toMatchInlineSnapshot(`
{
  "domainEntityName": "TestEntity",
  "domainName": "TestDomain",
  "elementDataType": "string(0,undefined)",
  "elementDescription": "Test property description",
  "elementName": "TestProperty",
  "isCollection": false,
  "isDeprecated": false,
  "isPartOfIdentity": true,
  "isRequired": true,
  "namespace": "TestNamespace",
  "projectVersion": "1.0.0",
}
`);
  });

  it('should handle multiple namespaces', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    const namespace1 = newNamespace();
    namespace1.namespaceName = 'Namespace1';
    namespace1.projectVersion = '1.0.0';

    const namespace2 = newNamespace();
    namespace2.namespaceName = 'Namespace2';
    namespace2.projectVersion = '2.0.0';

    const domain1 = newDomain();
    domain1.metaEdName = 'Domain1';
    domain1.documentation = 'Domain 1';

    const domain2 = newDomain();
    domain2.metaEdName = 'Domain2';
    domain2.documentation = 'Domain 2';

    namespace1.entity.domain.set('Domain1', domain1);
    namespace2.entity.domain.set('Domain2', domain2);

    metaEd.namespace.set('Namespace1', namespace1);
    metaEd.namespace.set('Namespace2', namespace2);

    dataCatalogEnhancer(metaEd);

    const data1 = namespace1.data.edfiDataCatalog as NamespaceDataCatalogData;
    const data2 = namespace2.data.edfiDataCatalog as NamespaceDataCatalogData;

    expect(data1.domainRows).toHaveLength(1);
    expect(data1.domainRows[0].namespace).toBe('Namespace1');
    expect(data1.domainRows[0].domainName).toBe('Domain1');

    expect(data2.domainRows).toHaveLength(1);
    expect(data2.domainRows[0].namespace).toBe('Namespace2');
    expect(data2.domainRows[0].domainName).toBe('Domain2');
  });

  describe('extractDataType', () => {
    it('should return empty string for unknown type', () => {
      const property = { type: 'unknown' } as EntityProperty;
      expect(extractDataType(property)).toBe('');
    });

    it('should return "reference" for association type', () => {
      const property = { type: 'association' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return "Boolean" for boolean type', () => {
      const property = { type: 'boolean' } as EntityProperty;
      expect(extractDataType(property)).toBe('Boolean');
    });

    it('should return "reference" for choice type', () => {
      const property = { type: 'choice' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return "reference" for common type', () => {
      const property = { type: 'common' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return "decimal(19,4)" for currency type', () => {
      const property = { type: 'currency' } as EntityProperty;
      expect(extractDataType(property)).toBe('decimal(19,4)');
    });

    it('should return "date" for date type', () => {
      const property = { type: 'date' } as EntityProperty;
      expect(extractDataType(property)).toBe('date');
    });

    it('should return "timestamp" for datetime type', () => {
      const property = { type: 'datetime' } as EntityProperty;
      expect(extractDataType(property)).toBe('timestamp');
    });

    it('should return formatted decimal for decimal type', () => {
      const property = { type: 'decimal', totalDigits: 10, decimalPlaces: 2 } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('decimal(10, 2)');
    });

    it('should return "descriptor" for descriptor type', () => {
      const property = { type: 'descriptor' } as EntityProperty;
      expect(extractDataType(property)).toBe('descriptor');
    });

    it('should return "reference" for domainEntity type', () => {
      const property = { type: 'domainEntity' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return "string(30)" for duration type', () => {
      const property = { type: 'duration' } as EntityProperty;
      expect(extractDataType(property)).toBe('string(30)');
    });

    it('should return "reference" for enumeration type', () => {
      const property = { type: 'enumeration' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return "reference" for inlineCommon type', () => {
      const property = { type: 'inlineCommon' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return "int32" for integer type without big hint', () => {
      const property = { type: 'integer', hasBigHint: false } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('int32');
    });

    it('should return "int64" for integer type with big hint', () => {
      const property = { type: 'integer', hasBigHint: true } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('int64');
    });

    it('should return "decimal(5, 4)" for percent type', () => {
      const property = { type: 'percent' } as EntityProperty;
      expect(extractDataType(property)).toBe('decimal(5, 4)');
    });

    it('should return "reference" for schoolYearEnumeration type', () => {
      const property = { type: 'schoolYearEnumeration' } as EntityProperty;
      expect(extractDataType(property)).toBe('reference');
    });

    it('should return formatted decimal for sharedDecimal type', () => {
      const property = { type: 'sharedDecimal', totalDigits: 15, decimalPlaces: 3 } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('decimal(15, 3)');
    });

    it('should return "int32" for sharedInteger type without big hint', () => {
      const property = { type: 'sharedInteger', hasBigHint: false } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('int32');
    });

    it('should return "int64" for sharedInteger type with big hint', () => {
      const property = { type: 'sharedInteger', hasBigHint: true } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('int64');
    });

    it('should return "int16" for sharedShort type', () => {
      const property = { type: 'sharedShort' } as EntityProperty;
      expect(extractDataType(property)).toBe('int16');
    });

    it('should return formatted string for sharedString type with minLength and maxLength', () => {
      const property = { type: 'sharedString', minLength: 5, maxLength: 100 } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('string(5,100)');
    });

    it('should return formatted string for sharedString type with only maxLength', () => {
      const property = { type: 'sharedString', maxLength: 50 } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('string(0,50)');
    });

    it('should return "int16" for short type', () => {
      const property = { type: 'short' } as EntityProperty;
      expect(extractDataType(property)).toBe('int16');
    });

    it('should return formatted string for string type with minLength and maxLength', () => {
      const property = { type: 'string', minLength: 1, maxLength: 255 } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('string(1,255)');
    });

    it('should return formatted string for string type with only maxLength', () => {
      const property = { type: 'string', maxLength: 200 } as unknown as EntityProperty;
      expect(extractDataType(property)).toBe('string(0,200)');
    });

    it('should return "time" for time type', () => {
      const property = { type: 'time' } as EntityProperty;
      expect(extractDataType(property)).toBe('time');
    });

    it('should return "int16" for year type', () => {
      const property = { type: 'year' } as EntityProperty;
      expect(extractDataType(property)).toBe('int16');
    });
  });
});
