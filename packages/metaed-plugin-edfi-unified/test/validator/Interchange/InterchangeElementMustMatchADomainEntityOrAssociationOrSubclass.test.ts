import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  AssociationBuilder,
  AssociationSubclassBuilder,
  DescriptorBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  InterchangeBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/Interchange/InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass';

describe('when validating interchange element is an abstract entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const abstractEntityName = 'AbstractEntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity(abstractEntityName)
      .withDocumentation('AbstractEntityDocumentation')
      .withStringIdentity('StringName', 'StringDocumentation', '100')
      .withEndAbstractEntity()

      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement(abstractEntityName)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one abstract entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange element is a domain entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('DomainEntityDocumentation')
      .withStringIdentity('StringName', 'StringDocumentation', '100')
      .withEndDomainEntity()

      .withStartInterchange('InterchangeName')
      .withDocumentation('EntityDocumentation')
      .withDomainEntityElement(domainEntityName)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange element is a domain entity across namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('DomainEntityDocumentation')
      .withStringIdentity('StringName', 'StringDocumentation', '100')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartInterchange('InterchangeName')
      .withDocumentation('EntityDocumentation')
      .withDomainEntityElement(`EdFi.${domainEntityName}`)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one interchange', (): void => {
    expect(extensionNamespace.entity.interchange.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange element is a domain entity subclass', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  const domainEntitySubclassName = 'DomainEntitySubclassName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('DomainEntityDocumentation')
      .withBooleanProperty('BooleanName1', 'BooleanDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, domainEntityName)
      .withDocumentation('DomainEntitySubclassDocumentation')
      .withBooleanProperty('BooleanName2', 'BooleanDocumentation', true, false)
      .withEndDomainEntitySubclass()

      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement(domainEntitySubclassName)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity subclass', (): void => {
    expect(coreNamespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange element is an association', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const associationName = 'AssociationName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(associationName)
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty('DomainEntityName1', 'DomainEntityDocumentation')
      .withAssociationDomainEntityProperty('DomainEntityName2', 'DomainEntityDocumentation')
      .withBooleanProperty('BooleanName', 'BooleanDocumentation', true, false)
      .withEndAssociation()

      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withAssociationElement(associationName)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange element is an association subclass', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const associationName = 'AssociationName';
  const associationSubclassName = 'AssociationSubclassName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(associationName)
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty('DomainEntityName1', 'EntityDocumentation')
      .withAssociationDomainEntityProperty('DomainEntityName2', 'EntityDocumentation')
      .withBooleanProperty('BooleanName1', 'BooleanDocumentation', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass(associationSubclassName, associationName)
      .withDocumentation('SubclassDocumentation')
      .withBooleanProperty('BooleanName2', 'BooleanDocumentation', true, false)
      .withEndAssociationSubclass()

      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withAssociationElement(associationSubclassName)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should build one association subclass', (): void => {
    expect(coreNamespace.entity.associationSubclass.size).toBe(1);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange element is a descriptor', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const descriptorName = 'DescriptorName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDescriptor(descriptorName)
      .withDocumentation('DescriptorDocumentation')
      .withStartMapType()
      .withDocumentation('MapTypeDocumentation')
      .withEnumerationItem('EnumerationItemShortDescription', 'EnumerationItemDocumentation')
      .withEndMapType()
      .withEndDescriptor()

      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDescriptorElement(descriptorName)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one descriptor', (): void => {
    expect(coreNamespace.entity.descriptor.size).toBe(1);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating interchange element has invalid name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartInterchange('InterchangeName')
      .withDocumentation('InterchangeDocumentation')
      .withDomainEntityElement('DomainEntityName')
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one interchange', (): void => {
    expect(coreNamespace.entity.interchange.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
