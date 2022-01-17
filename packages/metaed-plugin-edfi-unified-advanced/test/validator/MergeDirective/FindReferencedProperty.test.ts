import { EntityProperty, MetaEdEnvironment } from '@edfi/metaed-core';
import {
  AssociationBuilder,
  AssociationExtensionBuilder,
  AssociationSubclassBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  DomainEntitySubclassBuilder,
  NamespaceBuilder,
  MetaEdTextBuilder,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import {
  findReferencedProperty,
  matchAllButFirstAsIdentityProperties,
  matchAllIdentityReferenceProperties,
} from '../../../src/validator/MergeDirective/FindReferencedProperty';

describe('when looking for property on current entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName2 = 'DomainEntityName2';
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName1) as any,
      [domainEntityName2],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should return expected property', (): void => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    if (property == null) throw new Error();
    expect(property.metaEdName).toBe(domainEntityName2);
  });
});

describe('when looking for first domain entity on association', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName2 = 'DomainEntityName2';
    const AssociationName1 = 'AssociationName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartAssociation(AssociationName1)
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'AssociationDomainEntityPropertyDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'AssociationDomainEntityPropertyDocumentation')
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.association.get(AssociationName1) as any,
      [domainEntityName1],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should return expected property', (): void => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    if (property == null) throw new Error();
    expect(property.metaEdName).toBe(domainEntityName1);
  });
});

describe('when looking for second domain entity on association', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName2 = 'DomainEntityName2';
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const AssociationName1 = 'AssociationName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartAssociation(AssociationName1)
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'AssociationDomainEntityPropertyDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'AssociationDomainEntityPropertyDocumentation')
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.association.get(AssociationName1) as any,
      [domainEntityName2],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should return expected property', (): void => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    if (property == null) throw new Error();
    expect(property.metaEdName).toBe(domainEntityName2);
  });
});

describe('when looking for non identity property on current entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const integerPropertyName2 = 'IntegerPropertyName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withIntegerProperty(integerPropertyName2, 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName1) as any,
      [integerPropertyName2],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should return undefined', (): void => {
    expect(property).toBeNull();
  });
});

describe('when looking for property that does not exist', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withIntegerProperty('IntegerPropertyName2', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName1) as any,
      ['IntegerPropertyName3'],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should return undefined', (): void => {
    expect(property).toBeNull();
  });
});

describe('when looking for duplicated property role name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const contextName1 = 'ContextName1';
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName2 = 'DomainEntityName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withIntegerProperty('IntegerPropertyName2', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation', contextName1)
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation', 'ContextName2')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName2) as any,
      [`${contextName1}${domainEntityName1}`],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should return expected property', (): void => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    if (property == null) throw new Error();
    expect(property.metaEdName).toBe(domainEntityName1);
    expect(property.roleName).toBe(contextName1);
  });
});

describe('when looking for deep property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';
    const contextName1 = 'ContextName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withIntegerProperty('IntegerPropertyName2', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation', contextName1)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityIdentityDocumentation', contextName1)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName3) as any,
      [`${contextName1}${domainEntityName2}`, `${contextName1}${domainEntityName1}`],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should return expected property', (): void => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    if (property == null) throw new Error();
    expect(property.metaEdName).toBe(domainEntityName1);
  });
});

describe('when looking for non primary key property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName2 = 'DomainEntityName2';
    const contextName1 = 'ContextName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withIntegerProperty('IntegerPropertyName2', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityProperty(domainEntityName1, 'DomainEntityPropertyDocumentation', false, false, false, contextName1)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.domainEntity.get(domainEntityName2) as any,
      [`${contextName1}${domainEntityName1}`],
      matchAllButFirstAsIdentityProperties(),
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should return expected property', (): void => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    if (property == null) throw new Error();
    expect(property.metaEdName).toBe(domainEntityName1);
  });
});

describe('when looking for property on parent abstract entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName2 = 'DomainEntityName2';
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntitySubclassName1 = 'DomainEntitySubclassName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity(domainEntityName1)
      .withDocumentation('AbstractEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityIdentityDocumentation')
      .withEndAbstractEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName1, domainEntityName1)
      .withDocumentation('DomainEntitySubclassDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.domainEntitySubclass.get(domainEntitySubclassName1) as any,
      [domainEntityName2],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one domain entity subclass', (): void => {
    expect(coreNamespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should return expected property', (): void => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    if (property == null) throw new Error();
    expect(property.metaEdName).toBe(domainEntityName2);
  });
});

describe('when looking for property on parent domain entity from subclass', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName2 = 'DomainEntityName2';
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntitySubclassName1 = 'DomainEntitySubclassName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName1, domainEntityName1)
      .withDocumentation('DomainEntitySubclassDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.domainEntitySubclass.get(domainEntitySubclassName1) as any,
      [domainEntityName2],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one domain entity subclass', (): void => {
    expect(coreNamespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should return expected property', (): void => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    if (property == null) throw new Error();
    expect(property.metaEdName).toBe(domainEntityName2);
  });
});

describe('when looking for property on parent domain entity from extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName2 = 'DomainEntityName2';
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntityExtension(domainEntityName1)
      .withDocumentation('DomainEntityExtensionDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.domainEntityExtension.get(domainEntityName1) as any,
      [domainEntityName2],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one domain entity extension', (): void => {
    expect(coreNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should return expected property', (): void => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    if (property == null) throw new Error();
    expect(property.metaEdName).toBe(domainEntityName2);
  });
});

describe('when looking for property on parent association from subclass', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName2 = 'DomainEntityName2';
    const associationName1 = 'AssociationName1';
    const associationSubclassName1 = 'AssociationSubclassName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName1)
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'AssociationDomainEntityPropertyDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'AssociationDomainEntityPropertyDocumentation')
      .withEndAssociation()

      .withStartAssociationSubclass(associationSubclassName1, associationName1)
      .withDocumentation('AssociationSubclassDocumentation')
      .withIntegerIdentity('IntegerIdentityName3', 'IntegerIdentityDocumentation')
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.associationSubclass.get(associationSubclassName1) as any,
      [domainEntityName1],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should build one association subclass', (): void => {
    expect(coreNamespace.entity.associationSubclass.size).toBe(1);
  });

  it('should return expected property', (): void => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    if (property == null) throw new Error();
    expect(property.metaEdName).toBe(domainEntityName1);
  });
});

describe('when looking for property on parent association from extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName2 = 'DomainEntityName2';
    const associationName1 = 'AssociationName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName1)
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'AssociationDomainEntityPropertyDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'AssociationDomainEntityPropertyDocumentation')
      .withEndAssociation()

      .withStartAssociationExtension(associationName1)
      .withDocumentation('AssociationExtensionDocumentation')
      .withIntegerIdentity('IntegerIdentityName3', 'IntegerIdentityDocumentation')
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.associationExtension.get(associationName1) as any,
      [domainEntityName1],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should build one association extension', (): void => {
    expect(coreNamespace.entity.associationExtension.size).toBe(1);
  });

  it('should return expected property', (): void => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    if (property == null) throw new Error();
    expect(property.metaEdName).toBe(domainEntityName1);
  });
});

describe('when looking for property on parent association from extension across namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  let property: any;
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    const domainEntityName2 = 'DomainEntityName2';
    const associationName1 = 'AssociationName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName1)
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'AssociationDomainEntityPropertyDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'AssociationDomainEntityPropertyDocumentation')
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartAssociationExtension(`EdFi.${associationName1}`)
      .withDocumentation('AssociationExtensionDocumentation')
      .withIntegerIdentity('IntegerIdentityName3', 'IntegerIdentityDocumentation')
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    if (coreNamespace == null) throw new Error();
    if (extensionNamespace == null) throw new Error();
    extensionNamespace.dependencies.push(coreNamespace);
    property = findReferencedProperty(
      extensionNamespace,
      extensionNamespace.entity.associationExtension.get(associationName1) as any,
      [domainEntityName1],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should build one association extension', (): void => {
    expect(extensionNamespace.entity.associationExtension.size).toBe(1);
  });

  it('should return expected property', (): void => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    expect(property.metaEdName).toBe(domainEntityName1);
    expect(property.namespace).toBe(coreNamespace);
  });
});

describe('when looking for non identity property on parent domain entity from subclass', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let property: EntityProperty | null;
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntitySubclassName1 = 'DomainEntitySubclassName1';
    const integerPropertyName2 = 'IntegerPropertyName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withIntegerProperty(integerPropertyName2, 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName1, domainEntityName1)
      .withDocumentation('DomainEntitySubclassDocumentation')
      .withIntegerIdentity('IntegerIdentityName3', 'IntegerIdentityDocumentation')
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));
    coreNamespace = metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();

    property = findReferencedProperty(
      coreNamespace,
      coreNamespace.entity.domainEntitySubclass.get(domainEntitySubclassName1) as any,
      [integerPropertyName2],
      matchAllButFirstAsIdentityProperties(),
    );
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity subclass', (): void => {
    expect(coreNamespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should return undefined', (): void => {
    expect(property).toBeNull();
  });
});
