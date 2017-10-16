// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityBuilder, DomainEntityExtensionBuilder, DomainEntitySubclassBuilder,
  AssociationBuilder, AssociationExtensionBuilder, AssociationSubclassBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/MergePartOfReference/MergePropertyPathMustExist';
import { CommonBuilder } from '../../../../metaed-core/src/builder/CommonBuilder';

describe('when validating domain entity has merge property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const propertyName1 = 'PropertyName1';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName1, 'Documentation')
      .withDomainEntityProperty(domainEntityName1, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName1}.${propertyName1}`, `${domainEntityName2}.${propertyName1}`)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    failures = validate(metaEd);
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity has merge property and entity is wrong', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const propertyName1 = 'PropertyName1';
  const propertyName2 = 'PropertyName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(propertyName1, 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName2, 'IntegerIdentityDocumentation')
      .withAssociationProperty(domainEntityName1, 'AssociationPropertyDocumentation', false, false)
      .withMergePartOfReference(`UnknowEntity.${propertyName1}`, propertyName2)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    failures = validate(metaEd);
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MergePropertyPathMustExist');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating domain entity has merge property and entity is wrong -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating domain entity has merge property and entity is wrong -> sourceMap');
  });
});

describe('when validating domain entity has merge property and property is wrong', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const propertyName1 = 'PropertyName1';
  const propertyName2 = 'PropertyName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(propertyName1, 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName2, 'IntegerIdentityDocumentation')
      .withAssociationProperty(domainEntityName1, 'AssociationPropertyDocumentation', false, false)
      .withMergePartOfReference(`${domainEntityName1}.UnknownProperty`, propertyName2)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    failures = validate(metaEd);
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MergePropertyPathMustExist');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating domain entity has merge property and property is wrong -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating domain entity has merge property and property is wrong -> sourceMap');
  });
});

describe('when validating domain entity has merge property on common type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'Entity1';
  const secondEntityName = 'SecondEntity2';
  const propertyName = 'Property1';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartCommon(secondEntityName)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName, 'Documentation')
      .withEndCommon()

      .withStartDomainEntity('Entity3')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withAssociationProperty(domainEntityName, 'Documentation', false, false)
      .withCommonProperty(secondEntityName, 'Documentation', false, false)
      .withMergePartOfReference(`${secondEntityName}.${domainEntityName}`, domainEntityName)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new CommonBuilder(metaEd, failures));

    failures = validate(metaEd);
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity extension has merge property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'EntityWithExt1';
  const propertyName = 'Property1';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntityExtension('Entity2')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName}.${propertyName}`, 'Entity2.Property2')
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, failures));

    failures = validate(metaEd);
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity subclass has merge property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityName3 = 'DomainEntityName3';
  const propertyName = 'Property1';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntityName3, domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerProperty(propertyName, 'Documentation', true, false)
      .withDomainEntityProperty(domainEntityName2, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName2}.${propertyName}`, `${domainEntityName3}.${propertyName}`)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, failures));

    failures = validate(metaEd);
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating association has merge property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'EntityWithAssoc1';
  const propertyName = 'Property1';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity3')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property3', 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation('Entity4')
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty('Entity2', 'Documentation')
      .withAssociationDomainEntityProperty('Entity3', 'Documentation')
      .withIntegerIdentity('Property4', 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName}.${propertyName}`, 'Entity4.Property4')
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new AssociationBuilder(metaEd, failures));

    failures = validate(metaEd);
  });

  it('should build three domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating association extension has merge property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'EntityWithAssocExt1';
  const propertyName = 'Property1';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity3')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property3', 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation('Entity4')
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty('Entity2', 'Documentation')
      .withAssociationDomainEntityProperty('Entity3', 'Documentation')
      .withIntegerIdentity('Property4', 'Documentation')

      .withStartAssociationExtension('Entity4')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName}.${propertyName}`, 'Entity4.Property4')
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new AssociationBuilder(metaEd, failures))
      .sendToListener(new AssociationExtensionBuilder(metaEd, failures));

    failures = validate(metaEd);
  });

  it('should build three domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating association subclass has merge property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'EntityWithAssocSub1';
  const propertyName = 'Property1';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity3')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property3', 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation('Entity4')
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty('Entity2', 'Documentation')
      .withAssociationDomainEntityProperty('Entity3', 'Documentation')
      .withIntegerIdentity('Property4', 'Documentation')

      .withStartAssociationSubclass('Entity5', 'Entity4')
      .withDocumentation('Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName}.${propertyName}`, 'Entity4.Property4')
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new AssociationBuilder(metaEd, failures))
      .sendToListener(new AssociationSubclassBuilder(metaEd, failures));

    failures = validate(metaEd);
  });

  it('should build three domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating abstract entity has merge property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'AbstractEntity1';
  const propertyName = 'Property1';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartAbstractEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName}.${propertyName}`, 'Entity2.Property2')
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    failures = validate(metaEd);
  });

  it('should build two domain entities', () => {
    expect(metaEd.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});
