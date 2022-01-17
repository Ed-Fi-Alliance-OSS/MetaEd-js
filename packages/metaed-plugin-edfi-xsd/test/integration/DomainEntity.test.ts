import { MetaEdEnvironment } from '@edfi/metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  SharedStringBuilder,
  StringTypeBuilder,
} from '@edfi/metaed-core';
import { xpathSelect, enhanceAndGenerate, initializeNamespaceDependencies } from './IntegrationTestHelper';

describe('when generating xsd for domain entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const sample = 'Sample';
  const property1 = 'Property1';

  let coreResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartDomainEntity(sample)
      .withDocumentation('doc')
      .withIntegerIdentity(property1, 'doc')
      .withEndDomainEntity()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder);

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='Sample']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate domain entity reference', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='SampleReferenceType']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate domain entity identity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='SampleIdentityType']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should not generate domain entity lookup', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='SampleLookupType']", coreResult);
    expect(elements).toHaveLength(0);
  });
});

describe('when generating xsd for domain entity with inline common type as part of primary key', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const sample = 'Sample';
  const property1 = 'Property1';
  const foo = 'Foo';
  const property2 = 'Property2';

  let coreResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartDomainEntity(sample)
      .withDocumentation('doc')
      .withIntegerIdentity(property1, 'doc')
      .withInlineCommonProperty(foo, 'doc', true, false)
      .withEndDomainEntity()

      .withStartInlineCommon(foo)
      .withDocumentation('doc')
      .withIntegerIdentity(property2, 'doc')
      .withEndInlineCommon()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder);

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='Sample']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate domain entity reference', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='SampleReferenceType']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate domain entity identity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='SampleIdentityType']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should include inline common type in identity type', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='SampleIdentityType']/xs:sequence/xs:element[@name='Property2']",
      coreResult,
    );
    expect(elements).toHaveLength(0);
  });
});

describe('when generating xsd for domain entity in extension namespace with reference to core domain entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity = 'CoreEntity';
  const coreEntityPk = 'CoreEntityPk';
  const extensionEntity = 'ExtensionEntity';
  const extensionEntityPk = 'ExtensionEntityPk';

  const extensionNamespace = 'Extension';
  const extension = 'EXTENSION';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const domainEntityExtensionBuilder = new DomainEntityExtensionBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartDomainEntity(coreEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntityPk, 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .withBeginNamespace(extensionNamespace, extension)

      .withStartDomainEntity(extensionEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(extensionEntityPk, 'doc')
      .withDomainEntityProperty(`EdFi.${coreEntity}`, 'doc', true, false)
      .withEndDomainEntity()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(domainEntityExtensionBuilder);

    initializeNamespaceDependencies(metaEd, 'EdFi', extensionNamespace);
    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate core domain entity reference', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntityReferenceType']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate core domain entity identity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntityIdentityType']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should include core domain entity primary key', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='CoreEntity']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreEntityPk']",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });
  it('should generate extension domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']", extensionResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate extension domain entity reference', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntityReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
  it('should generate extension domain entity identity', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntityIdentityType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
  it('should generate extention domain entity primary key', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionEntityPk']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
  it('should generate extenion domain entity reference to core entity', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreEntityReference'][@type='CoreEntityReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});
describe('when generating xsd for domain entity with queryable only field', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const assessment = 'Assessment';
  const property1 = 'Property1';
  const foo = 'Foo';
  const property2 = 'Property2';

  let coreResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartDomainEntity(assessment)
      .withDocumentation('doc')
      .withIntegerIdentity(property1, 'doc')
      .withQueryableOnlyDomainEntityProperty(foo, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(foo)
      .withDocumentation('doc')
      .withIntegerIdentity(property2, 'doc')
      .withEndDomainEntity()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder);

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='Assessment']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate domain entity identity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='AssessmentIdentityType']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate domain entity lookup', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='AssessmentLookupType']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate domain entity lookup in reference type', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='AssessmentReferenceType']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='AssessmentLookup']",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });
  it('should generate domain entity reference in lookup type', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='AssessmentLookupType']/xs:sequence/xs:element[@name='FooReference']",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });
});
describe('when generating xsd for domain entity with queryable field', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const assessment = 'Assessment';
  const property1 = 'Property1';
  const foo = 'Foo';

  let coreResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartDomainEntity(assessment)
      .withDocumentation('doc')
      .withIntegerIdentity(property1, 'doc')
      .withIntegerProperty(foo, 'doc', true, false)
      .withQueryableFieldPropertyIndicator()
      .withEndDomainEntity()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder);

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='Assessment']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate domain entity identity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='AssessmentIdentityType']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate domain entity lookup', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='AssessmentLookupType']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate domain entity lookup in reference type', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='AssessmentReferenceType']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='AssessmentLookup']",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });
  it('should generate field reference in lookup type', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='AssessmentLookupType']/xs:sequence/xs:element[@name='Foo']",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for domain entity with queryable field', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const commonStringReference = 'CommonStringReference';
  const pkProperty = 'PkProperty';
  const sharedProperty = 'SharedProperty';
  const sample = 'Sample';

  let coreResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const sharedStringBuilder = new SharedStringBuilder(metaEd, []);
    const stringTypeBuilder = new StringTypeBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartSharedString(commonStringReference)
      .withDocumentation('doc')
      .withMinLength('10')
      .withMaxLength('100')
      .withEndSharedString()

      .withStartDomainEntity(sample)
      .withDocumentation('doc')
      .withIntegerIdentity(pkProperty, 'doc')
      .withSharedStringProperty(commonStringReference, sharedProperty, 'doc', true, false)
      .withEndDomainEntity()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(stringTypeBuilder)
      .sendToListener(sharedStringBuilder);

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='Sample']", coreResult);
    expect(elements).toHaveLength(1);
  });
  it('should generate shared property', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='Sample']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='SharedProperty' and @type='CommonStringReference']",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });
  it('should generate correct simple type for common string', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:simpleType[@name='CommonStringReference']/xs:annotation/xs:appinfo/ann:TypeGroup",
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for abstract entity with identity property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const abstractEntityName = 'AbstractEntityName';
  const pkProperty = 'PkProperty';
  const stringPropertyName = 'StringPropertyName';

  let coreResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartAbstractEntity(abstractEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity(pkProperty, 'doc')
      .withStringProperty(stringPropertyName, 'doc', false, false, '100')
      .withEndAbstractEntity()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder);

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate domain entity', (): void => {
    const elements = xpathSelect(`/xs:schema/xs:complexType[@name='${abstractEntityName}']`, coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should not generate identity property', (): void => {
    const elements = xpathSelect(
      `/xs:schema/xs:complexType[@name='${abstractEntityName}']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='${pkProperty}']`,
      coreResult,
    );
    expect(elements).toHaveLength(0);
  });

  it('should generate non identity property', (): void => {
    const elements = xpathSelect(
      `/xs:schema/xs:complexType[@name='${abstractEntityName}']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='${stringPropertyName}']`,
      coreResult,
    );
    expect(elements).toHaveLength(1);
  });
});
