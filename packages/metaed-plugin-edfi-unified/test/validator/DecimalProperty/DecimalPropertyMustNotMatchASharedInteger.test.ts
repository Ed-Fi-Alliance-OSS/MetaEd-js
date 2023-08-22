import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  SharedIntegerBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/DecimalProperty/DecimalPropertyMustNotMatchASharedInteger';

describe('when validating decimal property does not match shared integer', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const decimalProperty = 'DecimalProperty';
  const totalDigits = '10';
  const decimalPlaces = '2';
  const minValue = '0';
  const maxValue = '10';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedInteger('SharedInteger')
      .withDocumentation('doc')
      .withEndSharedInteger()

      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withDecimalIdentity(decimalProperty, 'doc', totalDigits, decimalPlaces, minValue, maxValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one abstract entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating decimal property matches shared integer', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const decimalProperty = 'DecimalProperty';
  const totalDigits = '10';
  const decimalPlaces = '2';
  const minValue = '0';
  const maxValue = '10';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedInteger(decimalProperty)
      .withDocumentation('doc')
      .withEndSharedInteger()

      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withDecimalIdentity(decimalProperty, 'doc', totalDigits, decimalPlaces, minValue, maxValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one abstract entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DecimalPropertyMustNotMatchASharedInteger');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating decimal property matches shared integer -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating decimal property matches shared integer -> sourceMap');
  });
});
