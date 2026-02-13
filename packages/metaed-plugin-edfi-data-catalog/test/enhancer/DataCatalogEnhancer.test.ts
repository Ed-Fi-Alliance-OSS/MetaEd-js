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
import { enhance as dataCatalogEnhancer } from '../../src/enhancer/DataCatalogEnhancer';
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
});
