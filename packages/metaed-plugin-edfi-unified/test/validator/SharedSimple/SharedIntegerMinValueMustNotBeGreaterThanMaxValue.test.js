// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, SharedIntegerBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/SharedSimple/SharedIntegerMinValueMustNotBeGreaterThanMaxValue';

describe('when validating shared integer with max value greater than min value', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedInteger('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withMinValue('10')
      .withMaxValue('100')
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating shared integer with min value greater than max value', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedInteger('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withMinValue('100')
      .withMaxValue('10')
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared integer', () => {
    expect(metaEd.entity.sharedInteger.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SharedIntegerMinValueMustNotBeGreaterThanMaxValue');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating shared integer with min value greater than max value -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating shared integer with min value greater than max value -> sourceMap');
  });
});

describe('when validating shared short with max value greater than min value', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedShort('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withMinValue('10')
      .withMaxValue('100')
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating shared short with min value greater than max value', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedShort('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withMinValue('100')
      .withMaxValue('10')
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared integer', () => {
    expect(metaEd.entity.sharedInteger.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SharedIntegerMinValueMustNotBeGreaterThanMaxValue');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating shared short with min value greater than max value -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating shared short with min value greater than max value -> sourceMap');
  });
});
