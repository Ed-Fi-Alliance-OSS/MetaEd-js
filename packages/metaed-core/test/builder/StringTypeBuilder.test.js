// @flow
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { StringTypeBuilder } from '../../src/builder/StringTypeBuilder';
import { MetaEdTextBuilder } from '../MetaEdTextBuilder';
import { getStringType } from '../TestHelper';
import type { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building shared string in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';

  const minLength = '2';
  const maxLength = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedString(entityName, metaEdId)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new StringTypeBuilder(metaEd, validationFailures));
  });

  it('should build one string type', () => {
    expect(metaEd.entity.stringType.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have type', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).type).toBe('stringType');
  });

  it('should have type humanized name', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).typeHumanizedName).toBe('String Type');
  });

  it('should have metaed id', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have minLength', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).minLength).toBe(minLength);
  });

  it('should have maxLength', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).maxLength).toBe(maxLength);
  });

  it('should have data', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should not be a generated type', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).generatedSimpleType).toBe(false);
  });
});

describe('when building domain entity with string property in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withStringProperty(entityName, documentation, true, false, maxLength, minLength, null, metaEdId)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new StringTypeBuilder(metaEd, validationFailures));
  });

  it('should build one string type', () => {
    expect(metaEd.entity.stringType.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have type', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).type).toBe('stringType');
  });

  it('should have type humanized name', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).typeHumanizedName).toBe('String Type');
  });

  it('should have metaed id', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have minLength', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).minLength).toBe(minLength);
  });

  it('should have maxLength', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).maxLength).toBe(maxLength);
  });

  it('should have data', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should be a generated type', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId).generatedSimpleType).toBe(true);
  });
});

describe('when building multiple shared strings in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const entityName2: string = 'EntityName2';
  const metaEdId2: string = '1234';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  const expectedRepositoryId2 = `${projectExtension}-${entityName2}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedString(entityName, metaEdId)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()

      .withStartSharedString(entityName2, metaEdId2)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new StringTypeBuilder(metaEd, validationFailures));
  });

  it('should build two string types', () => {
    expect(metaEd.entity.stringType.size).toBe(2);
  });

  it('should be found in entity repository', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId)).toBeDefined();
    expect(getStringType(metaEd.entity, expectedRepositoryId2)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building domain entity with multiple string properties in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const entityName2: string = 'EntityName2';
  const metaEdId2: string = '1234';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  const expectedRepositoryId2 = `${projectExtension}-${entityName2}`;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity('DomainEntity', '1')
      .withDocumentation(documentation)
      .withStringProperty(entityName, documentation, true, false, maxLength, minLength, null, metaEdId)
      .withStringProperty(entityName2, documentation, true, false, maxLength, minLength, null, metaEdId2)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new StringTypeBuilder(metaEd, validationFailures));
  });

  it('should build two string types', () => {
    expect(metaEd.entity.stringType.size).toBe(2);
  });

  it('should be found in entity repository', () => {
    expect(getStringType(metaEd.entity, expectedRepositoryId)).toBeDefined();
    expect(getStringType(metaEd.entity, expectedRepositoryId2)).toBeDefined();
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });
});
