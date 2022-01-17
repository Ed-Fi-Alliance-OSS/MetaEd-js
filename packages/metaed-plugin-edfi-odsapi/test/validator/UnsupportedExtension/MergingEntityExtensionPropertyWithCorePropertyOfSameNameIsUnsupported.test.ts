import {
  AssociationBuilder,
  AssociationExtensionBuilder,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { initialize as initializeUnifiedPlugin } from '@edfi/metaed-plugin-edfi-unified';
import { initializeNamespaceDependencies } from '../ValidationTestHelper';
import { validate } from '../../../src/validator/UnsupportedExtension/MergingEntityExtensionPropertyWithCorePropertyOfSameNameIsUnsupported';

describe('when merging property of an extension entity with a core property of the same name', (): void => {
  let failures: ValidationFailure[];

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';
    const integerPropertyName2 = 'IntegerPropertyName2';
    const integerPropertyName3 = 'IntegerPropertyName3';
    const baseEntityName = 'BaseEntityName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IntegerPropertyName1', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(baseEntityName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'Documentation')
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'EXTENSION')
      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(`EdFi.${domainEntityName2}`, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociationExtension(`EdFi.${baseEntityName}`)
      .withDomainEntityProperty(domainEntityName3, 'Documentation', false, false)
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    initializeNamespaceDependencies(metaEd, 'EdFi', 'Extension');
    initializeUnifiedPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    metaEd.plugin.set(
      'edfiOdsApi',
      Object.assign(newPluginEnvironment(), {
        targetTechnologyVersion: '2.0.0',
      }),
    );
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MergingEntityExtensionPropertyWithCorePropertyOfSameNameIsUnsupported');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot(
      'when merging property of an extension entity with a core property of the same name should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when merging property of an extension entity with a core property of the same name should have validation failure -> sourceMap',
    );
  });
});

describe('when merging property of an extension entity with a core property of the same name with different context name', (): void => {
  let failures: ValidationFailure[];

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';
    const integerPropertyName2 = 'IntegerPropertyName2';
    const integerPropertyName3 = 'IntegerPropertyName3';
    const baseEntityName = 'BaseEntityName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IntegerPropertyName1', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(baseEntityName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'Documentation')
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'EXTENSION')
      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(`EdFi.${domainEntityName2}`, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociationExtension(`EdFi.${baseEntityName}`)
      .withDomainEntityProperty(domainEntityName3, 'Documentation', false, false, false, 'ContextName')
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    initializeNamespaceDependencies(metaEd, 'EdFi', 'Extension');
    initializeUnifiedPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    metaEd.plugin.set(
      'edfiOdsApi',
      Object.assign(newPluginEnvironment(), {
        targetTechnologyVersion: '2.0.0',
      }),
    );
    failures = validate(metaEd);
  });

  it('should have no validation failures', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when merging property of an extension entity with a core property of the same name and same context name', (): void => {
  let failures: ValidationFailure[];

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const contextName = 'ContextName';
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';
    const integerPropertyName2 = 'IntegerPropertyName2';
    const integerPropertyName3 = 'IntegerPropertyName3';
    const baseEntityName = 'BaseEntityName';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IntegerPropertyName1', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withIntegerIdentity(integerPropertyName2, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociation(baseEntityName)
      .withDocumentation('Documentation')
      .withAssociationDomainEntityProperty(domainEntityName1, 'Documentation')
      .withAssociationDomainEntityProperty(domainEntityName2, 'Documentation', contextName)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'EXTENSION')
      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(`EdFi.${domainEntityName2}`, 'Documentation')
      .withEndDomainEntity()

      .withStartAssociationExtension(`EdFi.${baseEntityName}`)
      .withDomainEntityProperty(domainEntityName3, 'Documentation', false, false, false, contextName)
      .withIntegerProperty(integerPropertyName3, 'Documentation', false, false)
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));
    initializeNamespaceDependencies(metaEd, 'EdFi', 'Extension');
    initializeUnifiedPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    metaEd.plugin.set(
      'edfiOdsApi',
      Object.assign(newPluginEnvironment(), {
        targetTechnologyVersion: '2.0.0',
      }),
    );
    failures = validate(metaEd);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('MergingEntityExtensionPropertyWithCorePropertyOfSameNameIsUnsupported');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot(
      'when merging property of an extension entity with a core property of the same name and same context name should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when merging property of an extension entity with a core property of the same name and same context name should have validation failure -> sourceMap',
    );
  });
});
