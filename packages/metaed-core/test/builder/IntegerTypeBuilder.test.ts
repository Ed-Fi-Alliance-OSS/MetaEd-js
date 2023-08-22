import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { IntegerTypeBuilder } from '../../src/builder/IntegerTypeBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { getIntegerType } from '../TestHelper';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building shared integer in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one integer type', (): void => {
    expect(namespace.entity.integerType.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have type', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).type).toBe('integerType');
  });

  it('should have type humanized name', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).typeHumanizedName).toBe('Integer Type');
  });

  it('should have documentation', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should not be deprecated', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).isDeprecated).toBe(false);
  });

  it('should have minValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).maxValue).toBe(maxValue);
  });

  it('should not have big hint', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).hasBigHint).toBe(false);
  });

  it('should have data', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should not be a generated type', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).generatedSimpleType).toBe(false);
  });

  it('should not be a short type', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).isShort).toBe(false);
  });
});

describe('when building shared integer with big min value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName)
      .withDocumentation(documentation)
      .withNumericRestrictions(null, null, true, false)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not have minValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).minValue).toBe('');
  });

  it('should not have maxValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).maxValue).toBe('');
  });

  it('should have big hint', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).hasBigHint).toBe(true);
  });
});

describe('when building shared integer with big max value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName)
      .withDocumentation(documentation)
      .withNumericRestrictions(null, null, false, true)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not have minValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).minValue).toBe('');
  });

  it('should not have maxValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).maxValue).toBe('');
  });

  it('should have big hint', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).hasBigHint).toBe(true);
  });
});

describe('when building integer property with big min value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity('DomainEntity')
      .withDocumentation(documentation)
      .withIntegerProperty(entityName, documentation, true, false, null, null, null, null, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not have minValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).minValue).toBe('');
  });

  it('should not have maxValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).maxValue).toBe('');
  });

  it('should have big hint', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).hasBigHint).toBe(true);
  });
});

describe('when building integer property with big max value', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity('DomainEntity')
      .withDocumentation(documentation)
      .withIntegerProperty(entityName, documentation, true, false, null, null, null, null, false, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not have minValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).minValue).toBe('');
  });

  it('should not have maxValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).maxValue).toBe('');
  });

  it('should have big hint', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).hasBigHint).toBe(true);
  });
});

describe('when building deprecated shared integer', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName)
      .withDeprecated(deprecationReason)
      .withDocumentation('doc')
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one integer type', (): void => {
    expect(namespace.entity.integerType.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).isDeprecated).toBe(true);
    expect(getIntegerType(namespace.entity, expectedRepositoryId).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building domain entity with integer property in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity('DomainEntity')
      .withDocumentation(documentation)
      .withIntegerProperty(entityName, documentation, true, false, maxValue, minValue)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one integer type', (): void => {
    expect(namespace.entity.integerType.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have type', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).type).toBe('integerType');
  });

  it('should have type humanized name', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).typeHumanizedName).toBe('Integer Type');
  });

  it('should have documentation', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have minValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).maxValue).toBe(maxValue);
  });

  it('should have data', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should be a generated type', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).generatedSimpleType).toBe(true);
  });

  it('should not be a short type', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).isShort).toBe(false);
  });
});

describe('when building shared short in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedShort(entityName)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one integer type', (): void => {
    expect(namespace.entity.integerType.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have type', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).type).toBe('integerType');
  });

  it('should have type humanized name', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).typeHumanizedName).toBe('Integer Type');
  });

  it('should have documentation', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have minValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).maxValue).toBe(maxValue);
  });

  it('should have data', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should not be a generated type', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).generatedSimpleType).toBe(false);
  });

  it('should be a short type', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).isShort).toBe(true);
  });
});

describe('when building domain entity with short property in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity('DomainEntity')
      .withDocumentation(documentation)
      .withShortProperty(entityName, documentation, true, false, maxValue, minValue)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one integer type', (): void => {
    expect(namespace.entity.integerType.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have project extension', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have type', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).type).toBe('integerType');
  });

  it('should have type humanized name', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).typeHumanizedName).toBe('Integer Type');
  });

  it('should have documentation', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).documentation).toBe(documentation);
  });

  it('should have minValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).minValue).toBe(minValue);
  });

  it('should have maxValue', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).maxValue).toBe(maxValue);
  });

  it('should have data', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).data).toBeDefined();
  });

  it('should be a generated type', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).generatedSimpleType).toBe(true);
  });

  it('should be a short type', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId).isShort).toBe(true);
  });
});

describe('when building multiple shared integers in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityName2 = 'EntityName2';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  const expectedRepositoryId = `${projectExtension}-${entityName}`;
  const expectedRepositoryId2 = `${projectExtension}-${entityName2}`;
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartSharedInteger(entityName)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()

      .withStartSharedInteger(entityName2)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build two integer types', (): void => {
    expect(namespace.entity.integerType.size).toBe(2);
  });

  it('should be found in entity repository', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId)).toBeDefined();
    expect(namespace.entity.integerType.get(expectedRepositoryId2)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building domain entity with multiple integer properties in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityName2 = 'EntityName2';
  const documentation = 'doc';
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
      .withIntegerProperty(entityName, documentation, true, false, maxValue, minValue)
      .withIntegerProperty(entityName2, documentation, true, false, maxValue, minValue)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(new IntegerTypeBuilder(metaEd, validationFailures));

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build two integer types', (): void => {
    expect(namespace.entity.integerType.size).toBe(2);
  });

  it('should be found in entity repository', (): void => {
    expect(getIntegerType(namespace.entity, expectedRepositoryId)).toBeDefined();
    expect(namespace.entity.integerType.get(expectedRepositoryId2)).toBeDefined();
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});
