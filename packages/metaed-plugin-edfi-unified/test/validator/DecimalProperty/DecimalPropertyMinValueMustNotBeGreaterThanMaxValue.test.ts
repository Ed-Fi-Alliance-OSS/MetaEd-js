import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/DecimalProperty/DecimalPropertyMinValueMustNotBeGreaterThanMaxValue';

describe('when validating decimal property with correct minimum value and maximum value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const totalDigits = '10';
  const decimalPlaces = '2';
  const minValue = '0';
  const maxValue = '10';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi', 'ProjectExtension')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withDecimalIdentity('DecimalIdentity', 'doc', totalDigits, decimalPlaces, minValue, maxValue)
      .withDecimalProperty('DecimalProperty', 'doc', true, false, totalDigits, decimalPlaces, minValue, maxValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));
    coreNamespace = metaEd.namespace.get('EdFi');

    failures = validate(metaEd);
  });

  it('should build one abstract entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build two properties', (): void => {
    expect(metaEd.propertyIndex.decimal.length).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating decimal property with same minimum value and maximum value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const totalDigits = '10';
  const decimalPlaces = '2';
  const minValue = '5';
  const maxValue = '5';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi', 'ProjectExtension')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withDecimalIdentity('DecimalIdentity', 'doc', totalDigits, decimalPlaces, minValue, maxValue)
      .withDecimalProperty('DecimalProperty', 'doc', true, false, totalDigits, decimalPlaces, minValue, maxValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one abstract entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build two properties', (): void => {
    expect(metaEd.propertyIndex.decimal.length).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating decimal property with minimum value greater than maximum value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const totalDigits = '10';
  const decimalPlaces = '2';
  const minValue = '10';
  const maxValue = '0';

  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi', 'ProjectExtension')
      .withStartAbstractEntity(entityName)
      .withDocumentation('doc')
      .withDecimalIdentity('DecimalIdentity', 'doc', totalDigits, decimalPlaces, minValue, maxValue)
      .withDecimalProperty('DecimalProperty', 'doc', true, false, totalDigits, decimalPlaces, minValue, maxValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one abstract entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build two properties', (): void => {
    expect(metaEd.propertyIndex.decimal.length).toBe(2);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('DecimalPropertyMinValueMustNotBeGreaterThanMaxValue');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
    expect(failures[1].validatorName).toBe('DecimalPropertyMinValueMustNotBeGreaterThanMaxValue');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});
