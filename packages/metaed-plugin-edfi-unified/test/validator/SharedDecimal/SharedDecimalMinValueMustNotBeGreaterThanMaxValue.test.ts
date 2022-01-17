import { newMetaEdEnvironment, MetaEdTextBuilder, SharedDecimalBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/SharedDecimal/SharedDecimalMinValueMustNotBeGreaterThanMaxValue';

describe('when validating shared decimal with max value greater than min value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedDecimal('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withMinValue('10')
      .withMaxValue('100')
      .withEndSharedDecimal()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating shared decimal with min value greater than max value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedDecimal('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withMinValue('100')
      .withMaxValue('10')
      .withEndSharedDecimal()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one shared decimal', (): void => {
    expect(coreNamespace.entity.sharedDecimal.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SharedDecimalMinValueMustNotBeGreaterThanMaxValue');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
