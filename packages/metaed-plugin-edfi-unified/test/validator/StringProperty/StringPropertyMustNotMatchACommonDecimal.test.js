// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityBuilder, SharedDecimalBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/StringProperty/StringPropertyMustNotMatchACommonDecimal';

describe('when validating string property does not match common decimal', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const maxLength: string = '10';
  const minLength: string = '0';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSharedDecimal('SharedDecimal')
      .withDocumentation('doc')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withEndSharedDecimal()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', maxLength, minLength)
      .withStringProperty('StringProperty', 'doc', true, false, maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating string identity matches common decimal', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const decimalProperty: string = 'DecimalProperty';
  const minLength: string = '0';
  const maxLength: string = '10';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSharedDecimal(decimalProperty)
      .withDocumentation('doc')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withEndSharedDecimal()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withStringIdentity(decimalProperty, 'doc', maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('StringPropertyMustNotMatchACommonDecimal');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating string identity matches common decimal -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating string identity matches common decimal -> sourceMap');
  });
});

describe('when validating string property matches common decimal', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const decimalProperty: string = 'DecimalProperty';
  const minLength: string = '0';
  const maxLength: string = '10';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSharedDecimal(decimalProperty)
      .withDocumentation('doc')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withEndSharedDecimal()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withStringProperty(decimalProperty, 'doc', true, false, maxLength, minLength)
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('StringPropertyMustNotMatchACommonDecimal');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating string property matches common decimal -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating string property matches common decimal -> sourceMap');
  });
});
