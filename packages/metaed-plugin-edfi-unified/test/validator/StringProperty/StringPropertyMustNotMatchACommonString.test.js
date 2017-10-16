// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityBuilder, SharedStringBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/StringProperty/StringPropertyMustNotMatchACommonString';

describe('when validating string property does not match common string', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const maxLength: string = '10';
  const minLength: string = '0';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSharedString('SharedString')
      .withDocumentation('doc')
      .withEndSharedString()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', maxLength, minLength)
      .withStringProperty('StringProperty', 'doc', true, false, maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating string identity matches common string', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const stringProperty: string = 'StringProperty';
  const minLength: string = '0';
  const maxLength: string = '10';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSharedString(stringProperty)
      .withDocumentation('doc')
      .withEndSharedString()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withStringIdentity(stringProperty, 'doc', maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('StringPropertyMustNotMatchACommonString');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating string identity matches common string -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating string identity matches common string -> sourceMap');
  });
});

describe('when validating string property matches common string', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const stringProperty: string = 'StringProperty';
  const minLength: string = '0';
  const maxLength: string = '10';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSharedString(stringProperty)
      .withDocumentation('doc')
      .withEndSharedString()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withStringProperty(stringProperty, 'doc', true, false, maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('StringPropertyMustNotMatchACommonString');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating string property matches common string -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating string property matches common string -> sourceMap');
  });
});
