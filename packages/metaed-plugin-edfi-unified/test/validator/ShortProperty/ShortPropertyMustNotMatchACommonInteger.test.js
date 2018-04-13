// @flow
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  SharedIntegerBuilder,
  NamespaceInfoBuilder,
} from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/ShortProperty/ShortPropertyMustNotMatchACommonInteger';

describe('when validating short property does not match common integer', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const maxValue: string = '10';
  const minValue: string = '0';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSharedInteger('SharedInteger')
      .withDocumentation('doc')
      .withEndSharedInteger()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withShortIdentity('ShortIdentity', 'doc', maxValue, minValue)
      .withShortProperty('ShortProperty', 'doc', true, false, maxValue, minValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating string identity matches common integer', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const integerProperty: string = 'IntegerProperty';
  const minValue: string = '0';
  const maxValue: string = '10';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSharedInteger(integerProperty)
      .withDocumentation('doc')
      .withEndSharedInteger()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withShortIdentity(integerProperty, 'doc', maxValue, minValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('ShortPropertyMustNotMatchACommonInteger');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating string identity matches common integer -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating string identity matches common integer -> sourceMap');
  });
});

describe('when validating short property matches common integer', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const integerProperty: string = 'IntegerProperty';
  const minValue: string = '0';
  const maxValue: string = '10';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('namespace', 'ProjectExtension')
      .withStartSharedInteger(integerProperty)
      .withDocumentation('doc')
      .withEndSharedInteger()

      .withStartAbstractEntity(entityName, '1')
      .withDocumentation('doc')
      .withShortProperty(integerProperty, 'doc', true, false, maxValue, minValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('ShortPropertyMustNotMatchACommonInteger');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating short property matches common integer -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating short property matches common integer -> sourceMap');
  });
});
