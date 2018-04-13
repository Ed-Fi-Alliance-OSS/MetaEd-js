// @flow
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { NamespaceInfoBuilder } from '../../src/builder/NamespaceInfoBuilder';
import { IntegerTypeBuilder } from '../../src/builder/IntegerTypeBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { getIntegerType } from '../TestHelper';
import type { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building shared integer in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));
  });

  it('should build one integer type', () => {
    expect(metaEd.entity.integerType.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have type', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).type).toBe('integerType');
  });

  it('should have type humanized name', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).typeHumanizedName).toBe('Integer Type');
  });

  it('should have metaed id', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have minValue', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).maxValue).toBe(maxValue);
  });

  it('should have data', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should not be a generated type', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).generatedSimpleType).toBe(false);
  });

  it('should not be a short type', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).isShort).toBe(false);
  });
});

describe('when building domain entity with integer property in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withIntegerProperty(entityName, documentation, true, false, maxValue, minValue, null, metaEdId)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));
  });

  it('should build one integer type', () => {
    expect(metaEd.entity.integerType.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have type', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).type).toBe('integerType');
  });

  it('should have type humanized name', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).typeHumanizedName).toBe('Integer Type');
  });

  it('should have metaed id', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have minValue', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).maxValue).toBe(maxValue);
  });

  it('should have data', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should be a generated type', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).generatedSimpleType).toBe(true);
  });

  it('should not be a short type', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).isShort).toBe(false);
  });
});

describe('when building shared short in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));
  });

  it('should build one integer type', () => {
    expect(metaEd.entity.integerType.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have type', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).type).toBe('integerType');
  });

  it('should have type humanized name', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).typeHumanizedName).toBe('Integer Type');
  });

  it('should have metaed id', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have minValue', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).maxValue).toBe(maxValue);
  });

  it('should have data', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should not be a generated type', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).generatedSimpleType).toBe(false);
  });

  it('should be a short type', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).isShort).toBe(true);
  });
});

describe('when building domain entity with short property in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withShortProperty(entityName, documentation, true, false, maxValue, minValue, null, metaEdId)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));
  });

  it('should build one integer type', () => {
    expect(metaEd.entity.integerType.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have type', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).type).toBe('integerType');
  });

  it('should have type humanized name', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).typeHumanizedName).toBe('Integer Type');
  });

  it('should have metaed id', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have minValue', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).maxValue).toBe(maxValue);
  });

  it('should have data', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should be a generated type', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).generatedSimpleType).toBe(true);
  });

  it('should be a short type', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId).isShort).toBe(true);
  });
});

describe('when building multiple shared integers in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const entityName2: string = 'EntityName2';
  const metaEdId2: string = '1234';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  const expectedRepositoryId2 = `${projectExtension}-${entityName2}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()

      .withStartSharedInteger(entityName2, metaEdId2)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));
  });

  it('should build two integer types', () => {
    expect(metaEd.entity.integerType.size).toBe(2);
  });

  it('should be found in entity repository', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId)).toBeDefined();
    expect(metaEd.entity.integerType.get(expectedRepositoryId2)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building domain entity with multiple integer properties in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const entityName2: string = 'EntityName2';
  const metaEdId2: string = '1234';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  const expectedRepositoryId2 = `${projectExtension}-${entityName2}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withIntegerProperty(entityName, documentation, true, false, maxValue, minValue, null, metaEdId)
      .withIntegerProperty(entityName2, documentation, true, false, maxValue, minValue, null, metaEdId2)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));
  });

  it('should build two integer types', () => {
    expect(metaEd.entity.integerType.size).toBe(2);
  });

  it('should be found in entity repository', () => {
    expect(getIntegerType(metaEd.entity, expectedRepositoryId)).toBeDefined();
    expect(metaEd.entity.integerType.get(expectedRepositoryId2)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });
});
