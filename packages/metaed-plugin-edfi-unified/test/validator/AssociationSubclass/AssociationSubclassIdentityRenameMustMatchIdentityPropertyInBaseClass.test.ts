import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  AssociationBuilder,
  AssociationSubclassBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/AssociationSubclass/AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass';

describe('when association subclass renames base identity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(entityName)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withStringIdentity('PropertyName3', 'PropertyDocumentation', '100')
      .withEndAssociation()

      .withStartAssociationSubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withStringIdentityRename('PropertyName4', 'PropertyName3', 'PropertyDocumentation', '100')
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should build one associationSubclass', (): void => {
    expect(coreNamespace.entity.associationSubclass.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when association subclass renames base identity across dependent namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(entityName)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withStringIdentity('PropertyName3', 'PropertyDocumentation', '100')
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartAssociationSubclass('SubclassName', `EdFi.${entityName}`)
      .withDocumentation('EntityDocumentation')
      .withStringIdentityRename('PropertyName4', 'PropertyName3', 'PropertyDocumentation', '100')
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

  it('should build one association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should build one associationSubclass', (): void => {
    expect(extensionNamespace.entity.associationSubclass.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when association subclass does not rename identity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(entityName)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withStringIdentity('PropertyName3', 'PropertyDocumentation3', '100')
      .withEndAssociation()

      .withStartAssociationSubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withStringProperty('PropertyName4', 'PropertyDocumentation', true, false, '100')
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should build one associationSubclass', (): void => {
    expect(coreNamespace.entity.associationSubclass.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when association subclass renames base identity that does not exist', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(entityName)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withStringIdentity('PropertyName3', 'PropertyDocumentation3', '100')
      .withEndAssociation()

      .withStartAssociationSubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withStringIdentityRename('PropertyName4', 'PropertyName5', 'PropertyDocumentation', '100')
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should build one associationSubclass', (): void => {
    expect(coreNamespace.entity.associationSubclass.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when association subclass renames base identity that does not exist should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when association subclass renames base identity that does not exist should have validation failure -> sourceMap',
    );
  });
});

describe('when association subclass renames base property that is not identity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociation(entityName)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withStringProperty('PropertyName3', 'PropertyDocumentation', true, false, '100')
      .withEndAssociation()

      .withStartAssociationSubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withStringIdentityRename('PropertyName4', 'PropertyName3', 'PropertyDocumentation', '100')
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should build one associationSubclass', (): void => {
    expect(coreNamespace.entity.associationSubclass.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when association subclass renames base property that is not identity should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when association subclass renames base property that is not identity should have validation failure -> sourceMap',
    );
  });
});

describe('when association subclass extends non existent entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAssociationSubclass('SubclassName', 'EntityName')
      .withDocumentation('EntityDocumentation')
      .withStringIdentityRename('PropertyName2', 'PropertyName1', 'PropertyDocumentation', '100')
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should not build association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(0);
  });

  it('should build one associationSubclass', (): void => {
    expect(coreNamespace.entity.associationSubclass.size).toBe(1);
  });

  it('should have validation failures', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when association subclass extends non existent entity should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when association subclass extends non existent entity should have validation failure -> sourceMap',
    );
  });
});
