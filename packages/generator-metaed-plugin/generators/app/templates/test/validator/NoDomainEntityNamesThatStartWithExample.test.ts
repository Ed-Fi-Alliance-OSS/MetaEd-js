import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  AssociationBuilder,
  DomainEntityBuilder,
  MetaEdEnvironment,
  ValidationFailure,
  Namespace,
} from '@edfi/metaed-core';
import { validate } from '../../src/validator/NoDomainEntityNamesThatStartWithExample';

// Unit test using MetaEdTextBuilder - multiple namespaces and data standard 3.0
describe('when validating domain entity names that do not start with "Example"', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '3.0.0' };
  const coreEntityName = 'CoreEntityName';
  const extensionEntityName = 'ExtensionEntityName';
  let coreNamespace: Namespace;
  let extensionNamespace: Namespace;
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const coreNamespaceName = 'EdFi';
    const extensionNamespaceName = 'Extension';

    // Create the metaed language text for the test
    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartDomainEntity(coreEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('Property1', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName)
      .withStartDomainEntity(extensionEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      // Always run NamespaceBuilder first
      .sendToListener(new NamespaceBuilder(metaEd, []))
      // Remember to include all builders needed to parse the text for the test -- sendToListener is chainable
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(coreNamespaceName) as any;
    extensionNamespace = metaEd.namespace.get(extensionNamespaceName) as any;
    extensionNamespace.dependencies = [coreNamespace];

    failures = validate(metaEd);
  });

  // On a test where there should be no failures, confirm object building occurred to avoid false negatives
  it('should build domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

// Unit test using MetaEdTextBuilder - multiple namespaces and data standard 3.0
describe('when validating domain entity names that start with "Example"', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '3.0.0' };
  const coreEntityName = 'ExampleCoreEntityName';
  const extensionEntityName = 'ExampleExtensionEntityName';
  let coreNamespace: Namespace;
  let extensionNamespace: Namespace;
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const coreNamespaceName = 'EdFi';
    const extensionNamespaceName = 'Extension';

    // Create the metaed language text for the test
    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartDomainEntity(coreEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('Property1', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName)
      .withStartDomainEntity(extensionEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      // Always run NamespaceBuilder first
      .sendToListener(new NamespaceBuilder(metaEd, []))
      // Remember to include all builders needed to parse the text for the test -- sendToListener is chainable
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(coreNamespaceName) as any;
    extensionNamespace = metaEd.namespace.get(extensionNamespaceName) as any;
    extensionNamespace.dependencies = [coreNamespace];

    failures = validate(metaEd);
  });

  it('should have two validation failure', (): void => {
    expect(failures).toHaveLength(2);
    // "toMatchSnapshot()" is a valuable tool for comparing complex objects, but be careful --
    // always verify the generated snap file looks like you expect after initial run
    expect(failures).toMatchSnapshot();
  });
});

// Unit test using MetaEdTextBuilder - multiple namespaces and data standard 2.0
describe('when validating domain entity names that start with "Example" on data standard 2.0', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '2.0.0' };
  const coreEntityName = 'ExampleCoreEntityName';
  const extensionEntityName = 'ExampleExtensionEntityName';
  let coreNamespace: Namespace;
  let extensionNamespace: Namespace;
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const coreNamespaceName = 'EdFi';
    const extensionNamespaceName = 'Extension';

    // Create the metaed language text for the test
    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartDomainEntity(coreEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('Property1', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName)
      .withStartDomainEntity(extensionEntityName)
      .withDocumentation('Documentation')
      .withIntegerIdentity('Property2', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      // Always run NamespaceBuilder first
      .sendToListener(new NamespaceBuilder(metaEd, []))
      // Remember to include all builders needed to parse the text for the test -- sendToListener is chainable
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(coreNamespaceName) as any;
    extensionNamespace = metaEd.namespace.get(extensionNamespaceName) as any;
    extensionNamespace.dependencies = [coreNamespace];

    failures = validate(metaEd);
  });

  // On a test where there should be no failures, confirm object building occurred to avoid false negatives
  it('should build domain entities', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

// Unit test using MetaEdTextBuilder - multiple namespaces and data standard 3.0 with associations
describe('when validating association names that start with "Example" on data standard 3.0', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '3.0.0' };
  const coreEntityName = 'ExampleCoreEntityName';
  const extensionEntityName = 'ExampleExtensionEntityName';
  let coreNamespace: Namespace;
  let extensionNamespace: Namespace;
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    const coreNamespaceName = 'EdFi';
    const extensionNamespaceName = 'Extension';

    // Create the metaed language text for the test
    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartAssociation(coreEntityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withIntegerProperty('Property1', 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName)
      .withStartAssociation(extensionEntityName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('DomainEntity1', 'doc')
      .withAssociationDomainEntityProperty('DomainEntity2', 'doc')
      .withIntegerProperty('Property2', 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      // Always run NamespaceBuilder first
      .sendToListener(new NamespaceBuilder(metaEd, []))
      // Remember to include all builders needed to parse the text for the test -- sendToListener is chainable
      .sendToListener(new AssociationBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(coreNamespaceName) as any;
    extensionNamespace = metaEd.namespace.get(extensionNamespaceName) as any;
    extensionNamespace.dependencies = [coreNamespace];

    failures = validate(metaEd);
  });

  // On a test where there should be no failures, confirm object building occurred to avoid false negatives
  it('should build domain entities', (): void => {
    expect(coreNamespace.entity.association.size).toBe(1);
    expect(extensionNamespace.entity.association.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});
