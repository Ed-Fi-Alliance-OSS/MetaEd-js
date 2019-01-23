import { MetaEdEnvironment } from 'metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  InterchangeBuilder,
  IntegerTypeBuilder,
  DescriptorBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  AssociationBuilder,
  AssociationExtensionBuilder,
} from 'metaed-core';
import { xpathSelect, enhanceAndGenerate, initializeNamespaceDependencies } from './IntegrationTestHelper';

describe('when generating xsd for domain entity in both namespaces sharing a simple type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const entityAsElement = 'EntityAsElement';
  const key = 'Key';
  const entityAsIdentityTemplate = 'EntityAsIdentityTemplate';
  const xYZ = 'XYZ';

  let interchangeResults;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const integerTypeBuilder = new IntegerTypeBuilder(metaEd, []);
    const interchangeBuilder = new InterchangeBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('edfi')

      .withStartDomainEntity(entityAsElement)
      .withDocumentation('doc')
      .withIntegerIdentity(key, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(entityAsIdentityTemplate)
      .withDocumentation('doc')
      .withIntegerIdentity(key, 'doc')
      .withEndDomainEntity()

      .withStartInterchange(xYZ)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(entityAsElement)
      .withDomainEntityIdentityTemplate(entityAsIdentityTemplate)
      .withEndInterchange()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(integerTypeBuilder)
      .sendToListener(interchangeBuilder)
      .sendToListener(domainEntityBuilder);

    ({ interchangeResults } = await enhanceAndGenerate(metaEd));
  });

  it('should include core xsd', () => {
    const elements = xpathSelect("/xs:schema/xs:include[@schemaLocation='Ed-Fi-Core.xsd']", interchangeResults[0]);
    expect(elements).toHaveLength(1);
  });
  it('should identity template', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element[@name='EntityAsIdentityTemplateReference'][@type='EntityAsIdentityTemplateReferenceType']",
      interchangeResults[0],
    );
    expect(elements).toHaveLength(1);
  });
  it('should have element', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element[@name='EntityAsElement'][@type='EntityAsElement']",
      interchangeResults[0],
    );
    expect(elements).toHaveLength(1);
  });
});
describe('when generating xsd for extension interchange with a new domain entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const xYZ = 'XYZ';
  const coreEntity1 = 'CoreEntity';
  const extensionEntity = 'ExtensionEntity';
  const coreEntity1Pk = 'CoreEntityPk';
  const extensionEntityPk = 'ExtensionEntityPk';

  let interchangeResults: Array<string>;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const integerTypeBuilder = new IntegerTypeBuilder(metaEd, []);
    const interchangeBuilder = new InterchangeBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('edfi')

      .withStartDomainEntity(coreEntity1)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntity1Pk, 'doc')
      .withEndDomainEntity()

      .withStartInterchange(xYZ)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(coreEntity1)
      .withEndInterchange()

      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')

      .withStartDomainEntity(extensionEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(extensionEntityPk, 'doc')
      .withDomainEntityProperty(coreEntity1, 'doc', true, false)
      .withEndDomainEntity()

      .withStartInterchangeExtension(xYZ)
      .withDomainEntityDomainItem(extensionEntity)
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(integerTypeBuilder)
      .sendToListener(interchangeBuilder)
      .sendToListener(domainEntityBuilder);

    initializeNamespaceDependencies(metaEd, 'edfi', 'extension');
    ({ interchangeResults } = await enhanceAndGenerate(metaEd));
  });

  it('should include core xsd', () => {
    const elements = xpathSelect("/xs:schema/xs:include[@schemaLocation='Ed-Fi-Core.xsd']", interchangeResults[0] as any);
    expect(elements).toHaveLength(1);
  });
  it('should include extension xsd', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:include[@schemaLocation='EXTENSION-Ed-Fi-Extended-Core.xsd']",
      interchangeResults[1] as any,
    );
    expect(elements).toHaveLength(1);
  });
  it('should have element', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element[@name='CoreEntity'][@type='CoreEntity']",
      interchangeResults[0] as any,
    );
    expect(elements).toHaveLength(1);
  });
  it('should have core in extension interchange', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element[@name='CoreEntity'][@type='CoreEntity']",
      interchangeResults[1] as any,
    );
    expect(elements).toHaveLength(1);
  });
  it('should have extension element', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element[@name='ExtensionEntity'][@type='EXTENSION-ExtensionEntity']",
      interchangeResults[1] as any,
    );
    expect(elements).toHaveLength(1);
  });

  it('should list core element before extensions', () => {
    const extension: any = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element",
      interchangeResults[1] as any,
    );
    const coreElement: any = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element[@name='CoreEntity'][@type='CoreEntity']",
      interchangeResults[1] as any,
    )[0];
    const extensionElement: any = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element[@name='ExtensionEntity'][@type='EXTENSION-ExtensionEntity']",
      interchangeResults[1] as any,
    )[0];
    expect(extension[0].getAttribute('name')).toEqual(coreElement.getAttribute('name'));
    expect(extension[1].getAttribute('name')).toEqual(extensionElement.getAttribute('name'));
  });
});
describe('when generating xsd for extension interchange with a domain entity extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const xYZ = 'XYZ';
  const coreEntity1 = 'CoreEntity1';
  const coreEntity2 = 'CoreEntity2';
  const coreEntity1Pk = 'CoreEntity1Pk';
  const coreEntity2Pk = 'CoreEntity2Pk';
  const extensionProperty = 'ExtensionProperty';

  let interchangeResults: Array<string>;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const domainEntityExtensionBuilder = new DomainEntityExtensionBuilder(metaEd, []);
    const integerTypeBuilder = new IntegerTypeBuilder(metaEd, []);
    const interchangeBuilder = new InterchangeBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('edfi')

      .withStartDomainEntity(coreEntity1)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntity1Pk, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(coreEntity2)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntity2Pk, 'doc')
      .withEndDomainEntity()

      .withStartInterchange(xYZ)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(coreEntity1)
      .withDomainEntityDomainItem(coreEntity2)
      .withEndInterchange()

      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')

      .withStartDomainEntityExtension(coreEntity1)
      .withIntegerProperty(extensionProperty, 'doc', true, false)
      .withEndDomainEntityExtension()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(integerTypeBuilder)
      .sendToListener(interchangeBuilder)
      .sendToListener(domainEntityExtensionBuilder)
      .sendToListener(domainEntityBuilder);

    initializeNamespaceDependencies(metaEd, 'edfi', 'extension');
    ({ interchangeResults } = await enhanceAndGenerate(metaEd));
  });

  it('should include core xsd', () => {
    const elements = xpathSelect("/xs:schema/xs:include[@schemaLocation='Ed-Fi-Core.xsd']", interchangeResults[0] as any);
    expect(elements).toHaveLength(1);
  });
  it('should include extension xsd', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:include[@schemaLocation='EXTENSION-Ed-Fi-Extended-Core.xsd']",
      interchangeResults[1] as any,
    );
    expect(elements).toHaveLength(1);
  });
  it('should have element', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element[@name='CoreEntity1'][@type='CoreEntity1']",
      interchangeResults[0] as any,
    );
    expect(elements).toHaveLength(1);
  });
  it('should have extension element', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element[@name='CoreEntity1'][@type='EXTENSION-CoreEntity1Extension']",
      interchangeResults[1] as any,
    );
    expect(elements).toHaveLength(1);
  });
  it('should list extension domain entity in same position as core', () => {
    const core: any = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element",
      interchangeResults[0] as any,
    )[0];
    const extension: any = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element",
      interchangeResults[1] as any,
    )[0];
    expect(extension.getAttribute('name')).toEqual(core.getAttribute('name'));
    expect(extension.getAttribute('type')).toEqual(`EXTENSION-${core.getAttribute('type')}Extension`);
  });
  it('should have the same number of elements', () => {
    const core = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element",
      interchangeResults[0] as any,
    );
    const extension = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element",
      interchangeResults[1] as any,
    );
    expect(extension.length).toEqual(core.length);
  });
});
describe('when generating xsd for extension interchange with an association extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const xYZ = 'XYZ';
  const coreEntity1 = 'CoreEntity1';
  const coreEntity2 = 'CoreEntity2';
  const coreEntity1Pk = 'CoreEntity1Pk';
  const coreEntity2Pk = 'CoreEntity2Pk';
  const extensionProperty = 'ExtensionProperty';
  const coreAssociation = 'CoreAssociation';

  let interchangeResults: Array<string>;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const domainEntityExtensionBuilder = new DomainEntityExtensionBuilder(metaEd, []);
    const associationBuilder = new AssociationBuilder(metaEd, []);
    const associationExtensionBuilder = new AssociationExtensionBuilder(metaEd, []);
    const interchangeBuilder = new InterchangeBuilder(metaEd, []);

    MetaEdTextBuilder.build()

      .withBeginNamespace('edfi')

      .withStartDomainEntity(coreEntity1)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntity1Pk, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(coreEntity2)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntity2Pk, 'doc')
      .withEndDomainEntity()

      .withStartAssociation(coreAssociation)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(coreEntity1)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(coreEntity2)
      .withDocumentation('doc')
      .withEndAssociation()

      .withStartInterchange(xYZ)
      .withDocumentation('doc')
      .withDomainEntityDomainItem(coreEntity1)
      .withDomainEntityDomainItem(coreEntity2)
      .withAssociationDomainItem(coreAssociation)
      .withEndInterchange()

      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')

      .withStartAssociationExtension(coreAssociation)
      .withIntegerProperty(extensionProperty, 'doc', true, false)
      .withEndAssociationExtension()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(associationBuilder)
      .sendToListener(associationExtensionBuilder)
      .sendToListener(interchangeBuilder)
      .sendToListener(domainEntityExtensionBuilder)
      .sendToListener(domainEntityBuilder);

    initializeNamespaceDependencies(metaEd, 'edfi', 'extension');
    ({ interchangeResults } = await enhanceAndGenerate(metaEd));
  });

  it('should include core xsd', () => {
    const elements = xpathSelect("/xs:schema/xs:include[@schemaLocation='Ed-Fi-Core.xsd']", interchangeResults[0] as any);
    expect(elements).toHaveLength(1);
  });
  it('should include extension xsd', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:include[@schemaLocation='EXTENSION-Ed-Fi-Extended-Core.xsd']",
      interchangeResults[1] as any,
    );
    expect(elements).toHaveLength(1);
  });
  it('should have element', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element[@name='CoreAssociation'][@type='CoreAssociation']",
      interchangeResults[0] as any,
    );
    expect(elements).toHaveLength(1);
  });
  it('should have extension element', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element[@name='CoreAssociation'][@type='EXTENSION-CoreAssociationExtension']",
      interchangeResults[1] as any,
    );
    expect(elements).toHaveLength(1);
  });
  it('should list extension domain entity in same position as core', () => {
    const core: any = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element",
      interchangeResults[0] as any,
    )[2];
    const extension: any = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element",
      interchangeResults[1] as any,
    )[2];
    expect(extension.getAttribute('name')).toEqual(core.getAttribute('name'));
    expect(extension.getAttribute('type')).toEqual(`EXTENSION-${core.getAttribute('type')}Extension`);
  });
  it('should have the same number of elements', () => {
    const core = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element",
      interchangeResults[0] as any,
    );
    const extension = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeXYZ']/xs:complexType/xs:choice/xs:element",
      interchangeResults[1] as any,
    );
    expect(extension.length).toEqual(core.length);
  });
});
describe('when generating xsd for extension interchange with extension descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'Core';
  const coreProperty = 'CoreProperty';
  const extension = 'Extension';
  const extensionProperty = 'ExtensionProperty';

  let interchangeResults: Array<string>;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const domainEntityExtensionBuilder = new DomainEntityExtensionBuilder(metaEd, []);
    const descriptorBuilder = new DescriptorBuilder(metaEd, []);
    const interchangeBuilder = new InterchangeBuilder(metaEd, []);

    MetaEdTextBuilder.build()

      .withBeginNamespace('edfi')

      .withStartDescriptor(core)
      .withDocumentation('doc')
      .withIntegerProperty(coreProperty, 'doc', true, false)
      .withEndDomainEntity()

      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')

      .withStartDescriptor(extension)
      .withDocumentation('doc')
      .withIntegerProperty(extensionProperty, 'doc', true, false)
      .withEndDescriptor()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(descriptorBuilder)
      .sendToListener(interchangeBuilder)
      .sendToListener(domainEntityExtensionBuilder)
      .sendToListener(domainEntityBuilder);

    initializeNamespaceDependencies(metaEd, 'edfi', 'extension');
    ({ interchangeResults } = await enhanceAndGenerate(metaEd));
  });

  it('should include core descriptor interchange', () => {
    const elements = xpathSelect("/xs:schema/xs:include[@schemaLocation='Ed-Fi-Core.xsd']", interchangeResults[0] as any);
    expect(elements).toHaveLength(1);
  });
  it('should have core descriptor', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeDescriptors']/xs:complexType/xs:choice/xs:element[@name='CoreDescriptor'][@type='CoreDescriptor']",
      interchangeResults[0] as any,
    );
    expect(elements).toHaveLength(1);
  });
  it('should include extension descriptor interchange', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:include[@schemaLocation='EXTENSION-Ed-Fi-Extended-Core.xsd']",
      interchangeResults[1] as any,
    );
    expect(elements).toHaveLength(1);
  });
  it('should have core descriptor in extension interchange', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeDescriptors']/xs:complexType/xs:choice/xs:element[@name='CoreDescriptor'][@type='CoreDescriptor']",
      interchangeResults[1] as any,
    );
    expect(elements).toHaveLength(1);
  });
  it('should have extension descriptor', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:element[@name='InterchangeDescriptors']/xs:complexType/xs:choice/xs:element[@name='ExtensionDescriptor'][@type='EXTENSION-ExtensionDescriptor']",
      interchangeResults[1] as any,
    );
    expect(elements).toHaveLength(1);
  });
});
