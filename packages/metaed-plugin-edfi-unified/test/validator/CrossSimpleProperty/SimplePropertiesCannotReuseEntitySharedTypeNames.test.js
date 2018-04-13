// @flow
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  NamespaceInfoBuilder,
  SharedDecimalBuilder,
  SharedIntegerBuilder,
} from 'metaed-core';
import type { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/CrossSimpleProperty/SimplePropertiesCannotReuseEntitySharedTypeNames';

describe('when building shared integer with duplicate integer property in extension namespace', () => {
  let validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withIntegerProperty(entityName, documentation, true, false, maxValue, minValue, null, metaEdId)
      .withEndDomainEntity()

      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []));
    validationFailures = validate(metaEd);
  });

  it('should build one shared integer', () => {
    expect(metaEd.propertyIndex.integer.length).toBe(1);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('SimplePropertiesCannotReuseEntityShanedTypeNames');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('SimplePropertiesCannotReuseEntityShanedTypeNames');
    expect(validationFailures[1].category).toBe('error');
  });
});
describe('when building shared decimal with duplicate decimal property in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withDecimalProperty(
        entityName,
        documentation,
        true,
        false,
        totalDigits,
        decimalPlaces,
        minValue,
        maxValue,
        null,
        metaEdId,
      )
      .withEndDomainEntity()

      .withStartSharedDecimal(entityName, metaEdId)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()

      .withEndNamespace()

      .sendToListener(new NamespaceInfoBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new SharedDecimalBuilder(metaEd, []));
    validationFailures = validate(metaEd);
  });

  it('should build one shared decimal', () => {
    expect(metaEd.propertyIndex.decimal.length).toBe(1);
  });

  it('should have validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('SimplePropertiesCannotReuseEntityShanedTypeNames');
    expect(validationFailures[0].category).toBe('error');

    expect(validationFailures[1].validatorName).toBe('SimplePropertiesCannotReuseEntityShanedTypeNames');
    expect(validationFailures[1].category).toBe('error');
  });
});
