import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  AssociationBuilder,
  AssociationExtensionBuilder,
  AssociationSubclassBuilder,
  ChoiceBuilder,
  CommonBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  DomainEntitySubclassBuilder,
  EnumerationBuilder,
  NamespaceBuilder,
  SharedStringBuilder,
} from '@edfi/metaed-core';
import {
  mergeDirectiveEnhancer,
  associationExtensionBaseClassEnhancer,
  associationSubclassBaseClassEnhancer,
  associationReferenceEnhancer,
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  commonReferenceEnhancer,
  enumerationReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  domainEntityExtensionBaseClassEnhancer,
  stringReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/MergeDirective/SourcePropertyPathMustExist';

describe('when validating domain entity has merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const propertyName1 = 'PropertyName1';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName1, 'Documentation')
      .withDomainEntityProperty(domainEntityName1, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName1}.${propertyName1}`, propertyName1)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity has merge property and entity is wrong', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const propertyName1 = 'PropertyName1';
  const propertyName2 = 'PropertyName2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(propertyName1, 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName2, 'IntegerIdentityDocumentation')
      .withDomainEntityProperty(domainEntityName1, 'AssociationPropertyDocumentation', false, false)
      .withMergeDirective(`UnknowEntity.${propertyName1}`, propertyName2)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SourcePropertyPathMustExist');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating domain entity has merge property and entity is wrong -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating domain entity has merge property and entity is wrong -> sourceMap',
    );
  });
});

describe('when validating domain entity has merge property and property is wrong', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const propertyName1 = 'PropertyName1';
  const propertyName2 = 'PropertyName2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(propertyName1, 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName2, 'IntegerIdentityDocumentation')
      .withDomainEntityProperty(domainEntityName1, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName1}.UnknownProperty`, propertyName2)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SourcePropertyPathMustExist');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating domain entity has merge property and property is wrong -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating domain entity has merge property and property is wrong -> sourceMap',
    );
  });
});

describe('when validating domain entity has merge property on common type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  const commonName = 'CommonName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property1', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity3')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withCommonProperty(commonName, 'Documentation', false, false)
      .withMergeDirective(`${commonName}.${domainEntityName}`, domainEntityName)
      .withEndDomainEntity()

      .withStartCommon(commonName)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName, 'Documentation')
      .withEndCommon()

      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new CommonBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity has merge property on school year enumeration', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'DomainEntityName';
  const schoolYear = 'SchoolYear';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withEnumerationIdentity('SchoolYear', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity3')
      .withDocumentation('Documentation')
      .withEnumerationIdentity('SchoolYear', 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', true, false)
      .withMergeDirective(`${domainEntityName}.${schoolYear}`, schoolYear)
      .withEndDomainEntity()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('Documentation')
      .withEnumerationItem('1990-1991', '1990-1991')

      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new EnumerationBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity extension has merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'EntityWithExt1';
  const propertyName = 'Property1';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntityExtension('Entity2')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName}.${propertyName}`, 'Property2')
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    domainEntityExtensionBaseClassEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity subclass has merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityName3 = 'DomainEntityName3';
  const propertyName = 'Property1';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IdentityPropertyName', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntityName3, domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerProperty(propertyName, 'Documentation', true, false)
      .withDomainEntityProperty(domainEntityName2, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName2}.${propertyName}`, propertyName)
      .withEndDomainEntitySubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating association has merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'EntityWithAssoc1';
  const propertyName = 'Property1';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity3')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property3', 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation('Entity4')
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty('Entity2', 'Documentation')
      .withAssociationDomainEntityProperty('Entity3', 'Documentation')
      .withIntegerIdentity('Property4', 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName}.${propertyName}`, 'Property4')
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new AssociationBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating association extension has merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'EntityWithAssocExt1';
  const propertyName = 'Property1';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity3')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property3', 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation('Entity4')
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty('Entity2', 'Documentation')
      .withAssociationDomainEntityProperty('Entity3', 'Documentation')
      .withIntegerIdentity('Property4', 'Documentation')

      .withStartAssociationExtension('Entity4')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName}.${propertyName}`, 'Property4')
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new AssociationBuilder(metaEd, failures))
      .sendToListener(new AssociationExtensionBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    associationExtensionBaseClassEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating association subclass has merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'EntityWithAssocSub1';
  const propertyName = 'Property1';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity('Entity3')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property3', 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation('Entity4')
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty('Entity2', 'Documentation')
      .withAssociationDomainEntityProperty('Entity3', 'Documentation')
      .withIntegerIdentity('Property4', 'Documentation')

      .withStartAssociationSubclass('Entity5', 'Entity4')
      .withDocumentation('Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName}.${propertyName}`, 'Property4')
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures))
      .sendToListener(new AssociationBuilder(metaEd, failures))
      .sendToListener(new AssociationSubclassBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    associationSubclassBaseClassEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating abstract entity has merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName = 'AbstractEntity1';
  const propertyName = 'Property1';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName, 'Documentation')
      .withEndDomainEntity()

      .withStartAbstractEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'Documentation')
      .withDomainEntityProperty(domainEntityName, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName}.${propertyName}`, 'Property2')
      .withEndAbstractEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

// METAED-797 - StudentProgramAssociation extension cause incorrect merge validation errors
describe('when validating association subclass extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const extension = 'Extension';
  const associationName1 = 'AssociationName1';
  const associationName2 = 'AssociationName2';
  const associationSubclassName = 'AssociationSubclassName';
  const choiceName = 'ChoiceName';
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityName3 = 'DomainEntityName3';
  const domainEntityName4 = 'DomainEntityName4';
  const integerPropertyName1 = 'IntegerPropertyName1';
  const integerPropertyName2 = 'IntegerPropertyName2';
  const integerPropertyName3 = 'IntegerPropertyName3';
  const integerPropertyName4 = 'IntegerPropertyName4';
  const integerPropertyName5 = 'IntegerPropertyName5';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName3, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(associationName1)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'Documentation')
      .withEndAssociation()

      .withStartAssociation(associationName2)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName3, 'Documentation')
      .withEndAssociation()

      .withStartAssociationSubclass(associationSubclassName, associationName2)
      .withDocumentation('Documentation')
      .withIntegerProperty(integerPropertyName4, 'Documentation', false, false)
      .withEndAssociationSubclass()

      .withStartChoice(choiceName)
      .withDocumentation('Documentation')
      .withAssociationProperty(associationName1, 'Documentation', false, true)
      .withAssociationProperty(associationSubclassName, 'Documentation', false, true)
      .withEndChoice()

      .withStartDomainEntity(domainEntityName4)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withChoiceProperty(choiceName, 'Documentation', false, false)
      .withMergeDirective(`${choiceName}.${associationName1}.${domainEntityName1}`, domainEntityName1)
      .withMergeDirective(`${choiceName}.${associationSubclassName}.${domainEntityName1}`, domainEntityName1)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension, 'Extension')
      .withStartAssociationExtension(`${namespaceName}.${associationSubclassName}`)
      .withIntegerProperty(integerPropertyName5, 'Documentation', false, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    associationReferenceEnhancer(metaEd);
    domainEntityReferenceEnhancer(metaEd);
    choiceReferenceEnhancer(metaEd);
    associationExtensionBaseClassEnhancer(metaEd);
    associationSubclassBaseClassEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build correct entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity has merge property across namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const propertyName1 = 'PropertyName1';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName1, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName1, 'Documentation')
      .withDomainEntityProperty(`EdFi.${domainEntityName1}`, 'Documentation', false, false)
      .withMergeDirective(`${domainEntityName1}.${propertyName1}`, propertyName1)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity has merge property across namespaces and entity is wrong', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1 = 'DomainEntityName1';
  const propertyName1 = 'PropertyName1';
  const propertyName2 = 'PropertyName2';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(propertyName1, 'IntegerIdentityDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity('Entity2')
      .withDocumentation('Documentation')
      .withIntegerIdentity(propertyName2, 'IntegerIdentityDocumentation')
      .withAssociationProperty(domainEntityName1, 'AssociationPropertyDocumentation', false, false)
      .withMergeDirective(`UnknownEntity.${propertyName1}`, propertyName2)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have one validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SourcePropertyPathMustExist');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when validating domain entity has simple property as merge property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const learningObjectiveName = 'LearningObjective';
  const objectiveAssessmentName = 'ObjectiveAssessment';
  const assessmentName = 'Assessment';
  const uriName = 'URI';
  const namespaceRename = 'Namespace';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withMinLength('5')
      .withMaxLength('255')
      .withEndSharedString()

      .withStartDomainEntity(learningObjectiveName)
      .withDocumentation('doc')
      .withSharedStringIdentity(uriName, namespaceRename, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(assessmentName)
      .withDocumentation('doc')
      .withSharedStringIdentity(uriName, namespaceRename, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(objectiveAssessmentName)
      .withDocumentation('doc')
      .withDomainEntityIdentity(assessmentName, 'doc')
      .withDomainEntityProperty(learningObjectiveName, 'doc', false, true)
      .withMergeDirective(`${learningObjectiveName}.${namespaceRename}`, `${assessmentName}.${namespaceRename}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, failures));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    stringReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should have no validation failure', (): void => {
    expect(failures).toHaveLength(0);
  });
});
