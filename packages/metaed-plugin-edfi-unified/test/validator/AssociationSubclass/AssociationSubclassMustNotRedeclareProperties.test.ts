import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  AssociationBuilder,
  AssociationSubclassBuilder,
  NamespaceBuilder,
} from 'metaed-core';
import { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/AssociationSubclass/AssociationSubclassMustNotRedeclareProperties';

describe('when association subclass has different property name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: Array<ValidationFailure>;
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one association', () => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should build one associationSubclass', () => {
    expect(coreNamespace.entity.associationSubclass.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when association subclass has duplicate property name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const duplicatePropertyName1 = 'DuplicatePropertyName';
  const duplicatePropertyName2 = 'DuplicatePropertyName2';
  let failures: Array<ValidationFailure>;
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one association', () => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should build one associationSubclass', () => {
    expect(coreNamespace.entity.associationSubclass.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('AssociationSubClassMustNotRedeclareProperties');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();

    expect(failures[1].validatorName).toBe('AssociationSubClassMustNotRedeclareProperties');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});

describe('when association subclass has duplicate property name across dependent namespaces', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const duplicatePropertyName1 = 'DuplicatePropertyName';
  const duplicatePropertyName2 = 'DuplicatePropertyName2';
  let failures: Array<ValidationFailure>;
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(entityName)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withBooleanProperty(duplicatePropertyName1, 'PropertyDocumentation3', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'PropertyDocumentation3', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartAssociationSubclass('SubclassName', `EdFi.${entityName}`)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty(duplicatePropertyName1, 'PropertyDocumentation3', true, false)
      .withBooleanProperty(duplicatePropertyName2, 'PropertyDocumentation3', true, false)
      .withBooleanProperty('PropertyName3', 'PropertyDocumentation', true, false)
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);
    failures = validate(metaEd);
  });

  it('should build one association', () => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should build one associationSubclass', () => {
    expect(extensionNamespace.entity.associationSubclass.size).toBe(1);
  });

  it('should have validation failures', () => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('AssociationSubClassMustNotRedeclareProperties');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();

    expect(failures[1].validatorName).toBe('AssociationSubClassMustNotRedeclareProperties');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchSnapshot();
    expect(failures[1].sourceMap).toMatchSnapshot();
  });
});

describe('when association subclass has duplicate property name but different role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
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

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});
