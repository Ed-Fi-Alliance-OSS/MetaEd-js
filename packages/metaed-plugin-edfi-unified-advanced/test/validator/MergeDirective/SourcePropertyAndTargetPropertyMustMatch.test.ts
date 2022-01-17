import {
  AssociationBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  DomainEntityExtensionBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  MetaEdEnvironment,
  ValidationFailure,
} from '@edfi/metaed-core';
import {
  mergeDirectiveEnhancer,
  domainEntityReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  domainEntityExtensionBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { validate } from '../../../src/validator/MergeDirective/SourcePropertyAndTargetPropertyMustMatch';

describe('when validating merge property name and types match', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const integerIdentityName = 'IntegerIdentityName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(integerIdentityName, 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity(integerIdentityName, 'DomainEntityPropertyDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
      .withMergeDirective(`${domainEntityName1}.${integerIdentityName}`, integerIdentityName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

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

describe('when validating merge property type mismatch', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const contextName1 = 'ContextName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName3')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation', contextName1)
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
      .withMergeDirective(`${domainEntityName1}.${domainEntityName2}`, `${contextName1}${domainEntityName1}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('SourcePropertyAndTargetPropertyMustMatch');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot(
      'when validating merge property type mismatch should have validation failure -> message ',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when validating merge property type mismatch should have validation failure -> sourceMap',
    );
  });
});

describe('when validating merge of nested domain entity with domain entity properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName3')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityPropertyDocumentation')
      .withMergeDirective(`${domainEntityName2}.${domainEntityName1}`, `${domainEntityName1}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

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

describe('when validating merge of domain entity with nested domain entity properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName3')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
      .withMergeDirective(`${domainEntityName1}`, `${domainEntityName2}.${domainEntityName1}`)
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityPropertyDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

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

describe('when validating merge of doubly nested domain entity with domain entity properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName2, 'DomainEntityIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName4')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
      .withDomainEntityIdentity(domainEntityName3, 'DomainEntityPropertyDocumentation')
      .withMergeDirective(`${domainEntityName3}.${domainEntityName2}.${domainEntityName1}`, `${domainEntityName1}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merge of domain entity and domain entity subclass properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName = 'DomainEntityNameTest';
    const domainEntitySubclassName = 'DomainEntitySubclassName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity('DomainEntityIdentity', 'DomainEntityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, domainEntityName)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity('DomainEntityName2')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName, 'DomainEntityPropertyDocumentation')
      .withMergeDirective(domainEntityName, domainEntitySubclassName)
      .withDomainEntityIdentity(domainEntitySubclassName, 'DomainEntityPropertyDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should build one domain entity subclass', (): void => {
    expect(coreNamespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merge of domain entity and domain entity subclass properties of base entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';
    const domainEntitySubclassName = 'DomainEntitySubclassName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity('DomainEntityName4')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntitySubclassName, 'DomainEntityPropertyDocumentation')
      .withDomainEntityIdentity(domainEntityName3, 'DomainEntityPropertyDocumentation')
      .withMergeDirective(`${domainEntityName3}.${domainEntityName1}`, `${domainEntitySubclassName}.${domainEntityName1}`)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should build one domain entity subclass', (): void => {
    expect(coreNamespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merge of domain entity, domain entity extension, and domain entity subclass properties, across namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntitySubclassName = 'DomainEntitySubclassName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntityExtension(domainEntityName1)
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntityExtension()

      .withStartDomainEntitySubclass(domainEntitySubclassName, `EdFi.${domainEntityName1}`)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName3', 'IntegerIdentityDocumentation')
      .withEndDomainEntitySubclass()

      .withStartDomainEntity('DomainEntityName3')
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(`EdFi.${domainEntityName1}`, 'DomainEntityPropertyDocumentation')
      .withDomainEntityIdentity(domainEntitySubclassName, 'DomainEntityPropertyDocumentation')
      .withMergeDirective(domainEntitySubclassName, domainEntityName1)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    domainEntityExtensionBaseClassEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity subclass', (): void => {
    expect(extensionNamespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should build one domain entity extension', (): void => {
    expect(extensionNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merging domain entity property of an association', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartAssociation('AssociationName')
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'AssociationDomainEntityPropertyDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName3, 'AssociationDomainEntityPropertyDocumentation')
      .withIntegerIdentity('IntegerIdentityName3', 'IntegerIdentityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
      .withMergeDirective(domainEntityName1, `${domainEntityName2}.${domainEntityName1}`)
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should build one association', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating merging domain entity property of an association across namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName1', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('DomainEntityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityDocumentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('DomainEntityDocumentation')
      .withIntegerIdentity('IntegerIdentityName2', 'IntegerIdentityDocumentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartAssociation('AssociationName')
      .withDocumentation('AssociationDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'AssociationDomainEntityPropertyDocumentation')
      .withAssociationDomainEntityProperty(domainEntityName3, 'AssociationDomainEntityPropertyDocumentation')
      .withIntegerIdentity('IntegerIdentityName3', 'IntegerIdentityDocumentation')
      .withDomainEntityIdentity(domainEntityName1, 'DomainEntityPropertyDocumentation')
      .withMergeDirective(domainEntityName1, `${domainEntityName2}.${domainEntityName1}`)
      .withEndAssociation()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build three domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should build one association', (): void => {
    expect(extensionNamespace.entity.association.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});
