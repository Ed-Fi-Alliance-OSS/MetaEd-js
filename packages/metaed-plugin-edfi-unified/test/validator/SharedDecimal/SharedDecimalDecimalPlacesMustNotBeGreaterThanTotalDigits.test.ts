import { newMetaEdEnvironment, MetaEdTextBuilder, SharedDecimalBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/SharedDecimal/SharedDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits';

describe('when validating shared decimal with total digits greater than decimal places', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedDecimal('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
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

describe('when validating shared decimal with same decimal places and total digits', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedDecimal('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withTotalDigits('10')
      .withDecimalPlaces('10')
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

describe('when validating shared decimal with decimal places greater than total digits', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedDecimal('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withTotalDigits('10')
      .withDecimalPlaces('11')
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
    expect(failures[0].validatorName).toBe('SharedDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
