// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, SharedStringBuilder, NamespaceInfoBuilder } from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/SharedSimple/SharedStringMinLengthMustNotBeGreaterThanMaxLength';

describe('when validating shared string with max length greater than min length', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedString('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withMinLength('10')
      .withMaxLength('100')
      .withEndSharedString()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared string', () => {
    expect(metaEd.entity.sharedString.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating shared string with min length greater than max length', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartSharedString('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withMinLength('100')
      .withMaxLength('10')
      .withEndSharedString()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared string', () => {
    expect(metaEd.entity.sharedString.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SharedStringMinLengthMustNotBeGreaterThanMaxLength');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating shared string with min value greater than max value -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating shared string with min value greater than max value -> sourceMap',
    );
  });
});
