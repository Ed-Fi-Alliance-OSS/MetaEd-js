// @flow
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { DecimalTypeBuilder } from '../../src/builder/DecimalTypeBuilder';
import { MetaEdTextBuilder } from '../MetaEdTextBuilder';
import { getDecimalType } from '../TestHelper';
import type { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building shared decimal in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedDecimal(entityName, metaEdId)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new DecimalTypeBuilder(metaEd, validationFailures));
  });

  it('should build one decimal type', () => {
    expect(metaEd.entity.decimalType.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have type', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).type).toBe('decimalType');
  });

  it('should have type humanized name', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).typeHumanizedName).toBe('Decimal Type');
  });

  it('should have metaed id', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have total digits', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).totalDigits).toBe(totalDigits);
  });

  it('should have decimal places', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).decimalPlaces).toBe(decimalPlaces);
  });

  it('should have minValue', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).maxValue).toBe(maxValue);
  });

  it('should have data', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should not be a generated type', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).generatedSimpleType).toBe(false);
  });
});

describe('when building domain entity with decimal property in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withDecimalProperty(entityName, documentation, true, false, totalDigits, decimalPlaces, minValue, maxValue, null, metaEdId)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DecimalTypeBuilder(metaEd, validationFailures));
  });

  it('should build one decimal type', () => {
    expect(metaEd.entity.decimalType.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have type', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).type).toBe('decimalType');
  });

  it('should have type humanized name', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).typeHumanizedName).toBe('Decimal Type');
  });

  it('should have metaed id', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have total digits', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).totalDigits).toBe(totalDigits);
  });

  it('should have decimal places', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).decimalPlaces).toBe(decimalPlaces);
  });

  it('should have minValue', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).maxValue).toBe(maxValue);
  });

  it('should have data', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should be a generated type', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId).generatedSimpleType).toBe(true);
  });
});

describe('when building multiple shared decimals in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const entityName2: string = 'EntityName2';
  const metaEdId2: string = '1234';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  const expectedRepositoryId2 = `${projectExtension}-${entityName2}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedDecimal(entityName, metaEdId)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()

      .withStartSharedDecimal(entityName2, metaEdId2)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new DecimalTypeBuilder(metaEd, validationFailures));
  });

  it('should build two decimal types', () => {
    expect(metaEd.entity.decimalType.size).toBe(2);
  });

  it('should be found in entity repository', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId)).toBeDefined();
    expect(metaEd.entity.decimalType.get(expectedRepositoryId2)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building domain entity with multiple decimal properties in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const entityName2: string = 'EntityName2';
  const metaEdId2: string = '1234';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  const expectedRepositoryId2 = `${projectExtension}-${entityName2}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withDecimalProperty(entityName, documentation, true, false, totalDigits, decimalPlaces, minValue, maxValue, null, metaEdId)
      .withDecimalProperty(entityName2, documentation, true, false, totalDigits, decimalPlaces, minValue, maxValue, null, metaEdId2)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DecimalTypeBuilder(metaEd, validationFailures));
  });

  it('should build two decimal types', () => {
    expect(metaEd.entity.decimalType.size).toBe(2);
  });

  it('should be found in entity repository', () => {
    expect(getDecimalType(metaEd.entity, expectedRepositoryId)).toBeDefined();
    expect(metaEd.entity.decimalType.get(expectedRepositoryId2)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });
});
