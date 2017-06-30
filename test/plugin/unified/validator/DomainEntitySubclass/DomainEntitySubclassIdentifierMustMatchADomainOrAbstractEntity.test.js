// @flow
import DomainEntityBuilder from '../../../../../src/core/builder/DomainEntityBuilder';
import DomainEntitySubclassBuilder from '../../../../../src/core/builder/DomainEntitySubclassBuilder';
import MetaEdTextBuilder from '../../../../core/MetaEdTextBuilder';
import { metaEdEnvironmentFactory } from '../../../../../src/core/MetaEdEnvironment';
import type { MetaEdEnvironment } from '../../../../../src/core/MetaEdEnvironment';
import { validate } from '../../../../../src/plugin/unified/validator/DomainEntitySubclass/DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity';
import type { ValidationFailure } from '../../../../../src/core/validator/ValidationFailure';

describe('when domain entity subclass extends domain entity', () => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentFactory();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('Property2', 'PropertyDocumentation', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity subclass', () => {
    expect(metaEd.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity subclass extends abstract entity', () => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentFactory();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity(entityName)
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName1', 'PropertyDocumentation', '100')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('NewSubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName12', 'PropertyDocumentation', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity subclass', () => {
    expect(metaEd.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity subclass has invalid extendee', () => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentFactory();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntitySubclass('EntityName', 'BaseEntityName')
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation3', true, false)
      .withEndDomainEntitySubclass()
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity subclass', () => {
    expect(metaEd.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when domain entity subclass has invalid extendee should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when domain entity subclass has invalid extendee should have validation failure -> sourceMap');
  });
});

