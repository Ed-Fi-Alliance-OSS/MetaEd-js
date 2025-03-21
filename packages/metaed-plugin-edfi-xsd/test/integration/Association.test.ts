// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  AssociationBuilder,
  NamespaceBuilder,
  CommonBuilder,
} from '@edfi/metaed-core';
import { xpathSelect, enhanceAndGenerate, initializeNamespaceDependencies } from './IntegrationTestHelper';

describe('when generating xsd for association with inline common type as part of identity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const sampleEntity = 'Sample';
  const property1 = 'Property1';
  const property2 = 'Property2';
  const sample2Entity = 'Sample2';
  const fooCommon = 'Foo';
  const sampleSample2Association = 'SampleSample2Association';

  let coreResult;

  beforeAll(async () => {
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const associationBuilder = new AssociationBuilder(metaEd, []);
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const commonBuilder = new CommonBuilder(metaEd, []);
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')

      .withStartDomainEntity(sampleEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(property1, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(sample2Entity)
      .withDocumentation('doc')
      .withIntegerIdentity(property1, 'doc')
      .withEndDomainEntity()

      .withStartAssociation(sampleSample2Association)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty(sampleEntity, 'doc')
      .withAssociationDomainEntityProperty(sample2Entity, 'doc')
      .withInlineCommonProperty(fooCommon, 'doc', true, false)
      .withEndAssociation()

      .withStartInlineCommon(fooCommon)
      .withDocumentation('doc')
      .withIntegerIdentity(property2, 'doc')
      .withEndInlineCommon()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(associationBuilder)
      .sendToListener(commonBuilder)
      .toString();

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='SampleSample2Association']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate domain entity reference', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='SampleSample2AssociationReferenceType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate domain entity identity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='SampleSample2AssociationIdentityType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should include inline common type in identity type', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='SampleSample2AssociationIdentityType']/xs:sequence/xs:element[@name='Property2']",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for association in extension namespace with reference to core DEs', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity1 = 'CoreEntity1';
  const coreEntity1PK = 'CoreEntity1Pk';
  const coreEntity2PK = 'CoreEntity2Pk';
  const coreEntity2 = 'CoreEntity2';
  const extensionAssociation = 'ExtensionAssociation';
  const namespaceName = 'Extension';
  const projectExtension = 'EXTENSION';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const associationBuilder = new AssociationBuilder(metaEd, []);
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const commonBuilder = new CommonBuilder(metaEd, []);
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')

      .withStartDomainEntity(coreEntity1)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntity1PK, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(coreEntity2)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntity2PK, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAssociation(extensionAssociation)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty(`EdFi.${coreEntity1}`, 'doc')
      .withAssociationDomainEntityProperty(`EdFi.${coreEntity2}`, 'doc')
      .withEndAssociation()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(associationBuilder)
      .sendToListener(commonBuilder)
      .toString();

    initializeNamespaceDependencies(metaEd, 'EdFi', namespaceName);
    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity1']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 1 references', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity1ReferenceType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 1 identity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity1IdentityType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 1 primary key', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='CoreEntity1']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreEntity1Pk']",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 2', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity2']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 2 references', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity2ReferenceType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 2 entity identity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity2IdentityType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 2 primary key', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='CoreEntity2']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreEntity2Pk']",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should genrate extension association references', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociationReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should gerneate extension association identity', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociationIdentityType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association reference to core entity 1', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreEntity1Reference'][@type='CoreEntity1ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should genreate extension association refrence to core entity 2', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreEntity2Reference'][@type='CoreEntity2ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for association in extension namespace with reference to extension DEs', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity1 = 'CoreEntity1';
  const coreEntity1PK = 'CoreEntity1Pk';
  const extensionEntity1PK = 'ExtensionEntity1Pk';
  const extensionEntity2PK = 'ExtensionEntity2Pk';
  const extensionEntity1 = 'ExtensionEntity1';
  const extensionEntity2 = 'ExtensionEntity2';
  const extensionAssociation = 'ExtensionAssociation';
  const namespaceName = 'Extension';
  const projectExtension = 'EXTENSION';

  let extensionResult;

  beforeAll(async () => {
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const associationBuilder = new AssociationBuilder(metaEd, []);
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const commonBuilder = new CommonBuilder(metaEd, []);
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')

      .withStartDomainEntity(coreEntity1)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntity1PK, 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .withBeginNamespace(namespaceName, projectExtension)

      .withStartDomainEntity(extensionEntity1)
      .withDocumentation('doc')
      .withIntegerIdentity(extensionEntity1PK, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(extensionEntity2)
      .withDocumentation('doc')
      .withIntegerIdentity(extensionEntity2PK, 'doc')
      .withEndDomainEntity()

      .withStartAssociation(extensionAssociation)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty(extensionEntity1, 'doc')
      .withAssociationDomainEntityProperty(extensionEntity2, 'doc')
      .withEndAssociation()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(associationBuilder)
      .sendToListener(commonBuilder)
      .toString();

    initializeNamespaceDependencies(metaEd, 'EdFi', namespaceName);
    ({ extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate extension domain entity 1', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity1']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity 1 reference', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity1ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should gerneate extension domain entity 1 identity', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity1IdentityType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity 1 primary key', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity1']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionEntity1Pk']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should genreate extension domain entity 2', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity2']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity 2 reference', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity2ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity 2 identity', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity2ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity 2 primary key', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity2IdentityType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity2']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionEntity2Pk']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association reference', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association identity', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociationIdentityType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association reference to extension entity 1', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionEntity1Reference'][@type='EXTENSION-ExtensionEntity1ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association reference to extension entity 2', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionEntity2Reference'][@type='EXTENSION-ExtensionEntity2ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});
