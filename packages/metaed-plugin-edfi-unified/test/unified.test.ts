import R from 'ramda';
import { MetaEdEnvironment } from 'metaed-core';
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
  NamespaceBuilder,
  SharedDecimalBuilder,
  SharedIntegerBuilder,
  SharedStringBuilder,
  StringTypeBuilder,
  MetaEdTextBuilder,
  newMetaEdEnvironment,
} from 'metaed-core';
import { initialize } from '../index';

describe('when building and enhancing domain item', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainName1 = 'DomainName1';
  const subdomainName1 = 'SubdomainName1';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build two domain entities', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one domain', (): void => {
    expect(namespace.entity.domain.size).toBe(1);
  });

  it('should build one subdomain', (): void => {
    expect(namespace.entity.subdomain.size).toBe(1);
  });

  it('should enhance domain entities', (): void => {
    const domainItem = R.head(namespace.entity.domain.get(domainName1).entities);
    const referencedEntity = namespace.entity.domainEntity.get(domainEntityName1);
    expect(domainItem).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(domainItem).toBe(referencedEntity);
  });

  it('should enhance subdomain entities', (): void => {
    const domainItem = R.head(namespace.entity.subdomain.get(subdomainName1).entities);
    const referencedEntity = namespace.entity.domainEntity.get(domainEntityName2);
    expect(domainItem).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(domainItem).toBe(referencedEntity);
  });
});

describe('when building and enhancing subdomain', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainName1 = 'DomainName1';
  const subdomainName1 = 'SubdomainName1';
  const subdomainName2 = 'SubdomainName2';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainBuilder(metaEd, []));
    namespace = metaEd.namespace.get('EdFi');

    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain', (): void => {
    expect(namespace.entity.domain.size).toBe(1);
  });

  it('should build two subdomains', (): void => {
    expect(namespace.entity.subdomain.size).toBe(2);
  });

  it('should enhance subdomain with parent', (): void => {
    const domain = namespace.entity.domain.get(domainName1);
    const subdomain = namespace.entity.subdomain.get(subdomainName1);
    expect(domain).toBeDefined();
    expect(subdomain).toBeDefined();
    expect(subdomain.parent).toBe(domain);
  });

  it('should enhance domains with sorted subdomains', (): void => {
    const domain = namespace.entity.domain.get(domainName1);
    const subdomain1 = namespace.entity.subdomain.get(subdomainName1);
    const subdomain2 = namespace.entity.subdomain.get(subdomainName2);
    expect(domain).toBeDefined();
    expect(subdomain1).toBeDefined();
    expect(subdomain2).toBeDefined();
    expect(R.head(domain.subdomains)).toBe(subdomain2);
    expect(R.last(domain.subdomains)).toBe(subdomain1);
  });
});

describe('when building and enhancing association extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const associationName1 = 'AssociationName1';
  const integerIdentityName1 = 'IntegerIdentityName1';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(associationName1)
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty(
        'AssociationDomainEntityProperty1',
        'AssociationDomainEntityPropertyDocumentation',
      )
      .withAssociationDomainEntityProperty(
        'AssociationDomainEntityProperty2',
        'AssociationDomainEntityPropertyDocumentation',
      )
      .withIntegerIdentity(integerIdentityName1, 'IntegerIdentityDocumentation')
      .withQueryableFieldPropertyIndicator()
      .withEndAssociation()

      .withStartAssociationExtension(associationName1)
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one association', (): void => {
    expect(namespace.entity.association.size).toBe(1);
  });

  it('should build one association extension', (): void => {
    expect(namespace.entity.associationExtension.size).toBe(1);
  });

  it('should enhance base entity', (): void => {
    const baseEntity = namespace.entity.association.get(associationName1);
    const extensionEntity = namespace.entity.associationExtension.get(associationName1);
    expect(baseEntity).toBeDefined();
    expect(extensionEntity).toBeDefined();
    expect(extensionEntity.baseEntity).toBe(baseEntity);
  });

  it('should enhance extension with queryable fields', (): void => {
    const extensionEntity = namespace.entity.associationExtension.get(associationName1);
    expect(extensionEntity).toBeDefined();
    expect(extensionEntity.queryableFields).toHaveLength(1);
    expect(R.head(extensionEntity.queryableFields).metaEdName).toBe(integerIdentityName1);
  });
});

describe('when building and enhancing association subclass', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const associationName1 = 'AssociationName1';
  const associationSubclassName1 = 'AssociationSubclassName1';
  const integerIdentityName1 = 'IntegerIdentityName1';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(associationName1)
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty(
        'AssociationDomainEntityProperty1',
        'AssociationDomainEntityPropertyDocumentation',
      )
      .withAssociationDomainEntityProperty(
        'AssociationDomainEntityProperty2',
        'AssociationDomainEntityPropertyDocumentation',
      )
      .withIntegerIdentity(integerIdentityName1, 'IntegerIdentityDocumentation')
      .withQueryableFieldPropertyIndicator()
      .withEndAssociation()

      .withStartAssociationSubclass(associationSubclassName1, associationName1)
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one association', (): void => {
    expect(namespace.entity.association.size).toBe(1);
  });

  it('should build one association subclass', (): void => {
    expect(namespace.entity.associationSubclass.size).toBe(1);
  });

  it('should enhance base entity', (): void => {
    const baseEntity = namespace.entity.association.get(associationName1);
    const subclassEntity = namespace.entity.associationSubclass.get(associationSubclassName1);
    expect(baseEntity).toBeDefined();
    expect(subclassEntity).toBeDefined();
    expect(subclassEntity.baseEntity).toBe(baseEntity);
  });

  it('should enhance subclass with queryable fields', (): void => {
    const subclassEntity = namespace.entity.associationSubclass.get(associationSubclassName1);
    expect(subclassEntity).toBeDefined();
    expect(subclassEntity.queryableFields).toHaveLength(1);
    expect(R.head(subclassEntity.queryableFields).metaEdName).toBe(integerIdentityName1);
  });
});

describe('when building and enhancing common extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName1 = 'CommonName1';
  const integerIdentityName1 = 'IntegerIdentityName1';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(commonName1)
      .withDocumentation('CommonDocumentation')
      .withIntegerIdentity(integerIdentityName1, 'IntegerIdentityDocumentation')
      .withQueryableFieldPropertyIndicator()
      .withEndCommon()

      .withStartCommonExtension(commonName1)
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one common', (): void => {
    expect(namespace.entity.common.size).toBe(1);
  });

  it('should build one common extension', (): void => {
    expect(namespace.entity.commonExtension.size).toBe(1);
  });

  it('should enhance base entity', (): void => {
    const baseEntity = namespace.entity.common.get(commonName1);
    const extensionEntity = namespace.entity.commonExtension.get(commonName1);
    expect(baseEntity).toBeDefined();
    expect(extensionEntity).toBeDefined();
    expect(extensionEntity.baseEntity).toBe(baseEntity);
  });

  it('should enhance extension with queryable fields', (): void => {
    const extensionEntity = namespace.entity.commonExtension.get(commonName1);
    expect(extensionEntity).toBeDefined();
    expect(extensionEntity.queryableFields).toHaveLength(1);
    expect(R.head(extensionEntity.queryableFields).metaEdName).toBe(integerIdentityName1);
  });
});

describe('when building and enhancing domain entity extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const integerIdentityName1 = 'IntegerIdentityName1';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(integerIdentityName1, 'IntegerIdentityDocumentation')
      .withQueryableFieldPropertyIndicator()
      .withEndDomainEntity()

      .withStartDomainEntityExtension(domainEntityName1)
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity extension', (): void => {
    expect(namespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should enhance base entity', (): void => {
    const baseEntity = namespace.entity.domainEntity.get(domainEntityName1);
    const extensionEntity = namespace.entity.domainEntityExtension.get(domainEntityName1);
    expect(baseEntity).toBeDefined();
    expect(extensionEntity).toBeDefined();
    expect(extensionEntity.baseEntity).toBe(baseEntity);
  });

  it('should enhance extension with queryable fields', (): void => {
    const extensionEntity = namespace.entity.domainEntityExtension.get(domainEntityName1);
    expect(extensionEntity).toBeDefined();
    expect(extensionEntity.queryableFields).toHaveLength(1);
    expect(R.head(extensionEntity.queryableFields).metaEdName).toBe(integerIdentityName1);
  });
});

describe('when building and enhancing domain entity subclass', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntitySubclassName1 = 'DomainEntitySubclassName1';
  const integerIdentityName1 = 'IntegerIdentityName1';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(integerIdentityName1, 'IntegerIdentityDocumentation')
      .withQueryableFieldPropertyIndicator()
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName1, domainEntityName1)
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity subclass', (): void => {
    expect(namespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should enhance base entity', (): void => {
    const baseEntity = namespace.entity.domainEntity.get(domainEntityName1);
    const subclassEntity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName1);
    expect(baseEntity).toBeDefined();
    expect(subclassEntity).toBeDefined();
    expect(subclassEntity.baseEntity).toBe(baseEntity);
  });

  it('should enhance subclass with queryable fields', (): void => {
    const subclassEntity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName1);
    expect(subclassEntity).toBeDefined();
    expect(subclassEntity.queryableFields).toHaveLength(1);
    expect(R.head(subclassEntity.queryableFields).metaEdName).toBe(integerIdentityName1);
  });
});

describe('when building and enhancing interchange extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const interchangeName1 = 'InterchangeName1';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one interchange', (): void => {
    expect(namespace.entity.interchange.size).toBe(1);
  });

  it('should build one interchange extension', (): void => {
    expect(namespace.entity.interchangeExtension.size).toBe(1);
  });

  it('should enhance base entity', (): void => {
    const baseEntity = namespace.entity.interchange.get(interchangeName1);
    const extensionEntity = namespace.entity.interchangeExtension.get(interchangeName1);
    expect(baseEntity).toBeDefined();
    expect(extensionEntity).toBeDefined();
    expect(extensionEntity.baseEntity).toBe(baseEntity);
  });
});

describe('when building and enhancing interchange items', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const interchangeName1 = 'InterchangeName1';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build two domain entities', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one interchange', (): void => {
    expect(namespace.entity.interchange.size).toBe(1);
  });

  it('should enhance elements with referenced entity', (): void => {
    const property = R.head(namespace.entity.interchange.get(interchangeName1).elements);
    const referencedEntity = namespace.entity.domainEntity.get(domainEntityName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance identity templates with referenced entity', (): void => {
    const property = R.head(namespace.entity.interchange.get(interchangeName1).identityTemplates);
    const referencedEntity = namespace.entity.domainEntity.get(domainEntityName2);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });
});

describe('when building and enhancing association property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const associationName1 = 'AssociationName1';
  const domainEntityName1 = 'DomainEntityName1';
  const associationDocumentation = 'AssociationDocumentation';
  const contextName = 'ContextName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(associationName1)
      .withDocumentation(associationDocumentation)
      .withAssociationDomainEntityProperty(
        'AssociationDomainEntityProperty1',
        'AssociationDomainEntityPropertyDocumentation',
      )
      .withAssociationDomainEntityProperty(
        'AssociationDomainEntityProperty2',
        'AssociationDomainEntityPropertyDocumentation',
      )
      .withEndAssociation()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withAssociationProperty(associationName1, 'inherited', false, false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one association', (): void => {
    expect(namespace.entity.association.size).toBe(1);
  });

  it('should enhance property path name role name', (): void => {
    const property = R.head(metaEd.propertyIndex.association.filter((x) => x.metaEdName === associationName1));
    expect(property).toBeDefined();
    expect(property.fullPropertyName).toBe(`${contextName}${associationName1}`);
  });

  it('should enhance referenced entity', (): void => {
    const property = R.head(metaEd.propertyIndex.association.filter((x) => x.metaEdName === associationName1));
    const referencedEntity = namespace.entity.association.get(associationName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', (): void => {
    const property = R.head(metaEd.propertyIndex.association.filter((x) => x.metaEdName === associationName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(associationDocumentation);
  });
});

describe('when building and enhancing choice property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const choiceName1 = 'ChoiceName1';
  const domainEntityName1 = 'DomainEntityName1';
  const choiceDocumentation = 'ChoiceDocumentation';
  const contextName = 'ContextName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one choice', (): void => {
    expect(namespace.entity.choice.size).toBe(1);
  });

  it('should enhance property path name role name', (): void => {
    const property = R.head(metaEd.propertyIndex.choice.filter((x) => x.metaEdName === choiceName1));
    expect(property).toBeDefined();
    expect(property.fullPropertyName).toBe(`${contextName}${choiceName1}`);
  });

  it('should enhance referenced entity', (): void => {
    const property = R.head(metaEd.propertyIndex.choice.filter((x) => x.metaEdName === choiceName1));
    const referencedEntity = namespace.entity.choice.get(choiceName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', (): void => {
    const property = R.head(metaEd.propertyIndex.choice.filter((x) => x.metaEdName === choiceName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(choiceDocumentation);
  });
});

describe('when building and enhancing common property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const commonName1 = 'CommonName1';
  const domainEntityName1 = 'DomainEntityName1';
  const commonDocumentation = 'CommonDocumentation';
  const contextName = 'ContextName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(commonName1)
      .withDocumentation(commonDocumentation)
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withCommonProperty(commonName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one common', (): void => {
    expect(namespace.entity.common.size).toBe(1);
  });

  it('should enhance property path name role name', (): void => {
    const property = R.head(metaEd.propertyIndex.common.filter((x) => x.metaEdName === commonName1));
    expect(property).toBeDefined();
    expect(property.fullPropertyName).toBe(`${contextName}${commonName1}`);
  });

  it('should enhance referenced entity', (): void => {
    const property = R.head(metaEd.propertyIndex.common.filter((x) => x.metaEdName === commonName1));
    const referencedEntity = namespace.entity.common.get(commonName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', (): void => {
    const property = R.head(metaEd.propertyIndex.common.filter((x) => x.metaEdName === commonName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(commonDocumentation);
  });
});

describe('when building and enhancing descriptor property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const descriptorName1 = 'DescriptorName1';
  const domainEntityName1 = 'DomainEntityName1';
  const descriptorDocumentation = 'DescriptorDocumentation';
  const contextName = 'ContextName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDescriptor(descriptorName1)
      .withDocumentation(descriptorDocumentation)
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withEndDescriptor()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDescriptorProperty(descriptorName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one descriptor', (): void => {
    expect(namespace.entity.descriptor.size).toBe(1);
  });

  it('should enhance property path name role name', (): void => {
    const property = R.head(metaEd.propertyIndex.descriptor.filter((x) => x.metaEdName === descriptorName1));
    expect(property).toBeDefined();
    expect(property.fullPropertyName).toBe(`${contextName}${descriptorName1}`);
  });

  it('should enhance referenced entity', (): void => {
    const property = R.head(metaEd.propertyIndex.descriptor.filter((x) => x.metaEdName === descriptorName1));
    const referencedEntity = namespace.entity.descriptor.get(descriptorName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', (): void => {
    const property = R.head(metaEd.propertyIndex.descriptor.filter((x) => x.metaEdName === descriptorName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(descriptorDocumentation);
  });
});

describe('when building and enhancing domain entity property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityDocumentation = 'DomainEntityDocumentation';
  const contextName = 'ContextName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation(domainEntityDocumentation)
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityProperty(domainEntityName1, 'inherited', false, false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build two domain entities', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(2);
  });

  it('should enhance property path name role name', (): void => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter((x) => x.metaEdName === domainEntityName1));
    expect(property).toBeDefined();
    expect(property.fullPropertyName).toBe(`${contextName}${domainEntityName1}`);
  });

  it('should enhance referenced entity', (): void => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter((x) => x.metaEdName === domainEntityName1));
    const referencedEntity = namespace.entity.domainEntity.get(domainEntityName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', (): void => {
    const property = R.head(metaEd.propertyIndex.domainEntity.filter((x) => x.metaEdName === domainEntityName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(domainEntityDocumentation);
  });
});

describe('when building and enhancing enumeration property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const enumerationName1 = 'EnumerationName1';
  const domainEntityName1 = 'DomainEntityName1';
  const enumerationDocumentation = 'EnumerationDocumentation';
  const contextName = 'ContextName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartEnumeration(enumerationName1)
      .withDocumentation(enumerationDocumentation)
      .withEnumerationItem('EnumerationItemShortDescription')
      .withEndEnumeration()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withEnumerationProperty(enumerationName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one enumeration', (): void => {
    expect(namespace.entity.enumeration.size).toBe(1);
  });

  it('should enhance property path name role name', (): void => {
    const property = R.head(metaEd.propertyIndex.enumeration.filter((x) => x.metaEdName === enumerationName1));
    expect(property).toBeDefined();
    expect(property.fullPropertyName).toBe(`${contextName}${enumerationName1}`);
  });

  it('should enhance referenced entity', (): void => {
    const property = R.head(metaEd.propertyIndex.enumeration.filter((x) => x.metaEdName === enumerationName1));
    const referencedEntity = namespace.entity.enumeration.get(enumerationName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', (): void => {
    const property = R.head(metaEd.propertyIndex.enumeration.filter((x) => x.metaEdName === enumerationName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(enumerationDocumentation);
  });
});

describe('when building and enhancing inline common property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const inlineCommonName1 = 'InlineCommonName1';
  const domainEntityName1 = 'DomainEntityName1';
  const inlineCommonDocumentation = 'InlineCommonDocumentation';
  const contextName = 'ContextName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInlineCommon(inlineCommonName1)
      .withDocumentation(inlineCommonDocumentation)
      .withIntegerIdentity('IntegerIdentity1', 'IntegerIdentityDocumentation')
      .withEndInlineCommon()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withInlineCommonProperty(inlineCommonName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one inlineCommon', (): void => {
    expect(namespace.entity.common.size).toBe(1);
  });

  it('should enhance property path name role name', (): void => {
    const property = R.head(metaEd.propertyIndex.inlineCommon.filter((x) => x.metaEdName === inlineCommonName1));
    expect(property).toBeDefined();
    expect(property.fullPropertyName).toBe(`${contextName}${inlineCommonName1}`);
  });

  it('should enhance referenced entity', (): void => {
    const property = R.head(metaEd.propertyIndex.inlineCommon.filter((x) => x.metaEdName === inlineCommonName1));
    const referencedEntity = namespace.entity.common.get(inlineCommonName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', (): void => {
    const property = R.head(metaEd.propertyIndex.inlineCommon.filter((x) => x.metaEdName === inlineCommonName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(inlineCommonDocumentation);
  });
});

describe('when building and enhancing school year enumeration property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const schoolYearEnumerationName1 = 'SchoolYear';
  const domainEntityName1 = 'DomainEntityName1';
  const schoolYearEnumerationDocumentation = 'SchoolYearEnumerationDocumentation';
  const contextName = 'ContextName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartEnumeration(schoolYearEnumerationName1)
      .withDocumentation(schoolYearEnumerationDocumentation)
      .withEnumerationItem('EnumerationItemShortDescription')
      .withEndEnumeration()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withEnumerationProperty(schoolYearEnumerationName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one enumeration', (): void => {
    expect(namespace.entity.schoolYearEnumeration.size).toBe(1);
  });

  it('should enhance property path name role name', (): void => {
    const property = R.head(
      metaEd.propertyIndex.schoolYearEnumeration.filter((x) => x.metaEdName === schoolYearEnumerationName1),
    );
    expect(property).toBeDefined();
    expect(property.fullPropertyName).toBe(`${contextName}${schoolYearEnumerationName1}`);
  });

  it('should enhance referenced entity', (): void => {
    const property = R.head(
      metaEd.propertyIndex.schoolYearEnumeration.filter((x) => x.metaEdName === schoolYearEnumerationName1),
    );
    const referencedEntity = namespace.entity.schoolYearEnumeration.get(schoolYearEnumerationName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance inherited documentation', (): void => {
    const property = R.head(
      metaEd.propertyIndex.schoolYearEnumeration.filter((x) => x.metaEdName === schoolYearEnumerationName1),
    );
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(schoolYearEnumerationDocumentation);
  });
});

describe('when building and enhancing shared decimal property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedDecimalName1 = 'SharedDecimalName1';
  const domainEntityName1 = 'DomainEntityName1';
  const sharedDecimalPropertyName1 = 'SharedDecimalPropertyName1';
  const sharedDecimalDocumentation = 'SharedDecimalDocumentation';
  const contextName = 'ContextName';
  const totalDigits = '5';
  const decimalPlaces = '2';
  const minValue = '0';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedDecimal(sharedDecimalName1)
      .withDocumentation(sharedDecimalDocumentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withSharedDecimalProperty(sharedDecimalName1, sharedDecimalPropertyName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []))
      .sendToListener(new DecimalTypeBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one shared decimal', (): void => {
    expect(namespace.entity.sharedDecimal.size).toBe(1);
  });

  it('should build one shared decimal type', (): void => {
    expect(namespace.entity.decimalType.size).toBe(1);
  });

  it('should enhance property path name role name', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter((x) => x.metaEdName === sharedDecimalPropertyName1));
    expect(property).toBeDefined();
    expect(property.fullPropertyName).toBe(`${contextName}${sharedDecimalPropertyName1}`);
  });

  it('should enhance referenced entity', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter((x) => x.metaEdName === sharedDecimalPropertyName1));
    const referencedEntity = namespace.entity.sharedDecimal.get(sharedDecimalName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance referenced entity with referring simple property', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter((x) => x.metaEdName === sharedDecimalPropertyName1));
    const referencedEntity = namespace.entity.decimalType.get(sharedDecimalName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(R.head(referencedEntity.referringSimpleProperties)).toBe(property);
  });

  it('should enhance inherited documentation', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter((x) => x.metaEdName === sharedDecimalPropertyName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(sharedDecimalDocumentation);
  });

  it('should enhance total digits', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter((x) => x.metaEdName === sharedDecimalPropertyName1));
    expect(property).toBeDefined();
    expect(property.totalDigits).toBe(totalDigits);
  });

  it('should enhance decimal places', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter((x) => x.metaEdName === sharedDecimalPropertyName1));
    expect(property).toBeDefined();
    expect(property.decimalPlaces).toBe(decimalPlaces);
  });

  it('should enhance min value', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter((x) => x.metaEdName === sharedDecimalPropertyName1));
    expect(property).toBeDefined();
    expect(property.minValue).toBe(minValue);
  });

  it('should enhance max value', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedDecimal.filter((x) => x.metaEdName === sharedDecimalPropertyName1));
    expect(property).toBeDefined();
    expect(property.maxValue).toBe(maxValue);
  });
});

describe('when building and enhancing shared integer property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedIntegerName1 = 'SharedIntegerName1';
  const domainEntityName1 = 'DomainEntityName1';
  const sharedIntegerPropertyName1 = 'SharedIntegerPropertyName1';
  const sharedIntegerDocumentation = 'SharedIntegerDocumentation';
  const contextName = 'ContextName';
  const minValue = '0';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedInteger(sharedIntegerName1)
      .withDocumentation(sharedIntegerDocumentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withSharedIntegerProperty(sharedIntegerName1, sharedIntegerPropertyName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one shared integer', (): void => {
    expect(namespace.entity.sharedInteger.size).toBe(1);
  });

  it('should build one shared integer type', (): void => {
    expect(namespace.entity.integerType.size).toBe(1);
  });

  it('should enhance property path name role name', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter((x) => x.metaEdName === sharedIntegerPropertyName1));
    expect(property).toBeDefined();
    expect(property.fullPropertyName).toBe(`${contextName}${sharedIntegerPropertyName1}`);
  });

  it('should enhance referenced entity', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter((x) => x.metaEdName === sharedIntegerPropertyName1));
    const referencedEntity = namespace.entity.sharedInteger.get(sharedIntegerName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance referenced entity with referring simple property', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter((x) => x.metaEdName === sharedIntegerPropertyName1));
    const referencedEntity = namespace.entity.integerType.get(sharedIntegerName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(R.head(referencedEntity.referringSimpleProperties)).toBe(property);
  });

  it('should enhance inherited documentation', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter((x) => x.metaEdName === sharedIntegerPropertyName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(sharedIntegerDocumentation);
  });

  it('should enhance min value', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter((x) => x.metaEdName === sharedIntegerPropertyName1));
    expect(property).toBeDefined();
    expect(property.minValue).toBe(minValue);
  });

  it('should enhance max value', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedInteger.filter((x) => x.metaEdName === sharedIntegerPropertyName1));
    expect(property).toBeDefined();
    expect(property.maxValue).toBe(maxValue);
  });
});

describe('when building and enhancing shared short property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedShortName1 = 'SharedShortName1';
  const domainEntityName1 = 'DomainEntityName1';
  const sharedShortPropertyName1 = 'SharedShortPropertyName1';
  const sharedShortDocumentation = 'SharedShortDocumentation';
  const contextName = 'ContextName';
  const minValue = '0';
  const maxValue = '100';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedShort(sharedShortName1)
      .withDocumentation(sharedShortDocumentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withSharedShortProperty(sharedShortName1, sharedShortPropertyName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []))
      .sendToListener(new IntegerTypeBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one shared integer', (): void => {
    expect(namespace.entity.sharedInteger.size).toBe(1);
  });

  it('should build one shared integer type', (): void => {
    expect(namespace.entity.integerType.size).toBe(1);
  });

  it('should enhance property path name role name', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedShort.filter((x) => x.metaEdName === sharedShortPropertyName1));
    expect(property).toBeDefined();
    expect(property.fullPropertyName).toBe(`${contextName}${sharedShortPropertyName1}`);
  });

  it('should enhance referenced entity', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedShort.filter((x) => x.metaEdName === sharedShortPropertyName1));
    const referencedEntity = namespace.entity.sharedInteger.get(sharedShortName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance referenced entity with referring simple property', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedShort.filter((x) => x.metaEdName === sharedShortPropertyName1));
    const referencedEntity = namespace.entity.integerType.get(sharedShortName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(R.head(referencedEntity.referringSimpleProperties)).toBe(property);
  });

  it('should enhance inherited documentation', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedShort.filter((x) => x.metaEdName === sharedShortPropertyName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(sharedShortDocumentation);
  });

  it('should enhance min value', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedShort.filter((x) => x.metaEdName === sharedShortPropertyName1));
    expect(property).toBeDefined();
    expect(property.minValue).toBe(minValue);
  });

  it('should enhance max value', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedShort.filter((x) => x.metaEdName === sharedShortPropertyName1));
    expect(property).toBeDefined();
    expect(property.maxValue).toBe(maxValue);
  });
});

describe('when building and enhancing shared string property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedStringName1 = 'SharedStringName1';
  const domainEntityName1 = 'DomainEntityName1';
  const sharedStringPropertyName1 = 'SharedStringPropertyName1';
  const sharedStringDocumentation = 'SharedStringDocumentation';
  const contextName = 'ContextName';
  const minLength = '0';
  const maxLength = '100';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedString(sharedStringName1)
      .withDocumentation(sharedStringDocumentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()

      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withSharedStringProperty(sharedStringName1, sharedStringPropertyName1, 'inherited', false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new StringTypeBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one shared string', (): void => {
    expect(namespace.entity.sharedString.size).toBe(1);
  });

  it('should build one shared string type', (): void => {
    expect(namespace.entity.stringType.size).toBe(1);
  });

  it('should enhance property path name role name', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter((x) => x.metaEdName === sharedStringPropertyName1));
    expect(property).toBeDefined();
    expect(property.fullPropertyName).toBe(`${contextName}${sharedStringPropertyName1}`);
  });

  it('should enhance referenced entity', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter((x) => x.metaEdName === sharedStringPropertyName1));
    const referencedEntity = namespace.entity.sharedString.get(sharedStringName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(property.referencedEntity).toBe(referencedEntity);
  });

  it('should enhance referenced entity with referring simple property', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter((x) => x.metaEdName === sharedStringPropertyName1));
    const referencedEntity = namespace.entity.stringType.get(sharedStringName1);
    expect(property).toBeDefined();
    expect(referencedEntity).toBeDefined();
    expect(R.head(referencedEntity.referringSimpleProperties)).toBe(property);
  });

  it('should enhance inherited documentation', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter((x) => x.metaEdName === sharedStringPropertyName1));
    expect(property).toBeDefined();
    expect(property.documentationInherited).toBe(true);
    expect(property.documentation).toBe(sharedStringDocumentation);
  });

  it('should enhance min length', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter((x) => x.metaEdName === sharedStringPropertyName1));
    expect(property).toBeDefined();
    expect(property.minLength).toBe(minLength);
  });

  it('should enhance max length', (): void => {
    const property = R.head(metaEd.propertyIndex.sharedString.filter((x) => x.metaEdName === sharedStringPropertyName1));
    expect(property).toBeDefined();
    expect(property.maxLength).toBe(maxLength);
  });
});

describe('when building and enhancing domain entity merge directives', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityName3 = 'DomainEntityName3';
  const domainEntityDocumentation2 = 'DomainEntityDocumentation2';
  const domainEntityDocumentation3 = 'DomainEntityDocumentation3';
  const contextName1 = 'ContextName1';
  const contextName2 = 'ContextName2';
  const contextName3 = 'ContextName3';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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
      .withMergeDirective(
        `${contextName3}${domainEntityName3}.${contextName1}${domainEntityName2}`,
        `${contextName2}${domainEntityName2}`,
      )
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get('EdFi');
    initialize().enhancer.forEach((enhance) => enhance(metaEd));
  });

  it('should build three domain entities', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(3);
  });

  it('should enhance property path name role name', (): void => {
    const property2 = R.head(
      metaEd.propertyIndex.domainEntity.filter(
        (x) => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName2,
      ),
    );
    expect(property2).toBeDefined();
    expect(property2.fullPropertyName).toBe(`${contextName2}${domainEntityName2}`);

    const property3 = R.head(
      metaEd.propertyIndex.domainEntity.filter(
        (x) => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName3,
      ),
    );
    expect(property3).toBeDefined();
    expect(property3.fullPropertyName).toBe(`${contextName3}${domainEntityName3}`);
  });

  it('should enhance referenced entity', (): void => {
    const property2 = R.head(
      metaEd.propertyIndex.domainEntity.filter(
        (x) => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName2,
      ),
    );
    const referencedEntity2 = namespace.entity.domainEntity.get(domainEntityName2);
    expect(property2).toBeDefined();
    expect(referencedEntity2).toBeDefined();
    expect(property2.referencedEntity).toBe(referencedEntity2);

    const property3 = R.head(
      metaEd.propertyIndex.domainEntity.filter(
        (x) => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName3,
      ),
    );
    const referencedEntity3 = namespace.entity.domainEntity.get(domainEntityName3);
    expect(property3).toBeDefined();
    expect(referencedEntity3).toBeDefined();
    expect(property3.referencedEntity).toBe(referencedEntity3);
  });

  it('should enhance inherited documentation', (): void => {
    const property2 = R.head(
      metaEd.propertyIndex.domainEntity.filter(
        (x) => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName2,
      ),
    );
    expect(property2).toBeDefined();
    expect(property2.documentationInherited).toBe(true);
    expect(property2.documentation).toBe(domainEntityDocumentation2);

    const property3 = R.head(
      metaEd.propertyIndex.domainEntity.filter(
        (x) => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName3,
      ),
    );
    expect(property3).toBeDefined();
    expect(property3.documentationInherited).toBe(true);
    expect(property3.documentation).toBe(domainEntityDocumentation3);
  });

  it('should enhance merge directives with merge', (): void => {
    const property = R.head(
      metaEd.propertyIndex.domainEntity.filter(
        (x) => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName3,
      ),
    );
    const referencedProperty = R.head(
      metaEd.propertyIndex.domainEntity.filter(
        (x) => x.parentEntityName === domainEntityName3 && x.metaEdName === domainEntityName2,
      ),
    );
    expect(property).toBeDefined();
    expect(referencedProperty).toBeDefined();
    expect(property.mergeDirectives[0].sourceProperty).toBe(referencedProperty);
  });

  it('should enhance merge directives with target', (): void => {
    const property = R.head(
      metaEd.propertyIndex.domainEntity.filter(
        (x) => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName3,
      ),
    );
    const referencedProperty = R.head(
      metaEd.propertyIndex.domainEntity.filter(
        (x) => x.parentEntityName === domainEntityName1 && x.metaEdName === domainEntityName2,
      ),
    );
    expect(property).toBeDefined();
    expect(referencedProperty).toBeDefined();
    expect(R.head(property.mergeDirectives).targetProperty).toBe(referencedProperty);
  });
});
