// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { StringTypeBuilder } from '../../src/builder/StringTypeBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { getStringType } from '../TestHelper';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building shared string in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';

  const minLength = '2';
  const maxLength = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedString(entityName)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new StringTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one string type', (): void => {
    expect(namespace.entity.stringType.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have type', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).type).toBe('stringType');
  });

  it('should have type humanized name', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).typeHumanizedName).toBe('String Type');
  });

  it('should have documentation', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should not be deprecated', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).isDeprecated).toBe(false);
  });

  it('should have minLength', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).minLength).toBe(minLength);
  });

  it('should have maxLength', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).maxLength).toBe(maxLength);
  });

  it('should have data', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should not be a generated type', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).generatedSimpleType).toBe(false);
  });
});

describe('when building deprecated shared string', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';
  const minLength = '2';
  const maxLength = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedString(entityName)
      .withDeprecated(deprecationReason)
      .withDocumentation('doc')
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new StringTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one string type', (): void => {
    expect(namespace.entity.stringType.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).isDeprecated).toBe(true);
    expect(getStringType(namespace.entity, expectedRepositoryId).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building domain entity with string property in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity('DomainEntity')
      .withDocumentation(documentation)
      .withStringProperty(entityName, documentation, true, false, maxLength, minLength)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new StringTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one string type', (): void => {
    expect(namespace.entity.stringType.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have type', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).type).toBe('stringType');
  });

  it('should have type humanized name', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).typeHumanizedName).toBe('String Type');
  });

  it('should have documentation', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have minLength', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).minLength).toBe(minLength);
  });

  it('should have maxLength', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).maxLength).toBe(maxLength);
  });

  it('should have data', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should be a generated type', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId).generatedSimpleType).toBe(true);
  });
});

describe('when building multiple shared strings in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityName2 = 'EntityName2';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  const expectedRepositoryId2 = `${projectExtension}-${entityName2}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedString(entityName)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()

      .withStartSharedString(entityName2)
      .withDocumentation(documentation)
      .withStringRestrictions(minLength, maxLength)
      .withEndSharedString()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new StringTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build two string types', (): void => {
    expect(namespace.entity.stringType.size).toBe(2);
  });

  it('should be found in entity repository', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId)).toBeDefined();
    expect(getStringType(namespace.entity, expectedRepositoryId2)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building domain entity with multiple string properties in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityName2 = 'EntityName2';
  const documentation = 'doc';
  const minLength = '2';
  const maxLength = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  const expectedRepositoryId2 = `${projectExtension}-${entityName2}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity('DomainEntity')
      .withDocumentation(documentation)
      .withStringProperty(entityName, documentation, true, false, maxLength, minLength)
      .withStringProperty(entityName2, documentation, true, false, maxLength, minLength)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new StringTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build two string types', (): void => {
    expect(namespace.entity.stringType.size).toBe(2);
  });

  it('should be found in entity repository', (): void => {
    expect(getStringType(namespace.entity, expectedRepositoryId)).toBeDefined();
    expect(getStringType(namespace.entity, expectedRepositoryId2)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});
