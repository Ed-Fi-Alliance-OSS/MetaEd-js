import { MetaEdEnvironment } from 'metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DescriptorBuilder,
  EnumerationBuilder,
  DomainEntityBuilder,
} from 'metaed-core';
import { xpathSelect, enhanceAndGenerate, initializeNamespaceDependencies } from './IntegrationTestHelper';

describe('when generating xsd for enumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity = 'CoreEntity';
  const enumerationItem = 'EnumerationItem';

  let coreResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const enumerationBuilder = new EnumerationBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartEnumeration(coreEntity)
      .withDocumentation('doc')
      .withEnumerationItem(enumerationItem)
      .withEndEnumeration()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(enumerationBuilder);

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate enumeration', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='CoreEntityType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate enumeration item', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:simpleType[@name='CoreEntityType']/xs:restriction/xs:enumeration[@value='EnumerationItem']",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for domain entity in extension namespace with reference to enumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity = 'CoreEntity';
  const enumerationItem = 'EnumerationItem';
  const extensionEntity = 'ExtensionEntity';
  const extensionEntityPk = 'ExtensionEntityPk';

  const extensionNamespace = 'Extension';
  const extension = 'EXTENSION';
  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const descriptorBuilder = new DescriptorBuilder(metaEd, []);
    const enumerationBuilder = new EnumerationBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartEnumeration(coreEntity)
      .withDocumentation('doc')
      .withEnumerationItem(enumerationItem)
      .withEndEnumeration()

      .withEndNamespace()

      .withBeginNamespace(extensionNamespace, extension)

      .withStartDomainEntity(extensionEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(extensionEntityPk, 'doc')
      .withEnumerationProperty(`EdFi.${coreEntity}`, 'doc', true, false)
      .withEndDomainEntity()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(enumerationBuilder)
      .sendToListener(descriptorBuilder);

    initializeNamespaceDependencies(metaEd, 'EdFi', extensionNamespace);
    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate enumeration', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='CoreEntityType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity reference to core entity', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreEntity'][@type='CoreEntityType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for enumeration in extension namespace with reference to core entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity = 'CoreEntity';
  const coreEntityPk = 'CoreEntityPk';
  const enumerationItem = 'EnumerationItem';
  const extensionEntity = 'ExtensionEntity';

  const extensionNamespace = 'Extension';
  const extension = 'EXTENSION';
  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const enumerationBuilder = new EnumerationBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);

    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartDomainEntity(coreEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntityPk, 'doc')
      .withEndDomainEntity()

      .withEndNamespace()

      .withBeginNamespace(extensionNamespace, extension)

      .withStartEnumeration(extensionEntity)
      .withDocumentation('doc')
      .withEnumerationItem(enumerationItem)
      .withEndEnumeration()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(enumerationBuilder);

    initializeNamespaceDependencies(metaEd, 'EdFi', extensionNamespace);
    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core domain entity', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate enumeration', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='EXTENSION-ExtensionEntityType']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate enumeration item', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:simpleType[@name='EXTENSION-ExtensionEntityType']/xs:restriction/xs:enumeration[@value='EnumerationItem']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});
