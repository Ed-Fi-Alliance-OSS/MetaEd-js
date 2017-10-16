// @flow
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  AssociationBuilder,
  AssociationExtensionBuilder,
  AssociationSubclassBuilder,
} from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/MergePartOfReference/TargetPropertyPathMustExist';
import { CommonBuilder } from '../../../../metaed-core/src/builder/CommonBuilder';

describe('when validating domain entity has target property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const propertyName = 'Property1';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName1, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName1}.${propertyName}`, `${propertyName}`)
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
  const domainEntityName = 'Entity1';
  const propertyName = 'Property1';
  const targetEntityName = 'DomainEntity2';
  const targetPropertyName = 'Property2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(targetEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(targetPropertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName}.${propertyName}`, `EntityNotValid.${targetPropertyName}`)
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
    expect(failures[0].validatorName).toBe('TargetPropertyPathMustExist');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating domain entity has merge property and entity is wrong -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating domain entity has merge property and entity is wrong -> sourceMap');
  });
});

describe('when validating domain entity has merge property and property is wrong', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'GoodEntity1';
  const propertyName = 'Property1';
  const targetEntityName = 'GoodEntity2';
  const targetPropertyName = 'Property2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(targetEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(targetPropertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName}.${propertyName}`, `${targetEntityName}.NotThere`)
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
    expect(failures[0].validatorName).toBe('TargetPropertyPathMustExist');
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
  const targetEntityName = 'TargetEntity3';
  const targetPropertyName = 'Property2';
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

      .withStartDomainEntity(targetEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(targetPropertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
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

describe('when validating domain entity subclass has merge property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'EntityWithSub1';
  const propertyName = 'Property1';
  const targetEntityName = 'EntityWithSub2';
  const targetPropertyName = 'Property2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityProperty', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(targetEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityProperty2', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass('Entity3', targetEntityName)
      .withDocumentation('Documentation')
      .withIntegerProperty(targetPropertyName, 'Documentation', true, false)
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName}.${propertyName}`, `${targetPropertyName}`)
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
  const targetAssociationName = 'Association';
  const targetPropertyName = 'Property4';
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

      .withStartAssociation(targetAssociationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty('Entity2', 'Documentation')
      .withAssociationDomainEntityProperty('Entity3', 'Documentation')
      .withIntegerIdentity(targetPropertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName}.${propertyName}`, `${targetAssociationName}.${targetPropertyName}`)
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
  const targetAssociationName = 'Association';
  const targetPropertyName = 'Property4';
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

      .withStartAssociation(targetAssociationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty('Entity2', 'Documentation')
      .withAssociationDomainEntityProperty('Entity3', 'Documentation')
      .withIntegerIdentity(targetPropertyName, 'Documentation')

      .withStartAssociationExtension(targetAssociationName)
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName}.${propertyName}`, `${targetAssociationName}.${targetPropertyName}`)
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
  const targetAssociationName = 'Association';
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

      .withStartAssociation(targetAssociationName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty('Entity2', 'Documentation')
      .withAssociationDomainEntityProperty('Entity3', 'Documentation')
      .withIntegerIdentity('Property4', 'Documentation')

      .withStartAssociationSubclass('Entity5', targetAssociationName)
      .withDocumentation('Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergePartOfReference(`Entity2.${propertyName}`, `${domainEntityName}.${propertyName}`)
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
  const targetEntityName = 'AbstractEntity2';
  const targetPropertyName = 'Property2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartAbstractEntity(targetEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(targetPropertyName, 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergePartOfReference(`${domainEntityName}.${propertyName}`, `${targetPropertyName}`)
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
