// @flow
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  AssociationBuilder,
  AssociationExtensionBuilder,
  CommonBuilder,
  CommonExtensionBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
} from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/CommonProperty/CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality';

describe('when validating common property does not have extension override', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon('EntityName1')
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartDomainEntity('EntityName2')
      .withDocumentation('EntityDocumentation')
      .withCommonIdentity('PropertyName2', 'PropertyDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating common property has extension override on non domain entity or association extensions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName1';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartDomainEntity('EntityName2')
      .withDocumentation('EntityDocumentation')
      .withCommonExtensionOverrideProperty(entityName, 'PropertyDocumentation', true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures[0].validatorName).toBe('CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating common property has extension override on non domain entity or association extensions should have validation failures -> message ');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating common property has extension override on non domain entity or association extensions should have validation failures -> sourceMap');
  });
});

describe('when validating common property has extension override on domain entity extension without include on extendee', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName1: string = 'EntityName1';
  const entityName2: string = 'EntityName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(entityName1)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartDomainEntity(entityName2)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName2', 'PropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName2)
      .withCommonExtensionOverrideProperty(entityName1, 'PropertyDocumentation', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures[0].validatorName).toBe('CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating common property has extension override on domain entity extension without include on extendee should have validation failures -> message ');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating common property has extension override on domain entity extension without include on extendee should have validation failures -> sourceMap');
  });
});

describe('when validating common property has extension override on association extension without include on extendee', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName1: string = 'EntityName1';
  const entityName2: string = 'EntityName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(entityName1)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartAssociation(entityName2)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName3', 'PropertyDocumentation')
      .withBooleanProperty('PropertyName4', 'PropertyDocumentation', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')
      .withStartAssociationExtension(entityName2)
      .withCommonExtensionOverrideProperty(entityName1, 'PropertyDocumentation', true, true)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures[0].validatorName).toBe('CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating common property has extension override on association extension without include on extendee should have validation failures -> message ');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating common property has extension override on association extension without include on extendee should have validation failures -> sourceMap');
  });
});

describe('when validating common property has extension override on domain entity extension with include on extendee and matching cardinality', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName1: string = 'EntityName1';
  const entityName2: string = 'EntityName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(entityName1)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartDomainEntity(entityName2)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName2', 'PropertyDocumentation', true, false)
      .withCommonProperty(entityName1, 'doc', true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName2)
      .withCommonExtensionOverrideProperty(entityName1, 'PropertyDocumentation', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating common property has extension override on association extension with include on extendee and matching cardinality', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName1: string = 'EntityName1';
  const entityName2: string = 'EntityName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(entityName1)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartAssociation(entityName2)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName3', 'PropertyDocumentation')
      .withBooleanProperty('PropertyName4', 'PropertyDocumentation', true, false)
      .withCommonProperty(entityName1, 'doc', true, true)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')
      .withStartAssociationExtension(entityName2)
      .withCommonExtensionOverrideProperty(entityName1, 'PropertyDocumentation', true, true)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating common property has extension override on domain entity extension with include on extendee not matching collection cardinality', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName1: string = 'EntityName1';
  const entityName2: string = 'EntityName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(entityName1)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartDomainEntity(entityName2)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName2', 'PropertyDocumentation', true, false)
      .withCommonProperty(entityName1, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName2)
      .withCommonExtensionOverrideProperty(entityName1, 'PropertyDocumentation', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures[0].validatorName).toBe('CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating common property has extension override on domain entity extension with include on extendee not matching collection cardinality should have validation failures -> message ');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating common property has extension override on domain entity extension with include on extendee not matching collection cardinality should have validation failures -> sourceMap');
  });
});

describe('when validating common property has extension override on association extension with include on extendee not matching collection cardinality', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName1: string = 'EntityName1';
  const entityName2: string = 'EntityName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(entityName1)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartAssociation(entityName2)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName3', 'PropertyDocumentation')
      .withBooleanProperty('PropertyName4', 'PropertyDocumentation', true, false)
      .withCommonProperty(entityName1, 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')
      .withStartAssociationExtension(entityName2)
      .withCommonExtensionOverrideProperty(entityName1, 'PropertyDocumentation', true, true)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures[0].validatorName).toBe('CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating common property has extension override on association extension with include on extendee not matching collection cardinality should have validation failures -> message ');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating common property has extension override on association extension with include on extendee not matching collection cardinality should have validation failures -> sourceMap');
  });
});

describe('when validating common property has extension override on domain entity extension with include on extendee not matching nullablility', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName1: string = 'EntityName1';
  const entityName2: string = 'EntityName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(entityName1)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartDomainEntity(entityName2)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName2', 'PropertyDocumentation', true, false)
      .withCommonProperty(entityName1, 'doc', false, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName2)
      .withCommonExtensionOverrideProperty(entityName1, 'PropertyDocumentation', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures[0].validatorName).toBe('CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating common property has extension override on domain entity extension with include on extendee not matching nullablility should have validation failures -> message ');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating common property has extension override on domain entity extension with include on extendee not matching nullablility should have validation failures -> sourceMap');
  });
});

describe('when validating common property has extension override on association extension with include on extendee not matching nullablility', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName1: string = 'EntityName1';
  const entityName2: string = 'EntityName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon(entityName1)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartAssociation(entityName2)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName3', 'PropertyDocumentation')
      .withBooleanProperty('PropertyName4', 'PropertyDocumentation', true, false)
      .withCommonProperty(entityName1, 'doc', false, true)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('extension', 'EXTENSION')
      .withStartAssociationExtension(entityName2)
      .withCommonExtensionOverrideProperty(entityName1, 'PropertyDocumentation', true, true)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures[0].validatorName).toBe('CommonPropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating common property has extension override on association extension with include on extendee not matching nullablility should have validation failures -> message ');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating common property has extension override on association extension with include on extendee not matching nullablility should have validation failures -> sourceMap');
  });
});
