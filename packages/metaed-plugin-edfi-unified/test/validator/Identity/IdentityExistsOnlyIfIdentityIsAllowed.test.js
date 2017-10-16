// @flow
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  AssociationBuilder,
  AssociationExtensionBuilder,
  AssociationSubclassBuilder,
  CommonBuilder,
  DescriptorBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  DomainEntitySubclassBuilder,
} from '../../../../metaed-core/index';
import type { MetaEdEnvironment, ValidationFailure } from '../../../../metaed-core/index';
import { validate } from '../../../src/validator/Identity/IdentityExistsOnlyIfIdentityIsAllowed';

describe('when validating association with valid identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation('EntityName')
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withStringIdentity('PropertyName3', 'PropertyDocumentation', '100')
      .withEndAssociation()
      .withEndNamespace()
      .sendToListener(new AssociationBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity with valid identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity('EntityName')
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName', 'PropertyDocumentation', '100')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating abstract entity with valid identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAbstractEntity('EntityName')
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName', 'PropertyDocumentation', '100')
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating common type with valid identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartCommon('EntityName')
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName', 'PropertyDocumentation', '100')
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating inline common type with valid identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartInlineCommon('EntityName')
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName', 'PropertyDocumentation', '100')
      .withEndInlineCommon()
      .withEndNamespace()
      .sendToListener(new CommonBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one common', () => {
    expect(metaEd.entity.common.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating association extension with invalid identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withStringIdentity('PropertyName3', 'PropertyDocumentation', '100')
      .withEndAssociation()

      .withStartAssociationExtension(entityName)
      .withStringIdentity('PropertyName4', 'PropertyDocumentation', '100')
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('IdentityExistsOnlyIfIdentityIsAllowed');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating association extension with invalid identity property should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating association extension with invalid identity property should have validation failure -> sourceMap');
  });
});

describe('when validating association subclass with invalid identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartAssociation(entityName)
      .withDocumentation('EntityDocumentation')
      .withAssociationDomainEntityProperty('PropertyName1', 'PropertyDocumentation')
      .withAssociationDomainEntityProperty('PropertyName2', 'PropertyDocumentation')
      .withStringIdentity('PropertyName3', 'PropertyDocumentation', '100')
      .withEndAssociation()

      .withStartAssociationSubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName4', 'PropertyDocumentation', '100')
      .withEndAssociationSubclass()
      .withEndNamespace()

      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one association', () => {
    expect(metaEd.entity.association.size).toBe(1);
  });

  it('should build one association subclass', () => {
    expect(metaEd.entity.associationSubclass.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('IdentityExistsOnlyIfIdentityIsAllowed');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating association subclass with invalid identity property should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating association subclass with invalid identity property should have validation failure -> sourceMap');
  });
});

describe('when validating descriptor with invalid identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDescriptor('EntityName')
      .withDocumentation('PropertyDocumentation')
      .withStringIdentity('PropertyName1', 'PropertyDocumentation', '100')
      .withStartMapType()
      .withDocumentation('MapTypeDocumentation')
      .withEnumerationItem('ShortDescription1', 'PropertyDocumentation')
      .withEnumerationItem('ShortDescription2', 'PropertyDocumentation')
      .withEndMapType()
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new DescriptorBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one descriptor', () => {
    expect(metaEd.entity.descriptor.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('IdentityExistsOnlyIfIdentityIsAllowed');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating descriptor with invalid identity property should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating descriptor with invalid identity property should have validation failure -> sourceMap');
  });
});

describe('when validating domain entity extension with invalid identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName1', 'PropertyDocumentation', '100')
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withStringIdentity('PropertyName2', 'PropertyDocumentation', '100')
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity extension', () => {
    expect(metaEd.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('IdentityExistsOnlyIfIdentityIsAllowed');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating domain entity extension with invalid identity property should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating domain entity extension with invalid identity property should have validation failure -> sourceMap');
  });
});

describe('when validating domain entity subclass with invalid identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName: string = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('edfi')
      .withStartDomainEntity(entityName)
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName1', 'PropertyDocumentation', '100')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass('SubclassName', entityName)
      .withDocumentation('EntityDocumentation')
      .withStringIdentity('PropertyName2', 'PropertyDocumentation', '100')
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity subclass', () => {
    expect(metaEd.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have validation failure', () => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('IdentityExistsOnlyIfIdentityIsAllowed');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot('when validating domain entity subclass with invalid identity property should have validation failure -> message');
    expect(failures[0].sourceMap).toMatchSnapshot('when validating domain entity subclass with invalid identity property should have validation failure -> sourceMap');
  });
});
