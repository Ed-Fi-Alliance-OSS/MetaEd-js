import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  DomainEntitySubclassBuilder,
  MetaEdEnvironment,
  NamespaceBuilder,
  ValidationFailure,
  SharedStringBuilder,
} from '@edfi/metaed-core';
import {
  outReferencePathEnhancer,
  domainEntityReferenceEnhancer,
  domainEntityExtensionBaseClassEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  sharedStringPropertyEnhancer,
  stringReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { validate } from '../../../src/validator/MergeScenarios/OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName';

describe('when domain entity has no multiple out paths to the same entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE2', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity has two out paths to the same entity but do not start with identities', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE2a', 'doc', true, false)
      .withDomainEntityProperty('DE2b', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2a')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2b')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity has two out paths to the same entity that start with identities but are not identities all the way', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE2a', 'doc')
      .withDomainEntityIdentity('DE2b', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE2a')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2b')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity has two out paths to the same entity that start with identities and are identities all the way', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE2a', 'doc')
      .withDomainEntityIdentity('DE2b', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE2a')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE3', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE2b')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE3', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should have two validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Ambiguous merge paths exist from DE1.DE2a to DE3. Paths are [DE2a.DE3] [DE2b.DE3].  Either add a merge directive, use 'role name', or change the model."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 18,
        "line": 5,
        "tokenText": "DE2a",
      }
    `);
  });
});

describe('when domain entity has two out paths to the same entity and only one starts with identities and both are identities the rest of the way', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE2a', 'doc')
      .withDomainEntityProperty('DE2b', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2a')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE3', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE2b')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE3', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should have two validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Ambiguous merge paths exist from DE1.DE2a to DE3. Paths are [DE2a.DE3] [DE2b.DE3].  Either add a merge directive, use 'role name', or change the model."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 18,
        "line": 5,
        "tokenText": "DE2a",
      }
    `);
    expect(failures[1].validatorName).toBe('OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchInlineSnapshot(
      `"Ambiguous merge paths exist from DE1.DE2b to DE3. Paths are [DE2a.DE3] [DE2b.DE3].  Either add a merge directive, use 'role name', or change the model."`,
    );
    expect(failures[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 18,
        "line": 9,
        "tokenText": "DE2b",
      }
    `);
  });
});

describe('when domain entity has two out paths to the same entity and only one starts with identities and both are not identities the rest of the way', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE2a', 'doc')
      .withDomainEntityProperty('DE2b', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2a')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE2b')
      .withDocumentation('doc')
      .withDomainEntityProperty('DE3', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity extension has out paths without referencing same entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let extensionNamespace: any = null;
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE2a', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE2a')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE3', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension')
      .withStartDomainEntityExtension('EdFi.DE1')
      .withDomainEntityProperty('EdFi.DE2b', 'doc', true, false)
      .withEndDomainEntityExtension()

      .withStartDomainEntity('DE2b')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies = [coreNamespace];
    domainEntityExtensionBaseClassEnhancer(metaEd);
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should build one domain entity extension', (): void => {
    expect(extensionNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity extension has out paths to the same entity as base and only base path starts with identities and both are identities the rest of the way', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let extensionNamespace: any = null;
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE2a', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE2a')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE3', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE2b')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE3', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension')
      .withStartDomainEntityExtension('EdFi.DE1')
      .withDomainEntityProperty('EdFi.DE2b', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies = [coreNamespace];
    domainEntityExtensionBaseClassEnhancer(metaEd);
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should build one domain entity extension', (): void => {
    expect(extensionNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have two validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Ambiguous merge paths exist from DE1.DE2b to DE3. Paths are [DE2b.DE3] [DE2a.DE3].  Either add a merge directive, use 'role name', or change the model."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 23,
        "line": 33,
        "tokenText": "DE2b",
      }
    `);
    expect(failures[1].validatorName).toBe('OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchInlineSnapshot(
      `"Ambiguous merge paths exist from DE1.DE2a to DE3. Paths are [DE2b.DE3] [DE2a.DE3].  Either add a merge directive, use 'role name', or change the model."`,
    );
    expect(failures[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 18,
        "line": 5,
        "tokenText": "DE2a",
      }
    `);
  });
});

describe('when domain entity subclass has out paths without referencing same entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let extensionNamespace: any = null;
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE2a', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE2a')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE3', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension')
      .withStartDomainEntitySubclass('DES1', 'EdFi.DE1')
      .withDomainEntityProperty('EdFi.DE2b', 'doc', true, false)
      .withEndDomainEntityExtension()

      .withStartDomainEntity('DE2b')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies = [coreNamespace];
    domainEntitySubclassBaseClassEnhancer(metaEd);
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build three domain entities in core', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(3);
  });

  it('should build one domain entity in extension', (): void => {
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity subclass', (): void => {
    expect(extensionNamespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity subclass has out paths to the same entity as base and only base path starts with identities and both are identities the rest of the way', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let extensionNamespace: any = null;
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE2a', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE2a')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE3', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE2b')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE3', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension')
      .withStartDomainEntitySubclass('DES1', 'EdFi.DE1')
      .withDocumentation('doc')
      .withDomainEntityProperty('EdFi.DE2b', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies = [coreNamespace];
    domainEntitySubclassBaseClassEnhancer(metaEd);
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should build one domain entity subclass', (): void => {
    expect(extensionNamespace.entity.domainEntitySubclass.size).toBe(1);
  });

  it('should have two validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Ambiguous merge paths exist from DES1.DE2b to DE3. Paths are [DE2b.DE3] [DE2a.DE3].  Either add a merge directive, use 'role name', or change the model."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 23,
        "line": 35,
        "tokenText": "DE2b",
      }
    `);
    expect(failures[1].validatorName).toBe('OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchInlineSnapshot(
      `"Ambiguous merge paths exist from DE1.DE2a to DE3. Paths are [DE2b.DE3] [DE2a.DE3].  Either add a merge directive, use 'role name', or change the model."`,
    );
    expect(failures[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 18,
        "line": 5,
        "tokenText": "DE2a",
      }
    `);
  });
});

// TODO: additional testing ideas

describe('when domain entity has three out paths to the same entity and only one starts with identities and all are identities all the way', (): void => {});

describe('when domain entity has three out paths to the same entity and only one starts with identities and one is not identities the rest of the way', (): void => {});

describe('when domain entity has two out paths to the same entity and both are non-identity collections', (): void => {});

describe('when domain entity has two out paths to the same entity that start with identities and are identities all the way and one has a role name', (): void => {});

describe('when domain entity has two out paths to the same entity that start with identities and are identities all the way and one has a merge directive', (): void => {});

describe('when domain entity has three out paths to the same entity and only one starts with identity and are identities all the way and only one has a merge directive', (): void => {});

// role name examples

// shared string
describe('when domain entity has reference to entity with identity of shared string', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE2', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE2')
      .withDocumentation('doc')
      .withSharedStringIdentity('SS', null, 'doc')
      .withEndDomainEntity()

      .withStartSharedString('SS')
      .withDocumentation('doc')
      .withStringRestrictions('5', '10')
      .withEndSharedString()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    sharedStringPropertyEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build two domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(2);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity has reference to entity with identity of shared string', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let coreNamespace: any = null;
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('DE1')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE2a', 'doc')
      .withDomainEntityIdentity('DE2b', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE2a')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE3', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE2b')
      .withDocumentation('doc')
      .withDomainEntityIdentity('DE3', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('DE3')
      .withDocumentation('doc')
      .withSharedStringIdentity('SS', null, 'doc')
      .withEndDomainEntity()

      .withStartSharedString('SS')
      .withDocumentation('doc')
      .withStringRestrictions('5', '10')
      .withEndSharedString()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    domainEntityReferenceEnhancer(metaEd);
    stringReferenceEnhancer(metaEd);
    sharedStringPropertyEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
    failures = validate(metaEd);
  });

  it('should build four domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(4);
  });

  it('should have two validation failures', (): void => {
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchInlineSnapshot(
      `"Ambiguous merge paths exist from DE1.DE2a to SS. Paths are [DE2a.DE3.SS] [DE2b.DE3.SS] [DE2a.DE3] [DE2b.DE3].  Either add a merge directive, use 'role name', or change the model."`,
    );
    expect(failures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 18,
        "line": 5,
        "tokenText": "DE2a",
      }
    `);

    expect(failures[1].validatorName).toBe('OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName');
    expect(failures[1].category).toBe('error');
    expect(failures[1].message).toMatchInlineSnapshot(
      `"Ambiguous merge paths exist from DE1.DE2b to SS. Paths are [DE2a.DE3.SS] [DE2b.DE3.SS] [DE2a.DE3] [DE2b.DE3].  Either add a merge directive, use 'role name', or change the model."`,
    );
    expect(failures[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 18,
        "line": 9,
        "tokenText": "DE2b",
      }
    `);
  });
});
