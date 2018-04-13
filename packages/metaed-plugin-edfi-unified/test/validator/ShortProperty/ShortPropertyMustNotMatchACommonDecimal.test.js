// @flow
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  SharedDecimalBuilder,
  NamespaceInfoBuilder,
} from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/ShortProperty/ShortPropertyMustNotMatchACommonDecimal';

describe('when validating short property does not match common decimal', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const maxValue: string = '10';
  const minValue: string = '2';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi', 'ProjectExtension')
      .withStartSharedDecimal('EntityName1')
      .withDocumentation('EntityDocumentation')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withEndSharedDecimal()

      .withStartAbstractEntity('EntityName2')
      .withDocumentation('EntityDocumentation')
      .withShortIdentity('ShortIdentity', 'doc', maxValue, minValue)
      .withShortProperty('ShortProperty', 'doc', true, false, maxValue, minValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared decimal', () => {
    expect(metaEd.entity.sharedDecimal.size).toBe(1);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating short identity matches common decimal', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const maxValue: string = '10';
  const minValue: string = '2';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi', 'ProjectExtension')
      .withStartSharedDecimal(entityName)
      .withDocumentation('EntityDocumentation')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withEndSharedDecimal()

      .withStartAbstractEntity('EntityName')
      .withDocumentation('EntityDocumentation')
      .withShortIdentity(entityName, 'doc', maxValue, minValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared decimal', () => {
    expect(metaEd.entity.sharedDecimal.size).toBe(1);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('ShortPropertyMustNotMatchACommonDecimal');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating short identity matches common decimal -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating short identity matches common decimal -> sourceMap');
  });
});

describe('when validating short property matches common decimal', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const maxValue: string = '10';
  const minValue: string = '2';

  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi', 'ProjectExtension')
      .withStartSharedDecimal(entityName)
      .withDocumentation('EntityDocumentation')
      .withTotalDigits('10')
      .withDecimalPlaces('2')
      .withEndSharedDecimal()

      .withStartAbstractEntity('EntityName')
      .withDocumentation('EntityDocumentation')
      .withShortProperty(entityName, 'doc', true, false, maxValue, minValue)
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one shared decimal', () => {
    expect(metaEd.entity.sharedDecimal.size).toBe(1);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have one validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('ShortPropertyMustNotMatchACommonDecimal');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating short property matches common decimal -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating short property matches common decimal -> sourceMap');
  });
});
