// @flow
import R from 'ramda';
import type {
  MetaEdEnvironment,
 } from 'metaed-core';
import {
  AssociationBuilder,
  AssociationExtensionBuilder,
  AssociationSubclassBuilder,
  ChoiceBuilder,
  CommonBuilder,
  CommonExtensionBuilder,
  DecimalTypeBuilder,
  DescriptorBuilder,
  DomainBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  DomainEntitySubclassBuilder,
  EnumerationBuilder,
  IntegerTypeBuilder,
  InterchangeBuilder,
  SharedDecimalBuilder,
  SharedIntegerBuilder,
  SharedStringBuilder,
  StringTypeBuilder,
  MetaEdTextBuilder,
  newMetaEdEnvironment,
} from 'metaed-core';
import { initialize } from '../index';

describe('when building and enhancing domain item', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const domainName1: string = 'DomainName1';
  const subdomainName1: string = 'SubdomainName1';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomain(domainName1)
      .withDocumentation('DomainDocumentation')
      .withDomainEntityDomainItem(domainEntityName1)
      .withEndDomain()

      .withStartSubdomain(subdomainName1, domainName1)
      .withDocumentation('SubdomainDocumentation')
      .withDomainEntityDomainItem(domainEntityName2)
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one domain', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should build one subdomain', () => {
    expect(metaEd.entity.subdomain.size).toBe(1);
  });

  it('should enhance domain entities', () => {
    // $FlowIgnore = entity could be null
    const domainItem = R.head(metaEd.entity.domain.get(domainName1).entities);
    const referencedEntity = metaEd.entity.domainEntity.get(domainEntityName1);
    expect(domainItem).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(domainItem).toBe(referencedEntity);
  });

  it('should enhance subdomain entities', () => {
    // $FlowIgnore = entity could be null
    const domainItem = R.head(metaEd.entity.subdomain.get(subdomainName1).entities);
    const referencedEntity = metaEd.entity.domainEntity.get(domainEntityName2);
    expect(domainItem).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(domainItem).toBe(referencedEntity);
  });
});

describe('when building and enhancing subdomain', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName1: string = 'DomainName1';
  const subdomainName1: string = 'SubdomainName1';
  const subdomainName2: string = 'SubdomainName2';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomain(domainName1)
      .withDocumentation('DomainDocumentation')
      .withDomainEntityDomainItem('DomainEntityName1')
      .withEndDomain()

      .withStartSubdomain(subdomainName1, domainName1)
      .withDocumentation('SubdomainDocumentation')
      .withDomainEntityDomainItem('DomainEntityName2')
      .withSubdomainPosition(2)
      .withEndSubdomain()

      .withStartSubdomain(subdomainName2, domainName1)
      .withDocumentation('SubdomainDocumentation')
      .withDomainEntityDomainItem('DomainEntityName3')
      .withSubdomainPosition(1)
      .withEndSubdomain()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain', () => {
    expect(metaEd.entity.domain.size).toBe(1);
  });

  it('should build two subdomains', () => {
    expect(metaEd.entity.subdomain.size).toBe(2);
  });

  it('should enhance subdomain with parent', () => {
    const domain = metaEd.entity.domain.get(domainName1);
    const subdomain = metaEd.entity.subdomain.get(subdomainName1);
    expect(domain).toBeDefined();
    expect(subdomain).toBeDefined();
    // $FlowIgnore = subdomain could be null
    expect(subdomain.parent).toBe(domain);
  });

  it('should enhance domains with sorted subdomains', () => {
    const domain = metaEd.entity.domain.get(domainName1);
    const subdomain1 = metaEd.entity.subdomain.get(subdomainName1);
    const subdomain2 = metaEd.entity.subdomain.get(subdomainName2);
    expect(domain).toBeDefined();
    expect(subdomain1).toBeDefined();
    expect(subdomain2).toBeDefined();
    // $FlowIgnore = domain could be null
    expect(R.head(domain.subdomains)).toBe(subdomain2);
    // $FlowIgnore = domain could be null
    expect(R.last(domain.subdomains)).toBe(subdomain1);
  });
});

describe('when building and enhancing association extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const associationName1: string = 'AssociationName1';
  const integerIdentityName1: string = 'IntegerIdentityName1';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(associationName1)
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty('AssociationDomainEntityProperty1', 'AssociationDomainEntityPropertyDocumentation')
      .withAssociationDomainEntityProperty('AssociationDomainEntityProperty2', 'AssociationDomainEntityPropertyDocumentation')
      .withIntegerIdentity(integerIdentityName1, 'IntegerIdentityDocumentation')
      .withQueryableFieldPropertyIndicator()
      .withEndAssociation()

      .withStartAssociationExtension(associationName1)
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should enhance base entity', () => {
    const baseEntity = metaEd.entity.association.get(associationName1);
    const extensionEntity = metaEd.entity.associationExtension.get(associationName1);
    expect(baseEntity).toBeDefined();
    expect(extensionEntity).toBeDefined();
    // $FlowIgnore - extensionEntity could be null
    expect(extensionEntity.baseEntity).toBe(baseEntity);
  });

  it('should enhance extension with queryable fields', () => {
    const extensionEntity = metaEd.entity.associationExtension.get(associationName1);
    expect(extensionEntity).toBeDefined();
    // $FlowIgnore - extensionEntity could be null
    expect(extensionEntity.queryableFields).toHaveLength(1);
    // $FlowIgnore - extensionEntity could be null
    expect(R.head(extensionEntity.queryableFields).metaEdName).toBe(integerIdentityName1);
  });
});

describe('when building and enhancing association subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const associationName1: string = 'AssociationName1';
  const associationSubclassName1: string = 'AssociationSubclassName1';
  const integerIdentityName1: string = 'IntegerIdentityName1';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(associationName1)
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty('AssociationDomainEntityProperty1', 'AssociationDomainEntityPropertyDocumentation')
      .withAssociationDomainEntityProperty('AssociationDomainEntityProperty2', 'AssociationDomainEntityPropertyDocumentation')
      .withIntegerIdentity(integerIdentityName1, 'IntegerIdentityDocumentation')
      .withQueryableFieldPropertyIndicator()
      .withEndAssociation()

      .withStartAssociationSubclass(associationSubclassName1, associationName1)
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build one association subclass', () => {
    expect(metaEd.entity.associationSubclass.size).toBe(1);
  });

  it('should enhance base entity', () => {
    const baseEntity = metaEd.entity.association.get(associationName1);
    const subclassEntity = metaEd.entity.associationSubclass.get(associationSubclassName1);
    expect(baseEntity).toBeDefined();
    expect(subclassEntity).toBeDefined();
    // $FlowIgnore - subclassEntity could be null
    expect(subclassEntity.baseEntity).toBe(baseEntity);
  });

  it('should enhance subclass with queryable fields', () => {
    const subclassEntity = metaEd.entity.associationSubclass.get(associationSubclassName1);
    expect(subclassEntity).toBeDefined();
    // $FlowIgnore - subclassEntity could be null
    expect(subclassEntity.queryableFields).toHaveLength(1);
    // $FlowIgnore - subclassEntity could be null
    expect(R.head(subclassEntity.queryableFields).metaEdName).toBe(integerIdentityName1);
  });
});

describe('when building and enhancing common extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName1: string = 'CommonName1';
  const integerIdentityName1: string = 'IntegerIdentityName1';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(commonName1)
      .withDocumentation('CommonDocumentation')
      .withIntegerIdentity(integerIdentityName1, 'IntegerIdentityDocumentation')
      .withQueryableFieldPropertyIndicator()
      .withEndCommon()

      .withStartCommonExtension(commonName1)
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one common extension', () => {
    expect(metaEd.entity.commonExtension.size).toBe(1);
  });

  it('should enhance base entity', () => {
    const baseEntity = metaEd.entity.common.get(commonName1);
    const extensionEntity = metaEd.entity.commonExtension.get(commonName1);
    expect(baseEntity).toBeDefined();
    expect(extensionEntity).toBeDefined();
    // $FlowIgnore - extensionEntity could be null
    expect(extensionEntity.baseEntity).toBe(baseEntity);
  });

  it('should enhance base entity with extender', () => {
    const baseEntity = metaEd.entity.common.get(commonName1);
    const extensionEntity = metaEd.entity.commonExtension.get(commonName1);
    expect(baseEntity).toBeDefined();
    expect(extensionEntity).toBeDefined();
    // $FlowIgnore - baseEntity could be null
    expect(baseEntity.extender).toBe(extensionEntity);
  });

  it('should enhance extension with queryable fields', () => {
    const extensionEntity = metaEd.entity.commonExtension.get(commonName1);
    expect(extensionEntity).toBeDefined();
    // $FlowIgnore - extensionEntity could be null
    expect(extensionEntity.queryableFields).toHaveLength(1);
    // $FlowIgnore - extensionEntity could be null
    expect(R.head(extensionEntity.queryableFields).metaEdName).toBe(integerIdentityName1);
  });
});

describe('when building and enhancing domain entity extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  const integerIdentityName1: string = 'IntegerIdentityName1';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(integerIdentityName1, 'IntegerIdentityDocumentation')
      .withQueryableFieldPropertyIndicator()
      .withEndDomainEntity()

      .withStartDomainEntityExtension(domainEntityName1)
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should enhance base entity', () => {
    const baseEntity = metaEd.entity.domainEntity.get(domainEntityName1);
    const extensionEntity = metaEd.entity.domainEntityExtension.get(domainEntityName1);
    expect(baseEntity).toBeDefined();
    expect(extensionEntity).toBeDefined();
    // $FlowIgnore - extensionEntity could be null
    expect(extensionEntity.baseEntity).toBe(baseEntity);
  });

  it('should enhance extension with queryable fields', () => {
    const extensionEntity = metaEd.entity.domainEntityExtension.get(domainEntityName1);
    expect(extensionEntity).toBeDefined();
    // $FlowIgnore - extensionEntity could be null
    expect(extensionEntity.queryableFields).toHaveLength(1);
    // $FlowIgnore - extensionEntity could be null
    expect(R.head(extensionEntity.queryableFields).metaEdName).toBe(integerIdentityName1);
  });
});

describe('when building and enhancing domain entity subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntitySubclassName1: string = 'DomainEntitySubclassName1';
  const integerIdentityName1: string = 'IntegerIdentityName1';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(integerIdentityName1, 'IntegerIdentityDocumentation')
      .withQueryableFieldPropertyIndicator()
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName1, domainEntityName1)
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity subclass', () => {
    expect(metaEd.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should enhance base entity', () => {
    const baseEntity = metaEd.entity.domainEntity.get(domainEntityName1);
    const subclassEntity = metaEd.entity.domainEntitySubclass.get(domainEntitySubclassName1);
    expect(baseEntity).toBeDefined();
    expect(subclassEntity).toBeDefined();
    // $FlowIgnore - subclassEntity could be null
    expect(subclassEntity.baseEntity).toBe(baseEntity);
  });

  it('should enhance subclass with queryable fields', () => {
    const subclassEntity = metaEd.entity.domainEntitySubclass.get(domainEntitySubclassName1);
    expect(subclassEntity).toBeDefined();
    // $FlowIgnore - subclassEntity could be null
    expect(subclassEntity.queryableFields).toHaveLength(1);
    // $FlowIgnore - subclassEntity could be null
    expect(R.head(subclassEntity.queryableFields).metaEdName).toBe(integerIdentityName1);
  });
});

describe('when building and enhancing interchange extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const interchangeName1: string = 'InterchangeName1';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInterchange(interchangeName1)
      .withDocumentation('InterchangeDocumentation')
      .withExtendedDocumentation('InterchangeExtendedDocumentation')
      .withUseCaseDocumentation('InterchangeUseCaseDocumentation')
      .withDomainEntityElement('DomainEntityName1')
      .withDomainEntityIdentityTemplate('DomainEntityName2')
      .withEndInterchange()

      .withStartInterchangeExtension(interchangeName1)
      .withDomainEntityElement('DomainEntityName1')
      .withDomainEntityIdentityTemplate('DomainEntityName2')
      .withEndInterchangeExtension()
      .withEndNamespace()

      .sendToListener(new InterchangeBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should build one interchange extension', () => {
    expect(metaEd.entity.interchangeExtension.size).toBe(1);
  });

  it('should enhance base entity', () => {
    const baseEntity = metaEd.entity.interchange.get(interchangeName1);
    const extensionEntity = metaEd.entity.interchangeExtension.get(interchangeName1);
    expect(baseEntity).toBeDefined();
    expect(extensionEntity).toBeDefined();
    // $FlowIgnore - extensionEntity could be null
    expect(extensionEntity.baseEntity).toBe(baseEntity);
  });
});

describe('when building and enhancing interchange items', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const interchangeName1: string = 'InterchangeName1';
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartInterchange(interchangeName1)
      .withDocumentation('InterchangeDocumentation')
      .withExtendedDocumentation('InterchangeExtendedDocumentation')
      .withUseCaseDocumentation('InterchangeUseCaseDocumentation')
      .withDomainEntityElement(domainEntityName1)
      .withDomainEntityIdentityTemplate(domainEntityName2)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one interchange', () => {
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should enhance elements with referenced entity', () => {
    // $FlowIgnore = entity could be null
    const property = R.head(metaEd.entity.interchange.get(interchangeName1).elements);
    const referencedEntity = metaEd.entity.domainEntity.get(domainEntityName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance identity templates with referenced entity', () => {
    // $FlowIgnore = entity could be null
    const property = R.head(metaEd.entity.interchange.get(interchangeName1).identityTemplates);
    const referencedEntity = metaEd.entity.domainEntity.get(domainEntityName2);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });
});

describe('when building and enhancing association property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const associationName1: string = 'AssociationName1';
  const domainEntityName1: string = 'DomainEntityName1';
  const associationDocumentation: string = 'AssociationDocumentation';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(associationName1)
      .withDocumentation(associationDocumentation)
      .withAssociationDomainEntityProperty('AssociationDomainEntityProperty1', 'AssociationDomainEntityPropertyDocumentation')
      .withAssociationDomainEntityProperty('AssociationDomainEntityProperty2', 'AssociationDomainEntityPropertyDocumentation')
      .withEndAssociation()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withAssociationProperty(associationName1, 'inherited', false, false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should enhance property path name with context', () => {
    const property = R.head(metaEd.propertyIndex.association.filter(x => x.metaEdName === associationName1));
    expect(property).toBeDefined();
    expect(property.propertyPathName).toBe(`${contextName}${associationName1}`);
  });

  it('should enhance referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.association.filter(x => x.metaEdName === associationName1));
    const referencedEntity = metaEd.entity.association.get(associationName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', () => {
    const property = R.head(metaEd.propertyIndex.association.filter(x => x.metaEdName === associationName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(associationDocumentation);
  });
});

describe('when building and enhancing choice property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const choiceName1: string = 'ChoiceName1';
  const domainEntityName1: string = 'DomainEntityName1';
  const choiceDocumentation: string = 'ChoiceDocumentation';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartChoice(choiceName1)
      .withDocumentation(choiceDocumentation)
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withIntegerIdentity('IntegerIdentity2', 'IntegerIdentityDocumentation')
      .withEndChoice()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withChoiceProperty(choiceName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one choice', () => {
    expect(metaEd.entity.choice.size).toBe(1);
  });

  it('should enhance property path name with context', () => {
    const property = R.head(metaEd.propertyIndex.choice.filter(x => x.metaEdName === choiceName1));
    expect(property).toBeDefined();
    expect(property.propertyPathName).toBe(`${contextName}${choiceName1}`);
  });

  it('should enhance referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.choice.filter(x => x.metaEdName === choiceName1));
    const referencedEntity = metaEd.entity.choice.get(choiceName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', () => {
    const property = R.head(metaEd.propertyIndex.choice.filter(x => x.metaEdName === choiceName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(choiceDocumentation);
  });
});

describe('when building and enhancing common property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName1: string = 'CommonName1';
  const domainEntityName1: string = 'DomainEntityName1';
  const commonDocumentation: string = 'CommonDocumentation';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(commonName1)
      .withDocumentation(commonDocumentation)
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withCommonProperty(commonName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should enhance property path name with context', () => {
    const property = R.head(metaEd.propertyIndex.common.filter(x => x.metaEdName === commonName1));
    expect(property).toBeDefined();
    expect(property.propertyPathName).toBe(`${contextName}${commonName1}`);
  });

  it('should enhance referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.common.filter(x => x.metaEdName === commonName1));
    const referencedEntity = metaEd.entity.common.get(commonName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', () => {
    const property = R.head(metaEd.propertyIndex.common.filter(x => x.metaEdName === commonName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(commonDocumentation);
  });
});

describe('when building and enhancing descriptor property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const descriptorName1: string = 'DescriptorName1';
  const domainEntityName1: string = 'DomainEntityName1';
  const descriptorDocumentation: string = 'DescriptorDocumentation';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor(descriptorName1)
      .withDocumentation(descriptorDocumentation)
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withEndDescriptor()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDescriptorProperty(descriptorName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one descriptor', () => {
    expect(metaEd.entity.descriptor.size).toBe(1);
  });

  it('should enhance property path name with context', () => {
    const property = R.head(metaEd.propertyIndex.descriptor.filter(x => x.metaEdName === descriptorName1));
    expect(property).toBeDefined();
    expect(property.propertyPathName).toBe(`${contextName}${descriptorName1}`);
  });

  it('should enhance referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.descriptor.filter(x => x.metaEdName === descriptorName1));
    const referencedEntity = metaEd.entity.descriptor.get(descriptorName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', () => {
    const property = R.head(metaEd.propertyIndex.descriptor.filter(x => x.metaEdName === descriptorName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(descriptorDocumentation);
  });
});

describe('when building and enhancing domain entity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const domainEntityDocumentation: string = 'DomainEntityDocumentation';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation(domainEntityDocumentation)
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityProperty(domainEntityName1, 'inherited', false, false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should enhance property path name with context', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(x => x.metaEdName === domainEntityName1));
    expect(property).toBeDefined();
    expect(property.propertyPathName).toBe(`${contextName}${domainEntityName1}`);
  });

  it('should enhance referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(x => x.metaEdName === domainEntityName1));
    const referencedEntity = metaEd.entity.domainEntity.get(domainEntityName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter(x => x.metaEdName === domainEntityName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(domainEntityDocumentation);
  });
});

describe('when building and enhancing enumeration property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const enumerationName1: string = 'EnumerationName1';
  const domainEntityName1: string = 'DomainEntityName1';
  const enumerationDocumentation: string = 'EnumerationDocumentation';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartEnumeration(enumerationName1)
      .withDocumentation(enumerationDocumentation)
      .withEnumerationItem('EnumerationItemShortDescription')
      .withEndEnumeration()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withEnumerationProperty(enumerationName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one enumeration', () => {
    expect(metaEd.entity.enumeration.size).toBe(1);
  });

  it('should enhance property path name with context', () => {
    const property = R.head(metaEd.propertyIndex.enumeration.filter(x => x.metaEdName === enumerationName1));
    expect(property).toBeDefined();
    expect(property.propertyPathName).toBe(`${contextName}${enumerationName1}`);
  });

  it('should enhance referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.enumeration.filter(x => x.metaEdName === enumerationName1));
    const referencedEntity = metaEd.entity.enumeration.get(enumerationName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', () => {
    const property = R.head(metaEd.propertyIndex.enumeration.filter(x => x.metaEdName === enumerationName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(enumerationDocumentation);
  });
});

describe('when building and enhancing inline common property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const inlineCommonName1: string = 'InlineCommonName1';
  const domainEntityName1: string = 'DomainEntityName1';
  const inlineCommonDocumentation: string = 'InlineCommonDocumentation';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInlineCommon(inlineCommonName1)
      .withDocumentation(inlineCommonDocumentation)
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withInlineCommonProperty(inlineCommonName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one inlineCommon', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should enhance property path name with context', () => {
    const property = R.head(metaEd.propertyIndex.inlineCommon.filter(x => x.metaEdName === inlineCommonName1));
    expect(property).toBeDefined();
    expect(property.propertyPathName).toBe(`${contextName}${inlineCommonName1}`);
  });

  it('should enhance referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.inlineCommon.filter(x => x.metaEdName === inlineCommonName1));
    const referencedEntity = metaEd.entity.common.get(inlineCommonName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', () => {
    const property = R.head(metaEd.propertyIndex.inlineCommon.filter(x => x.metaEdName === inlineCommonName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(inlineCommonDocumentation);
  });
});

describe('when building and enhancing school year enumeration property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const schoolYearEnumerationName1: string = 'SchoolYear';
  const domainEntityName1: string = 'DomainEntityName1';
  const schoolYearEnumerationDocumentation: string = 'SchoolYearEnumerationDocumentation';
  const contextName: string = 'ContextName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartEnumeration(schoolYearEnumerationName1)
      .withDocumentation(schoolYearEnumerationDocumentation)
      .withEnumerationItem('EnumerationItemShortDescription')
      .withEndEnumeration()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withEnumerationProperty(schoolYearEnumerationName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one enumeration', () => {
    expect(metaEd.entity.schoolYearEnumeration.size).toBe(1);
  });

  it('should enhance property path name with context', () => {
    const property = R.head(metaEd.propertyIndex.schoolYearEnumeration.filter(x => x.metaEdName === schoolYearEnumerationName1));
    expect(property).toBeDefined();
    expect(property.propertyPathName).toBe(`${contextName}${schoolYearEnumerationName1}`);
  });

  it('should enhance referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.schoolYearEnumeration.filter(x => x.metaEdName === schoolYearEnumerationName1));
    const referencedEntity = metaEd.entity.schoolYearEnumeration.get(schoolYearEnumerationName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', () => {
    const property = R.head(metaEd.propertyIndex.schoolYearEnumeration.filter(x => x.metaEdName === schoolYearEnumerationName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(schoolYearEnumerationDocumentation);
  });
});

describe('when building and enhancing shared decimal property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedDecimalName1: string = 'SharedDecimalName1';
  const domainEntityName1: string = 'DomainEntityName1';
  const sharedDecimalPropertyName1: string = 'SharedDecimalPropertyName1';
  const sharedDecimalDocumentation: string = 'SharedDecimalDocumentation';
  const contextName: string = 'ContextName';
  const totalDigits: string = '5';
  const decimalPlaces: string = '2';
  const minValue: string = '0';
  const maxValue: string = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedDecimal(sharedDecimalName1)
      .withDocumentation(sharedDecimalDocumentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withSharedDecimalProperty(sharedDecimalName1, sharedDecimalPropertyName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []))
      .sendToListener(new DecimalTypeBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one shared decimal', () => {
    expect(metaEd.entity.sharedDecimal.size).toBe(1);
  });

  it('should build one shared decimal type', () => {
    expect(metaEd.entity.decimalType.size).toBe(1);
  });

  it('should enhance property path name with context', () => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter(x => x.metaEdName === sharedDecimalPropertyName1));
    expect(property).toBeDefined();
    expect(property.propertyPathName).toBe(`${contextName}${sharedDecimalPropertyName1}`);
  });

  it('should enhance referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter(x => x.metaEdName === sharedDecimalPropertyName1));
    const referencedEntity = metaEd.entity.sharedDecimal.get(sharedDecimalName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance referenced entity with referring simple property', () => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter(x => x.metaEdName === sharedDecimalPropertyName1));
    const referencedEntity = metaEd.entity.decimalType.get(sharedDecimalName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    // $FlowIgnore - referencedEntity could be null
    expect(R.head(referencedEntity.referringSimpleProperties)).toBe(property);
  });

  it('should enhance inherited documentation', () => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter(x => x.metaEdName === sharedDecimalPropertyName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(sharedDecimalDocumentation);
  });

  it('should enhance total digits', () => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter(x => x.metaEdName === sharedDecimalPropertyName1));
    expect(property).toBeDefined();
    expect(property.totalDigits).toBe(totalDigits);
  });

  it('should enhance decimal places', () => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter(x => x.metaEdName === sharedDecimalPropertyName1));
    expect(property).toBeDefined();
    expect(property.decimalPlaces).toBe(decimalPlaces);
  });

  it('should enhance min value', () => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter(x => x.metaEdName === sharedDecimalPropertyName1));
    expect(property).toBeDefined();
    expect(property.minValue).toBe(minValue);
  });

  it('should enhance max value', () => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter(x => x.metaEdName === sharedDecimalPropertyName1));
    expect(property).toBeDefined();
    expect(property.maxValue).toBe(maxValue);
  });
});

describe('when building and enhancing shared integer property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedIntegerName1: string = 'SharedIntegerName1';
  const domainEntityName1: string = 'DomainEntityName1';
  const sharedIntegerPropertyName1: string = 'SharedIntegerPropertyName1';
  const sharedIntegerDocumentation: string = 'SharedIntegerDocumentation';
  const contextName: string = 'ContextName';
  const minValue: string = '0';
  const maxValue: string = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedInteger(sharedIntegerName1)
      .withDocumentation(sharedIntegerDocumentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withSharedIntegerProperty(sharedIntegerName1, sharedIntegerPropertyName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one shared integer', () => {
    expect(metaEd.entity.sharedInteger.size).toBe(1);
  });

  it('should build one shared integer type', () => {
    expect(metaEd.entity.integerType.size).toBe(1);
  });

  it('should enhance property path name with context', () => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter(x => x.metaEdName === sharedIntegerPropertyName1));
    expect(property).toBeDefined();
    expect(property.propertyPathName).toBe(`${contextName}${sharedIntegerPropertyName1}`);
  });

  it('should enhance referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter(x => x.metaEdName === sharedIntegerPropertyName1));
    const referencedEntity = metaEd.entity.sharedInteger.get(sharedIntegerName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance referenced entity with referring simple property', () => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter(x => x.metaEdName === sharedIntegerPropertyName1));
    const referencedEntity = metaEd.entity.integerType.get(sharedIntegerName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    // $FlowIgnore - referencedEntity could be null
    expect(R.head(referencedEntity.referringSimpleProperties)).toBe(property);
  });

  it('should enhance inherited documentation', () => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter(x => x.metaEdName === sharedIntegerPropertyName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(sharedIntegerDocumentation);
  });

  it('should enhance min value', () => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter(x => x.metaEdName === sharedIntegerPropertyName1));
    expect(property).toBeDefined();
    expect(property.minValue).toBe(minValue);
  });

  it('should enhance max value', () => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter(x => x.metaEdName === sharedIntegerPropertyName1));
    expect(property).toBeDefined();
    expect(property.maxValue).toBe(maxValue);
  });
});

describe('when building and enhancing shared short property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedShortName1: string = 'SharedShortName1';
  const domainEntityName1: string = 'DomainEntityName1';
  const sharedShortPropertyName1: string = 'SharedShortPropertyName1';
  const sharedShortDocumentation: string = 'SharedShortDocumentation';
  const contextName: string = 'ContextName';
  const minValue: string = '0';
  const maxValue: string = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedShort(sharedShortName1)
      .withDocumentation(sharedShortDocumentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withSharedShortProperty(sharedShortName1, sharedShortPropertyName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one shared integer', () => {
    expect(metaEd.entity.sharedInteger.size).toBe(1);
  });

  it('should build one shared integer type', () => {
    expect(metaEd.entity.integerType.size).toBe(1);
  });

  it('should enhance property path name with context', () => {
    const property = R.head(metaEd.propertyIndex.sharedShort.filter(x => x.metaEdName === sharedShortPropertyName1));
    expect(property).toBeDefined();
    expect(property.propertyPathName).toBe(`${contextName}${sharedShortPropertyName1}`);
  });

  it('should enhance referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.sharedShort.filter(x => x.metaEdName === sharedShortPropertyName1));
    const referencedEntity = metaEd.entity.sharedInteger.get(sharedShortName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance referenced entity with referring simple property', () => {
    const property = R.head(metaEd.propertyIndex.sharedShort.filter(x => x.metaEdName === sharedShortPropertyName1));
    const referencedEntity = metaEd.entity.integerType.get(sharedShortName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    // $FlowIgnore - referencedEntity could be null
    expect(R.head(referencedEntity.referringSimpleProperties)).toBe(property);
  });

  it('should enhance inherited documentation', () => {
    const property = R.head(metaEd.propertyIndex.sharedShort.filter(x => x.metaEdName === sharedShortPropertyName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(sharedShortDocumentation);
  });

  it('should enhance min value', () => {
    const property = R.head(metaEd.propertyIndex.sharedShort.filter(x => x.metaEdName === sharedShortPropertyName1));
    expect(property).toBeDefined();
    expect(property.minValue).toBe(minValue);
  });

  it('should enhance max value', () => {
    const property = R.head(metaEd.propertyIndex.sharedShort.filter(x => x.metaEdName === sharedShortPropertyName1));
    expect(property).toBeDefined();
    expect(property.maxValue).toBe(maxValue);
  });
});

describe('when building and enhancing shared string property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedStringName1: string = 'SharedStringName1';
  const domainEntityName1: string = 'DomainEntityName1';
  const sharedStringPropertyName1: string = 'SharedStringPropertyName1';
  const sharedStringDocumentation: string = 'SharedStringDocumentation';
  const contextName: string = 'ContextName';
  const minLength: string = '0';
  const maxLength: string = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedString(sharedStringName1)
      .withDocumentation(sharedStringDocumentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withSharedStringProperty(sharedStringName1, sharedStringPropertyName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new StringTypeBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one shared string', () => {
    expect(metaEd.entity.sharedString.size).toBe(1);
  });

  it('should build one shared string type', () => {
    expect(metaEd.entity.stringType.size).toBe(1);
  });

  it('should enhance property path name with context', () => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter(x => x.metaEdName === sharedStringPropertyName1));
    expect(property).toBeDefined();
    expect(property.propertyPathName).toBe(`${contextName}${sharedStringPropertyName1}`);
  });

  it('should enhance referenced entity', () => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter(x => x.metaEdName === sharedStringPropertyName1));
    const referencedEntity = metaEd.entity.sharedString.get(sharedStringName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance referenced entity with referring simple property', () => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter(x => x.metaEdName === sharedStringPropertyName1));
    const referencedEntity = metaEd.entity.stringType.get(sharedStringName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    // $FlowIgnore - referencedEntity could be null
    expect(R.head(referencedEntity.referringSimpleProperties)).toBe(property);
  });

  it('should enhance inherited documentation', () => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter(x => x.metaEdName === sharedStringPropertyName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(sharedStringDocumentation);
  });

  it('should enhance min length', () => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter(x => x.metaEdName === sharedStringPropertyName1));
    expect(property).toBeDefined();
    expect(property.minLength).toBe(minLength);
  });

  it('should enhance max length', () => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter(x => x.metaEdName === sharedStringPropertyName1));
    expect(property).toBeDefined();
    expect(property.maxLength).toBe(maxLength);
  });
});

describe('when building and enhancing domain entity merged properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const domainEntityName3: string = 'DomainEntityName3';
  const domainEntityDocumentation2: string = 'DomainEntityDocumentation2';
  const domainEntityDocumentation3: string = 'DomainEntityDocumentation3';
  const contextName1: string = 'ContextName1';
  const contextName2: string = 'ContextName2';
  const contextName3: string = 'ContextName3';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName2)
      .withDocumentation(domainEntityDocumentation2)
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation(domainEntityDocumentation3)
      .withDomainEntityProperty(domainEntityName2, 'DomainEntityPropertyDocumentation', false, false, false, contextName1)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityProperty(domainEntityName2, 'inherited', false, false, false, contextName2)
      .withDomainEntityProperty(domainEntityName3, 'inherited', false, false, false, contextName3)
      .withMergePartOfReference(`${contextName3}${domainEntityName3}.${contextName1}${domainEntityName2}`, `${contextName2}${domainEntityName2}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []));

    initialize().enhancer.forEach(enhance => enhance(metaEd));
  });

  it('should build three domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(3);
  });

  it('should enhance property path name with context', () => {
    const property2 = R.head(metaEd.propertyIndex.domainEntity
      .filter(x => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName2));
    expect(property2).toBeDefined();
    expect(property2.propertyPathName).toBe(`${contextName2}${domainEntityName2}`);

    const property3 = R.head(metaEd.propertyIndex.domainEntity
      .filter(x => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName3));
    expect(property3).toBeDefined();
    expect(property3.propertyPathName).toBe(`${contextName3}${domainEntityName3}`);
  });

  it('should enhance referenced entity', () => {
    const property2 = R.head(metaEd.propertyIndex.domainEntity
      .filter(x => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName2));
    const referencedEntity2 = metaEd.entity.domainEntity.get(domainEntityName2);
    expect(property2).toBeDefined();
    expect(referencedEntity2).toBeDefined();
    expect(property2.referencedEntity).toBe(referencedEntity2);

    const property3 = R.head(metaEd.propertyIndex.domainEntity
      .filter(x => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName3));
    const referencedEntity3 = metaEd.entity.domainEntity.get(domainEntityName3);
    expect(property3).toBeDefined();
    expect(referencedEntity3).toBeDefined();
    expect(property3.referencedEntity).toBe(referencedEntity3);
  });

  it('should enhance inherited documentation', () => {
    const property2 = R.head(metaEd.propertyIndex.domainEntity
      .filter(x => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName2));
    expect(property2).toBeDefined();
    expect(property2.documentationInherited).toBe(true);
    expect(property2.documentation).toBe(domainEntityDocumentation2);

    const property3 = R.head(metaEd.propertyIndex.domainEntity
      .filter(x => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName3));
    expect(property3).toBeDefined();
    expect(property3.documentationInherited).toBe(true);
    expect(property3.documentation).toBe(domainEntityDocumentation3);
  });

  it('should enhance merged properties with merge', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity
      .filter(x => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName3));
    const referencedProperty = R.head(metaEd.propertyIndex.domainEntity
      .filter(x => x.parentEntityName === domainEntityName3 && x.metaEdName === domainEntityName2));
    expect(property).toBeDefined();
    expect(referencedProperty).toBeDefined();
    expect(R.head(property.mergedProperties).mergeProperty).toBe(referencedProperty);
  });

  it('should enhance merged properties with target', () => {
    const property = R.head(metaEd.propertyIndex.domainEntity
      .filter(x => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName3));
    const referencedProperty = R.head(metaEd.propertyIndex.domainEntity
      .filter(x => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName2));
    expect(property).toBeDefined();
    expect(referencedProperty).toBeDefined();
    expect(R.head(property.mergedProperties).targetProperty).toBe(referencedProperty);
  });
});
