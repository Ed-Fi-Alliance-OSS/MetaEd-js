// @flow
import { newMetaEdEnvironment, MetaEdTextBuilder, AssociationBuilder, AssociationSubclassBuilder } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/AssociationSubclass/AssociationSubclassMustNotRedeclareProperties';

describe('when association subclass has different property name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edf')
      .withStartAssociation(entityName)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation1')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation2')
      .withBooleanProperty('PropertyName3', 'PropertyDocumentation3', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName4', 'PropertyDocumentation1', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build one associationSubclass', () => {
    expect(metaEd.entity.associationSubclass.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when association subclass has duplicate property name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const duplicatePropertyName1: string = 'DuplicatePropertyName';
  const duplicatePropertyName2: string = 'DuplicatePropertyName2';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withBooleanProperty(duplicatePropertyName1, 'PropertyDocumentation3', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'PropertyDocumentation3', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty(duplicatePropertyName1, 'PropertyDocumentation3', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'PropertyDocumentation3', true, false)
      .withBooleanProperty('PropertyName3', 'PropertyDocumentation', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build one associationSubclass', () => {
    expect(metaEd.entity.associationSubclass.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('AssociationSubClassMustNotRedeclareProperties');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when association subclass has invalid extendee should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when association subclass has invalid extendee should have validation failure -> sourceMap');

    expect(failures[1].validatorName).toBe('AssociationSubClassMustNotRedeclareProperties');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot('when association subclass has invalid extendee should have validation failure -> message');
    expect(failures[1].sourceMap).toMatchSnapshot('when association subclass has invalid extendee should have validation failure -> sourceMap');
  });
});

describe('when association subclass has duplicate property name but different role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withBooleanProperty(propertyName, 'PropertyDocumentation3', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty(propertyName, 'PropertyDocumentation3', true, false, 'RoleName')
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});
