// @flow
import type { EntityProperty, MetaEdEnvironment } from 'metaed-core';
import {
  AssociationBuilder,
  AssociationExtensionBuilder,
  AssociationSubclassBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  DomainEntitySubclassBuilder,
  NamespaceInfoBuilder,
  MetaEdTextBuilder,
  newMetaEdEnvironment,
} from 'metaed-core';
import {
  findReferencedProperty,
  matchAllButFirstAsIdentityProperties,
  matchAllIdentityReferenceProperties,
} from '../../../src/validator/ValidatorShared/FindReferencedProperty';

describe('when looking for property on current entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName2: string = 'DomainEntityName2';
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName1): any),
      [domainEntityName2],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should return expected property', () => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    // $FlowIgnore - property could be null
    expect(property.metaEdName).toBe(domainEntityName2);
  });
});

describe('when looking for first domain entity on association', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName2: string = 'DomainEntityName2';
    const AssociationName1: string = 'AssociationName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
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

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.association.get(AssociationName1): any),
      [domainEntityName1],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should return expected property', () => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    // $FlowIgnore - property could be null
    expect(property.metaEdName).toBe(domainEntityName1);
  });
});

describe('when looking for second domain entity on association', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName2: string = 'DomainEntityName2';
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const AssociationName1: string = 'AssociationName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
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

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.association.get(AssociationName1): any),
      [domainEntityName2],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should return expected property', () => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    // $FlowIgnore - property could be null
    expect(property.metaEdName).toBe(domainEntityName2);
  });
});

describe('when looking for non identity property on current entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const integerPropertyName2: string = 'IntegerPropertyName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withIntegerProperty(integerPropertyName2, 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName1): any),
      [integerPropertyName2],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should return undefined', () => {
    expect(property).toBeUndefined();
  });
});

describe('when looking for property that does not exist', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withIntegerProperty('IntegerPropertyName2', 'IntegerPropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName1): any),
      ['IntegerPropertyName3'],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should return undefined', () => {
    expect(property).toBeUndefined();
  });
});

describe('when looking for duplicated property with context', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  const contextName1: string = 'ContextName1';
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName2: string = 'DomainEntityName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
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

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName2): any),
      [`${contextName1}${domainEntityName1}`],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should return expected property', () => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    // $FlowIgnore - property could be null
    expect(property.metaEdName).toBe(domainEntityName1);
    // $FlowIgnore - property could be null
    expect(property.withContext).toBe(contextName1);
  });
});

describe('when looking for deep property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName2: string = 'DomainEntityName2';
    const domainEntityName3: string = 'DomainEntityName3';
    const contextName1: string = 'ContextName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
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

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName3): any),
      [`${contextName1}${domainEntityName2}`, `${contextName1}${domainEntityName1}`],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build three domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(3);
  });

  it('should return expected property', () => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    // $FlowIgnore - property could be null
    expect(property.metaEdName).toBe(domainEntityName1);
  });
});

describe('when looking for non primary key property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName2: string = 'DomainEntityName2';
    const contextName1: string = 'ContextName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
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

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.domainEntity.get(domainEntityName2): any),
      [`${contextName1}${domainEntityName1}`],
      matchAllButFirstAsIdentityProperties(),
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should return expected property', () => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    // $FlowIgnore - property could be null
    expect(property.metaEdName).toBe(domainEntityName1);
  });
});

describe('when looking for property on parent abstract entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName2: string = 'DomainEntityName2';
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntitySubclassName1: string = 'DomainEntitySubclassName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
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

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.domainEntitySubclass.get(domainEntitySubclassName1): any),
      [domainEntityName2],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one domain entity subclass', () => {
    expect(metaEd.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should return expected property', () => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    // $FlowIgnore - property could be null
    expect(property.metaEdName).toBe(domainEntityName2);
  });
});

describe('when looking for property on parent domain entity from subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName2: string = 'DomainEntityName2';
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntitySubclassName1: string = 'DomainEntitySubclassName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
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

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.domainEntitySubclass.get(domainEntitySubclassName1): any),
      [domainEntityName2],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one domain entity subclass', () => {
    expect(metaEd.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should return expected property', () => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    // $FlowIgnore - property could be null
    expect(property.metaEdName).toBe(domainEntityName2);
  });
});

describe('when looking for property on parent domain entity from extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName2: string = 'DomainEntityName2';
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
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

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.domainEntityExtension.get(domainEntityName1): any),
      [domainEntityName2],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should return expected property', () => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    // $FlowIgnore - property could be null
    expect(property.metaEdName).toBe(domainEntityName2);
  });
});

describe('when looking for property on parent association from subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName2: string = 'DomainEntityName2';
    const associationName1: string = 'AssociationName1';
    const associationSubclassName1: string = 'AssociationSubclassName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
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

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.associationSubclass.get(associationSubclassName1): any),
      [domainEntityName1],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build one association subclass', () => {
    expect(metaEd.entity.associationSubclass.size).toBe(1);
  });

  it('should return expected property', () => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    // $FlowIgnore - property could be null
    expect(property.metaEdName).toBe(domainEntityName1);
  });
});

describe('when looking for property on parent association from extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName2: string = 'DomainEntityName2';
    const associationName1: string = 'AssociationName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
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

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.associationExtension.get(associationName1): any),
      [domainEntityName1],
      matchAllIdentityReferenceProperties(),
    );
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should return expected property', () => {
    expect(property).toBeDefined();
    expect(property).not.toBeNull();
    // $FlowIgnore - property could be null
    expect(property.metaEdName).toBe(domainEntityName1);
  });
});

describe('when looking for non identity property on parent domain entity from subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let property: ?EntityProperty;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const domainEntitySubclassName1: string = 'DomainEntitySubclassName1';
    const integerPropertyName2: string = 'IntegerPropertyName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
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

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    property = findReferencedProperty(
      metaEd.entity,
      (metaEd.entity.domainEntitySubclass.get(domainEntitySubclassName1): any),
      [integerPropertyName2],
      matchAllButFirstAsIdentityProperties(),
    );
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity subclass', () => {
    expect(metaEd.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should return undefined', () => {
    expect(property).toBeUndefined();
  });
});
