// @flow
import DomainEntityBuilder from '../../../../../packages/metaed-core/src/builder/DomainEntityBuilder';
import MetaEdTextBuilder from '../../../../../packages/metaed-core/test/MetaEdTextBuilder';
import { metaEdEnvironmentFactory } from '../../../../../packages/metaed-core/src/MetaEdEnvironment';
import type { MetaEdEnvironment } from '../../../../../packages/metaed-core/src/MetaEdEnvironment';
import { validate } from '../../../src/validator/DecimalProperty/DecimalPropertyMustNotMatchACommonString';
import type { ValidationFailure } from '../../../../../packages/metaed-core/src/validator/ValidationFailure';
import SharedStringBuilder from '../../../../../packages/metaed-core/src/builder/SharedStringBuilder';

describe('when validating decimal property does not match common string', () => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentFactory();
  const entityName: string = 'EntityName';
  const decimalProperty: string = 'DecimalProperty';
  const totalDigits: string = '10';
  const decimalPlaces: string = '2';
  const minValue: string = '0';
  const maxValue: string = '10';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSharedString('SharedString')
      .withDocumentation('doc')
      .withEndSharedString()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withDecimalIdentity(decimalProperty, 'doc', totalDigits, decimalPlaces, minValue, maxValue)
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

describe('when validating decimal property matches common string', () => {
  const metaEd: MetaEdEnvironment = metaEdEnvironmentFactory();
  const entityName: string = 'EntityName';
  const decimalProperty: string = 'DecimalProperty';
  const totalDigits: string = '10';
  const decimalPlaces: string = '2';
  const minValue: string = '0';
  const maxValue: string = '10';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSharedString(decimalProperty)
      .withDocumentation('doc')
      .withEndSharedString()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withDecimalIdentity(decimalProperty, 'doc', totalDigits, decimalPlaces, minValue, maxValue)
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
    expect(failures[0].validatorName).toBe('DecimalPropertyMustNotMatchACommonString');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating decimal property matches common string -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating decimal property matches common string -> sourceMap');
  });
});
