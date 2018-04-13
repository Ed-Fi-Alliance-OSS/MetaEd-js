// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityBuilder, NamespaceInfoBuilder } from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/ShortProperty/ShortPropertyMinValueMustNotBeGreaterThanMaxValue';

describe('when validating short property with correct minimum value and maximum value', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const maxValue: string = '10';
  const minValue: string = '2';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi', 'ProjectExtension')
      .withStartAbstractEntity('EntityName', '1')
      .withDocumentation('EntityDocumentation')
      .withShortIdentity('ShortIdentity', 'doc', maxValue, minValue)
      .withShortProperty('ShortProperty', 'doc', true, false, maxValue, minValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating short property with same minimum value and maximum value', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const maxValue: string = '5';
  const minValue: string = '5';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi', 'ProjectExtension')
      .withStartAbstractEntity('EntityName', '1')
      .withDocumentation('EntityDocumentation')
      .withShortIdentity('ShortIdentity', 'doc', maxValue, minValue)
      .withShortProperty('ShortProperty', 'doc', true, false, maxValue, minValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating short property with minimum value greater than maximum value', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const maxValue: string = '2';
  const minValue: string = '10';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi', 'ProjectExtension')
      .withStartAbstractEntity('EntityName', '1')
      .withDocumentation('EntityDocumentation')
      .withShortIdentity('ShortIdentity', 'doc', maxValue, minValue)
      .withShortProperty('ShortProperty', 'doc', true, false, maxValue, minValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('ShortPropertyMinValueMustNotBeGreaterThanMaxValue');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating short identity with minimum value greater than maximum value -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating short identity with minimum value greater than maximum value -> sourceMap',
    );
    expect(failures[1].validatorName).toBe('ShortPropertyMinValueMustNotBeGreaterThanMaxValue');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot(
      'when validating short property with minimum value greater than maximum value -> message',
    );
    expect(failures[1].sourceMap).toMatchSnapshot(
      'when validating short property with minimum value greater than maximum value -> sourceMap',
    );
  });
});
