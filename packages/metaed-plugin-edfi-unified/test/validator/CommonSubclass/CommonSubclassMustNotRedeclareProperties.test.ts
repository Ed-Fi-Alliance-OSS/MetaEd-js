import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  CommonBuilder,
  CommonSubclassBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/CommonSubclass/CommonSubclassMustNotRedeclareProperties';

describe('when common subclass has different property name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation1', true, false)
      .withEndCommon()

      .withStartCommonSubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName2', 'PropertyDocumentation2', true, false)
      .withEndCommonSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one common', (): void => {
    expect(coreNamespace.entity.common.size).toBe(1);
  });

  it('should build one commonSubclass', (): void => {
    expect(coreNamespace.entity.commonSubclass.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when common subclass has duplicate property name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const duplicatePropertyName1 = 'DuplicatePropertyName';
  const duplicatePropertyName2 = 'DuplicatePropertyName2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty(duplicatePropertyName1, 'PropertyDocumentation3', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'PropertyDocumentation3', true, false)
      .withEndCommon()

      .withStartCommonSubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty(duplicatePropertyName1, 'PropertyDocumentation3', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'PropertyDocumentation3', true, false)
      .withBooleanProperty('PropertyName3', 'PropertyDocumentation', true, false)
      .withEndCommonSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one common', (): void => {
    expect(coreNamespace.entity.common.size).toBe(1);
  });

  it('should build one commonSubclass', (): void => {
    expect(coreNamespace.entity.commonSubclass.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('CommonSubClassMustNotRedeclareProperties');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Common Subclass SubclassName redeclares property DuplicatePropertyName of base Common."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 9,
        "line": 16,
        "tokenText": "DuplicatePropertyName",
      }
    `);

    expect(failures[1].validatorName).toBe('CommonSubClassMustNotRedeclareProperties');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchInlineSnapshot(
      `"Common Subclass SubclassName redeclares property DuplicatePropertyName2 of base Common."`,
    );
    expect(failures[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 9,
        "line": 20,
        "tokenText": "DuplicatePropertyName2",
      }
    `);
  });
});

describe('when common subclass has duplicate property name across dependent namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const duplicatePropertyName1 = 'DuplicatePropertyName';
  const duplicatePropertyName2 = 'DuplicatePropertyName2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty(duplicatePropertyName1, 'PropertyDocumentation3', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'PropertyDocumentation3', true, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartCommonSubclass('SubclassName', `EdFi.${entityName}`)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty(duplicatePropertyName1, 'PropertyDocumentation3', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'PropertyDocumentation3', true, false)
      .withBooleanProperty('PropertyName3', 'PropertyDocumentation', true, false)
      .withEndCommonSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);
    failures = validate(metaEd);
  });

  it('should build one common', (): void => {
    expect(coreNamespace.entity.common.size).toBe(1);
  });

  it('should build one commonSubclass', (): void => {
    expect(extensionNamespace.entity.commonSubclass.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('CommonSubClassMustNotRedeclareProperties');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Common Subclass SubclassName redeclares property DuplicatePropertyName of base Common."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 9,
        "line": 18,
        "tokenText": "DuplicatePropertyName",
      }
    `);

    expect(failures[1].validatorName).toBe('CommonSubClassMustNotRedeclareProperties');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchInlineSnapshot(
      `"Common Subclass SubclassName redeclares property DuplicatePropertyName2 of base Common."`,
    );
    expect(failures[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 9,
        "line": 22,
        "tokenText": "DuplicatePropertyName2",
      }
    `);
  });
});

describe('when common subclass has duplicate property name but different role name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty(propertyName, 'PropertyDocumentation3', true, false)
      .withEndCommon()

      .withStartCommonSubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty(propertyName, 'PropertyDocumentation3', true, false, 'RoleName')
      .withEndCommonSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});
