// @flow
import type { MetaEdEnvironment } from 'metaed-core';
import {
  DecimalTypeBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  IntegerTypeBuilder,
  MetaEdTextBuilder,
  NamespaceInfoBuilder,
  newMetaEdEnvironment,
  SharedStringBuilder,
  StringTypeBuilder,
} from 'metaed-core';
import { enhanceAndGenerate, xpathSelect } from './IntegrationTestHelper';

describe('when generating xsd for domain entity in both namespaces sharing a simple type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity: string = 'CoreEntity';
  const coreEntityPk: string = 'CoreEntityPk';
  const sharedNameString: string = 'SharedNameString';

  const extensionEntity: string = 'ExtensionEntity';
  const extensionEntityPk: string = 'ExtensionEntityPk';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const namespaceInfoBuilder = new NamespaceInfoBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const stringTypeBuilder = new StringTypeBuilder(metaEd, []);
    MetaEdTextBuilder.build()

    .withBeginNamespace('edfi')

    .withStartDomainEntity(coreEntity)
    .withDocumentation('doc')
    .withIntegerIdentity(coreEntityPk, 'doc')
    .withStringProperty(sharedNameString, 'doc', true, false, '10')
    .withEndDomainEntity()

    .withEndNamespace()

    .withBeginNamespace('EXTENSION', 'Extension')

    .withStartDomainEntity(extensionEntity)
    .withDocumentation('doc')
    .withIntegerIdentity(extensionEntityPk, 'doc')
    .withStringProperty(sharedNameString, 'doc', true, false, '10')
    .withEndDomainEntity()

    .withEndNamespace()

    .sendToListener(namespaceInfoBuilder)
    .sendToListener(stringTypeBuilder)
    .sendToListener(domainEntityBuilder);

    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core domain entity', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity string property', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='SharedNameString'][@type='SharedNameString']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core string type', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SharedNameString']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity string property reference core', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='SharedNameString'][@type='SharedNameString']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should not generate extension string type', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='EXTENSION-SharedNameString']", extensionResult);
    expect(elements).toHaveLength(0);
  });
});

describe('when generating xsd for common string', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const simpleTypeEntity: string = 'SimpleTypeEntity';

  let coreResult;

  beforeAll(async () => {
    const namespaceInfoBuilder = new NamespaceInfoBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const stringTypeBuilder = new StringTypeBuilder(metaEd, []);
    MetaEdTextBuilder.build()

    .withBeginNamespace('edfi')

    .withStartSharedString(simpleTypeEntity)
    .withDocumentation('doc')
    .withMinLength('10')
    .withMaxLength('100')
    .withEndSharedString()

    .withEndNamespace()

    .sendToListener(namespaceInfoBuilder)
    .sendToListener(stringTypeBuilder)
    .sendToListener(domainEntityBuilder);

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate simple type entity', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct type annotation', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:annotation/xs:appinfo/ann:TypeGroup", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct documentation', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:annotation/xs:documentation", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate restriction of corrext xsd base type', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:string']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct min length', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:string']/xs:minLength[@value='10']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct max length', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:string']/xs:maxLength[@value='100']", coreResult);
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for common decimal', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const simpleTypeEntity: string = 'SimpleTypeEntity';

  let coreResult;

  beforeAll(async () => {
    const namespaceInfoBuilder = new NamespaceInfoBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const decimalTypeBuilder = new DecimalTypeBuilder(metaEd, []);
    MetaEdTextBuilder.build()

    .withBeginNamespace('edfi')

    .withStartSharedDecimal(simpleTypeEntity)
    .withDocumentation('doc')
    .withTotalDigits('5')
    .withDecimalPlaces('4')
    .withMinValue('10')
    .withMaxValue('100')
    .withEndSharedDecimal()

    .withEndNamespace()

    .sendToListener(namespaceInfoBuilder)
    .sendToListener(decimalTypeBuilder)
    .sendToListener(domainEntityBuilder);

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate simple type entity', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct type annotation', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:annotation/xs:appinfo/ann:TypeGroup", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct documentation', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:annotation/xs:documentation", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate restriction of correct xsd base type', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:decimal']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate restriction of correct total digits', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:decimal']/xs:totalDigits[@value='5']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate restriction of correct decimal places', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:decimal']/xs:fractionDigits[@value='4']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct min value', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:decimal']/xs:minInclusive[@value='10']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct max value', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:decimal']/xs:maxInclusive[@value='100']", coreResult);
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for common integer', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const simpleTypeEntity: string = 'SimpleTypeEntity';

  let coreResult;

  beforeAll(async () => {
    const namespaceInfoBuilder = new NamespaceInfoBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const integerTypeBuilder = new IntegerTypeBuilder(metaEd, []);
    MetaEdTextBuilder.build()

    .withBeginNamespace('edfi')

    .withStartSharedInteger(simpleTypeEntity)
    .withDocumentation('doc')
    .withMinValue('10')
    .withMaxValue('100')
    .withEndSharedInteger()

    .withEndNamespace()

    .sendToListener(namespaceInfoBuilder)
    .sendToListener(integerTypeBuilder)
    .sendToListener(domainEntityBuilder);

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate simple type entity', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct type annotation', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:annotation/xs:appinfo/ann:TypeGroup", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct documentation', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:annotation/xs:documentation", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate restriction of correct xsd base type', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:int']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct min value', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:int']/xs:minInclusive[@value='10']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct max value', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:int']/xs:maxInclusive[@value='100']", coreResult);
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for common short', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const simpleTypeEntity: string = 'SimpleTypeEntity';

  let coreResult;

  beforeAll(async () => {
    const namespaceInfoBuilder = new NamespaceInfoBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const integerTypeBuilder = new IntegerTypeBuilder(metaEd, []);
    MetaEdTextBuilder.build()

    .withBeginNamespace('edfi')

    .withStartSharedShort(simpleTypeEntity)
    .withDocumentation('doc')
    .withMinValue('10')
    .withMaxValue('100')
    .withEndSharedShort()

    .withEndNamespace()

    .sendToListener(namespaceInfoBuilder)
    .sendToListener(integerTypeBuilder)
    .sendToListener(domainEntityBuilder);

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate simple type entity', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct type annotation', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:annotation/xs:appinfo/ann:TypeGroup", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct documentation', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:annotation/xs:documentation", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate restriction of correct xsd base type', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:short']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct min value', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:short']/xs:minInclusive[@value='10']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate correct max value', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='SimpleTypeEntity']/xs:restriction[@base='xs:short']/xs:maxInclusive[@value='100']", coreResult);
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for shared simpel property in extension namespace with reference to core simple common type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreSharedString: string = 'CoreSharedString';
  const extensionEntity: string = 'ExtensionEntity';
  const coreEntityPk: string = 'CoreEntityPk';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const namespaceInfoBuilder = new NamespaceInfoBuilder(metaEd, []);
    const domainEntityExtensionBuilder = new DomainEntityExtensionBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const stringTypeBuilder = new StringTypeBuilder(metaEd, []);
    MetaEdTextBuilder.build()

    .withBeginNamespace('edfi')

    .withStartSharedString(coreSharedString)
    .withDocumentation('doc')
    .withMaxLength('20')
    .withEndSharedString()

    .withEndNamespace()

    .withBeginNamespace('EXTENSION', 'Extension')

    .withStartDomainEntity(extensionEntity)
    .withDocumentation('doc')
    .withIntegerIdentity(coreEntityPk, 'doc')
    .withSharedStringProperty(coreSharedString, coreSharedString, 'doc', true, false)

    .withEndNamespace()

    .sendToListener(namespaceInfoBuilder)
    .sendToListener(stringTypeBuilder)
    .sendToListener(domainEntityBuilder)
    .sendToListener(domainEntityExtensionBuilder);

    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core shared string', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='CoreSharedString']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity reference to core shared type', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreSharedString'][@type='CoreSharedString']", extensionResult);
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for renamed shared simple property in extension namespace with reference to core simple common type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreSharedString: string = 'CoreSharedString';
  const extensionEntity: string = 'ExtensionEntity';
  const coreEntityPk: string = 'CoreEntityPk';
  const differentName: string = 'DifferentName';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const namespaceInfoBuilder = new NamespaceInfoBuilder(metaEd, []);
    const domainEntityExtensionBuilder = new DomainEntityExtensionBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const stringTypeBuilder = new StringTypeBuilder(metaEd, []);

    MetaEdTextBuilder.build()

    .withBeginNamespace('edfi')

    .withStartSharedString(coreSharedString)
    .withDocumentation('doc')
    .withMaxLength('20')
    .withEndSharedString()

    .withEndNamespace()

    .withBeginNamespace('EXTENSION', 'Extension')

    .withStartDomainEntity(extensionEntity)
    .withDocumentation('doc')
    .withIntegerIdentity(coreEntityPk, 'doc')
    .withSharedStringProperty(coreSharedString, differentName, 'doc', true, false)

    .withEndNamespace()

    .sendToListener(namespaceInfoBuilder)
    .sendToListener(stringTypeBuilder)
    .sendToListener(domainEntityBuilder)
    .sendToListener(domainEntityExtensionBuilder);

    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core shared string', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='CoreSharedString']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity reference to core shared type', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='DifferentName'][@type='CoreSharedString']", extensionResult);
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for shared simple property in extension namespace with reference to extension simple common type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreSharedString: string = 'CoreSharedString';
  const extensionEntity: string = 'ExtensionEntity';
  const coreEntityPk: string = 'CoreEntityPk';
  const dummy: string = 'Dummy';

  let extensionResult;

  beforeAll(async () => {
    const namespaceInfoBuilder = new NamespaceInfoBuilder(metaEd, []);
    const domainEntityExtensionBuilder = new DomainEntityExtensionBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const stringTypeBuilder = new StringTypeBuilder(metaEd, []);
    const sharedStringBuilder = new SharedStringBuilder(metaEd, []);

    MetaEdTextBuilder.build()

    .withBeginNamespace('edfi')

    .withStartSharedString(dummy)
    .withDocumentation('doc')
    .withMaxLength('1')
    .withEndSharedString()

    .withEndNamespace()

    .withBeginNamespace('EXTENSION', 'Extension')

    .withStartDomainEntity(extensionEntity)
    .withDocumentation('doc')
    .withIntegerIdentity(coreEntityPk, 'doc')
    .withSharedStringProperty(coreSharedString, coreSharedString, 'doc', true, false)
    .withEndDomainEntity()

    .withStartSharedString(coreSharedString)
    .withDocumentation('doc')
    .withMaxLength('20')
    .withEndSharedString()

    .withEndNamespace()

    .sendToListener(namespaceInfoBuilder)
    .sendToListener(stringTypeBuilder)
    .sendToListener(sharedStringBuilder)
    .sendToListener(domainEntityBuilder)
    .sendToListener(domainEntityExtensionBuilder);

    ({ extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate extension shared string', () => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='EXTENSION-CoreSharedString']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity reference to core shared type', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreSharedString'][@type='EXTENSION-CoreSharedString']", extensionResult);
    expect(elements).toHaveLength(1);
  });
});
