// @flow
import type { MetaEdEnvironment } from 'metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  AssociationBuilder,
  NamespaceInfoBuilder,
  CommonBuilder,
} from 'metaed-core';
import { xpathSelect, enhanceAndGenerate } from './IntegrationTestHelper';

describe('when generating xsd for association with inline common type as part of identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const sampleEntity: string = 'Sample';
  const property1: string = 'Property1';
  const property2: string = 'Property2';
  const sample2Entity: string = 'Sample2';
  const fooCommon: string = 'Foo';
  const sampleSample2Association: string = 'SampleSample2Association';

  let coreResult;

  beforeAll(async () => {
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const associationBuilder = new AssociationBuilder(metaEd, []);
    const namespaceInfoBuilder = new NamespaceInfoBuilder(metaEd, []);
    const commonBuilder = new CommonBuilder(metaEd, []);
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')

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

      .sendToListener(namespaceInfoBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(associationBuilder)
      .sendToListener(commonBuilder)
      .toString();

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate domain entity', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='SampleSample2Association']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate domain entity reference', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='SampleSample2AssociationReferenceType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate domain entity identity', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='SampleSample2AssociationIdentityType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should include inline common type in identity type', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='SampleSample2AssociationIdentityType']/xs:sequence/xs:element[@name='Property2']",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for association in extension namespace with reference to core DEs', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity1: string = 'CoreEntity1';
  const coreEntity1PK: string = 'CoreEntity1Pk';
  const coreEntity2PK: string = 'CoreEntity2Pk';
  const coreEntity2: string = 'CoreEntity2';
  const extensionAssociation: string = 'ExtensionAssociation';
  const namespace: string = 'extension';
  const projectExtension: string = 'EXTENSION';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const associationBuilder = new AssociationBuilder(metaEd, []);
    const namespaceInfoBuilder = new NamespaceInfoBuilder(metaEd, []);
    const commonBuilder = new CommonBuilder(metaEd, []);
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')

      .withStartDomainEntity(coreEntity1)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntity1PK, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(coreEntity2)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntity2PK, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(namespace, projectExtension)
      .withStartAssociation(extensionAssociation)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty(coreEntity1, 'doc')
      .withAssociationDomainEntityProperty(coreEntity2, 'doc')
      .withEndAssociation()

      .withEndNamespace()

      .sendToListener(namespaceInfoBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(associationBuilder)
      .sendToListener(commonBuilder)
      .toString();

    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core domain entity', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity1']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 1 references', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity1ReferenceType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 1 identity', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity1IdentityType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 1 primary key', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='CoreEntity1']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreEntity1Pk']",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 2', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity2']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 2 references', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity2ReferenceType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 2 entity identity', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity2IdentityType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity 2 primary key', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='CoreEntity2']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreEntity2Pk']",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should genrate extension association references', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociationReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should gerneate extension association identity', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociationIdentityType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association reference to core entity 1', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreEntity1Reference'][@type='CoreEntity1ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should genreate extension association refrence to core entity 2', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreEntity2Reference'][@type='CoreEntity2ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for association in extension namespace with reference to extension DEs', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity1: string = 'CoreEntity1';
  const coreEntity1PK: string = 'CoreEntity1Pk';
  const extensionEntity1PK: string = 'ExtensionEntity1Pk';
  const extensionEntity2PK: string = 'ExtensionEntity2Pk';
  const extensionEntity1: string = 'ExtensionEntity1';
  const extensionEntity2: string = 'ExtensionEntity2';
  const extensionAssociation: string = 'ExtensionAssociation';
  const namespace: string = 'extension';
  const projectExtension: string = 'EXTENSION';

  let extensionResult;

  beforeAll(async () => {
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const associationBuilder = new AssociationBuilder(metaEd, []);
    const namespaceInfoBuilder = new NamespaceInfoBuilder(metaEd, []);
    const commonBuilder = new CommonBuilder(metaEd, []);
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')

      .withStartDomainEntity(coreEntity1)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntity1PK, 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .withBeginNamespace(namespace, projectExtension)

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

      .sendToListener(namespaceInfoBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(associationBuilder)
      .sendToListener(commonBuilder)
      .toString();

    ({ extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate extension domain entity 1', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity1']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity 1 reference', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity1ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should gerneate extension domain entity 1 identity', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity1IdentityType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity 1 primary key', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity1']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionEntity1Pk']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should genreate extension domain entity 2', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity2']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity 2 reference', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity2ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity 2 identity', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity2ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity 2 primary key', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity2IdentityType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity2']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionEntity2Pk']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association reference', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association identity', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociationIdentityType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association reference to extension entity 1', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionEntity1Reference'][@type='EXTENSION-ExtensionEntity1ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association reference to extension entity 2', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionEntity2Reference'][@type='EXTENSION-ExtensionEntity2ReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});
