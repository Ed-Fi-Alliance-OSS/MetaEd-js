// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, SharedDecimalBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/SharedSimple/SharedDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits';

describe('when validating shared decimal with total digits greater than decimal places', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedDecimal('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating shared decimal with same decimal places and total digits', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedDecimal('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withTotalDigits('10')
      .withDecimalPlaces('10')
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating shared decimal with decimal places greater than total digits', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedDecimal('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withTotalDigits('10')
      .withDecimalPlaces('11')
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared decimal', () => {
    expect(metaEd.entity.sharedDecimal.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SharedDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating shared decimal property with decimal places greater than total digits -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating shared decimal property with decimal places greater than total digits -> sourceMap');
  });
});
