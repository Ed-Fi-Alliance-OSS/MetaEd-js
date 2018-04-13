// @flow
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  AssociationBuilder,
  AssociationExtensionBuilder,
  CommonBuilder,
  DescriptorBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  EnumerationBuilder,
  InterchangeBuilder,
  NamespaceInfoBuilder,
  SharedIntegerBuilder,
} from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/CrossEntity/MostEntitiesCannotHaveSameName';

describe('when entities have different names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('DomainEntity1')
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartAssociation('Association1')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Prop7', 'doc')
      .withAssociationDomainEntityProperty('Prop8', 'doc')
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity and one association', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when DE and Association have identical names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Prop7', 'doc')
      .withAssociationDomainEntityProperty('Prop8', 'doc')
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity and one association', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);

    expect(failures[0].validatorName).toBe('MostEntitiesCannotHaveSameName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when DE and Association have identical names should have validation failures for each entity -> association message ',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when DE and Association have identical names should have validation failures for each entity -> association sourceMap',
    );

    expect(failures[1].validatorName).toBe('MostEntitiesCannotHaveSameName');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot(
      'when DE and Association have identical names should have validation failures for each entity -> DE message ',
    );
    expect(failures[1].sourceMap).toMatchSnapshot(
      'when DE and Association have identical names should have validation failures for each entity -> DE sourceMap',
    );
  });
});

describe('when DE has same name as DE extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one DE and one DE extension', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when Association has same name as Association extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Prop7', 'doc')
      .withAssociationDomainEntityProperty('Prop8', 'doc')
      .withEndAssociation()

      .withStartAssociationExtension(entityName)
      .withDocumentation('doc')
      .withDateProperty('BeginDate', 'doc', true, false)
      .withDateProperty('EndDate', 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one DE and one DE extension', () => {
    expect(metaEd.entity.association.size).toBe(1);
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when DE and SharedInteger have identical names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartSharedInteger(entityName)
      .withDocumentation('doc')
      .withMinValue('0')
      .withEndSharedInteger()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity and one shared integer', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
    expect(metaEd.entity.sharedInteger.size).toBe(1);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);

    expect(failures[0].validatorName).toBe('MostEntitiesCannotHaveSameName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when DE and SharedInteger have identical names should have validation failures for each entity -> DE message ',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when DE and SharedInteger have identical names should have validation failures for each entity -> DE sourceMap',
    );

    expect(failures[1].validatorName).toBe('MostEntitiesCannotHaveSameName');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot(
      'when DE and SharedInteger have identical names should have validation failures for each entity -> SharedInteger message ',
    );
    expect(failures[1].sourceMap).toMatchSnapshot(
      'when DE and SharedInteger have identical names should have validation failures for each entity -> SharedInteger sourceMap',
    );
  });
});

describe('when DE and Common have identical names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartCommon(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Prop2', 'doc', true, false)
      .withEndCommon()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity and one common', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should have validation failures for each entity', () => {
    expect(failures).toHaveLength(2);

    expect(failures[0].validatorName).toBe('MostEntitiesCannotHaveSameName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when DE and Common have identical names should have validation failures for each entity -> DE message ',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when DE and Common have identical names should have validation failures for each entity -> DE sourceMap',
    );

    expect(failures[1].validatorName).toBe('MostEntitiesCannotHaveSameName');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot(
      'when DE and Common have identical names should have validation failures for each entity -> SharedInteger message ',
    );
    expect(failures[1].sourceMap).toMatchSnapshot(
      'when DE and Common have identical names should have validation failures for each entity -> SharedInteger sourceMap',
    );
  });
});

describe('when DE has same name as descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDescriptor(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one DE and one descriptor', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
    expect(metaEd.entity.descriptor.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when DE has same name as enumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartEnumeration(entityName)
      .withDocumentation('doc')
      .withEnumerationItem('ShortDescription', 'doc')
      .withEndEnumeration()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one DE and one enumeration', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
    expect(metaEd.entity.enumeration.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when DE has same name as interchange', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('Prop1', 'doc', true, false)
      .withEndDomainEntity()

      .withStartInterchange(entityName)
      .withDocumentation('doc')
      .withDomainEntityElement(entityName)
      .withEndInterchange()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new InterchangeBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one DE and one interchange', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
    expect(metaEd.entity.interchange.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});
