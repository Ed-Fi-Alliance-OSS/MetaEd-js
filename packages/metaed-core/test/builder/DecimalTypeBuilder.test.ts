import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { DecimalTypeBuilder } from '../../src/builder/DecimalTypeBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { getDecimalType } from '../TestHelper';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building shared decimal in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DecimalTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one decimal type', (): void => {
    expect(namespace.entity.decimalType.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have type', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).type).toBe('decimalType');
  });

  it('should have type humanized name', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).typeHumanizedName).toBe('Decimal Type');
  });

  it('should have documentation', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should not be deprecated', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).isDeprecated).toBe(false);
  });

  it('should have total digits', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).totalDigits).toBe(totalDigits);
  });

  it('should have decimal places', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).decimalPlaces).toBe(decimalPlaces);
  });

  it('should have minValue', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).maxValue).toBe(maxValue);
  });

  it('should have data', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should not be a generated type', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).generatedSimpleType).toBe(false);
  });
});

describe('when building deprecated shared decimal', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  let namespace: any = null;
  const expectedRepositoryId = `${projectExtension}-${entityName}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDeprecated(deprecationReason)
      .withDocumentation('doc')
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DecimalTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one decimal type', (): void => {
    expect(namespace.entity.decimalType.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).isDeprecated).toBe(true);
    expect(getDecimalType(namespace.entity, expectedRepositoryId).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building domain entity with decimal property in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity('DomainEntity')
      .withDocumentation(documentation)
      .withDecimalProperty(entityName, documentation, true, false, totalDigits, decimalPlaces, minValue, maxValue)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DecimalTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one decimal type', (): void => {
    expect(namespace.entity.decimalType.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have type', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).type).toBe('decimalType');
  });

  it('should have type humanized name', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).typeHumanizedName).toBe('Decimal Type');
  });

  it('should have documentation', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have total digits', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).totalDigits).toBe(totalDigits);
  });

  it('should have decimal places', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).decimalPlaces).toBe(decimalPlaces);
  });

  it('should have minValue', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).maxValue).toBe(maxValue);
  });

  it('should have data', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should be a generated type', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId).generatedSimpleType).toBe(true);
  });
});

describe('when building multiple shared decimals in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityName2 = 'EntityName2';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  const expectedRepositoryId2 = `${projectExtension}-${entityName2}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedDecimal(entityName)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()

      .withStartSharedDecimal(entityName2)
      .withDocumentation(documentation)
      .withDecimalRestrictions(totalDigits, decimalPlaces, minValue, maxValue)
      .withEndSharedDecimal()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DecimalTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build two decimal types', (): void => {
    expect(namespace.entity.decimalType.size).toBe(2);
  });

  it('should be found in entity repository', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId)).toBeDefined();
    expect(namespace.entity.decimalType.get(expectedRepositoryId2)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building domain entity with multiple decimal properties in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityName2 = 'EntityName2';
  const documentation = 'doc';
  const totalDigits = '10';
  const decimalPlaces = '3';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  const expectedRepositoryId2 = `${projectExtension}-${entityName2}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity('DomainEntity')
      .withDocumentation(documentation)
      .withDecimalProperty(entityName, documentation, true, false, totalDigits, decimalPlaces, minValue, maxValue)
      .withDecimalProperty(entityName2, documentation, true, false, totalDigits, decimalPlaces, minValue, maxValue)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new DecimalTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build two decimal types', (): void => {
    expect(namespace.entity.decimalType.size).toBe(2);
  });

  it('should be found in entity repository', (): void => {
    expect(getDecimalType(namespace.entity, expectedRepositoryId)).toBeDefined();
    expect(namespace.entity.decimalType.get(expectedRepositoryId2)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});
