// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityBuilder, DomainEntityExtensionBuilder, DomainEntitySubclassBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/DomainEntityExtension/DomainEntityExtensionMustNotRedeclareProperties';

describe('when domain entity extension correctly has different property names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity extension has duplicate property name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const duplicatePropertyName: string = 'DuplicatePropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(duplicatePropertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty(duplicatePropertyName, 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have validation failures()', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DomainEntityExtensionMustNotRedeclareProperties');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when domain entity extension has duplicate property name should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when domain entity extension has duplicate property name should have validation failure -> sourceMap');
  });
});

describe('when domain entity extension has duplicate property name but different role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const duplicatePropertyName: string = 'DuplicatePropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(duplicatePropertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty(duplicatePropertyName, 'doc', true, false, 'RoleName')
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity subclass and extension have duplicate property name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const subclassEntityName: string = 'SubclassEntityName';
  const duplicatePropertyName: string = 'DuplicatePropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyOne', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(subclassEntityName, entityName)
      .withDocumentation('doc')
      .withBooleanProperty(duplicatePropertyName, 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartDomainEntityExtension(subclassEntityName)
      .withBooleanProperty(duplicatePropertyName, 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have validation failures()', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DomainEntityExtensionMustNotRedeclareProperties');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when domain entity extension has duplicate property name should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when domain entity extension has duplicate property name should have validation failure -> sourceMap');
  });
});

describe('when domain entity extension has multiple duplicates', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const notDuplicatePropertyName: string = 'NotDuplicatePropertyName';
  const duplicatePropertyName1: string = 'DuplicatePropertyName1';
  const duplicatePropertyName2: string = 'DuplicatePropertyName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty(duplicatePropertyName1, 'doc', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty(duplicatePropertyName1, 'doc', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'doc', true, false)
      .withBooleanProperty(notDuplicatePropertyName, 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures()', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('DomainEntityExtensionMustNotRedeclareProperties');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).not.toMatch(new RegExp(notDuplicatePropertyName));
    expect(failures[0].message).toMatchSnapshot('when domain entity extension has multiple duplicates should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when domain entity extension has multiple duplicates should have validation failure -> sourceMap');

    expect(failures[1].validatorName).toBe('DomainEntityExtensionMustNotRedeclareProperties');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).not.toMatch(new RegExp(notDuplicatePropertyName));
    expect(failures[1].message).toMatchSnapshot('when domain entity extension has multiple duplicates should have validation failure -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when domain entity extension has multiple duplicates should have validation failure -> sourceMap');
  });
});

describe('when domain entity extension has duplicate common property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const duplicatePropertyName: string = 'DuplicatePropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCommonProperty(duplicatePropertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartDomainEntityExtension(entityName)
      .withCommonProperty(duplicatePropertyName, 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures()', () => {
    expect(failures).toHaveLength(1);
  });
});

describe('when domain entity extension has duplicate common extension override property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const duplicatePropertyName: string = 'DuplicatePropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCommonProperty(duplicatePropertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('extension', 'ProjectExtension')
      .withStartDomainEntityExtension(entityName)
      .withCommonExtensionOverrideProperty(duplicatePropertyName, 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});
