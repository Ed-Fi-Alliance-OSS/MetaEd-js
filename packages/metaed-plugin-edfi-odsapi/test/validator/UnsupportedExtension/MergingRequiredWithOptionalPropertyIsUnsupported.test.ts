import {
  newMetaEdEnvironment,
  newPluginEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { initialize as initializeUnifiedPlugin } from '@edfi/metaed-plugin-edfi-unified';
import { initializeNamespaceDependencies } from '../ValidationTestHelper';
import { validate } from '../../../src/validator/UnsupportedExtension/MergingRequiredWithOptionalPropertyIsUnsupported';

describe('when a domain entity has both a required and optional reference to a property of the same name but is in core', (): void => {
  let failures: ValidationFailure[];

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IntegerPropertyName1', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName2, 'Documentation')
      .withDomainEntityProperty(domainEntityName1, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

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

describe('when a domain entity has both a required and optional reference to a property of the same name in an extension', (): void => {
  let failures: ValidationFailure[];

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IntegerPropertyName1', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(`EdFi.${domainEntityName2}`, 'Documentation')
      .withDomainEntityProperty(`EdFi.${domainEntityName1}`, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
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
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MergingRequiredWithOptionalPropertyIsUnsupported');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot(
      'when a domain entity has both a required and optional reference to a property of the same name should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when a domain entity has both a required and optional reference to a property of the same name should have validation failure -> sourceMap',
    );
    expect(failures[1].validatorName).toBe('MergingRequiredWithOptionalPropertyIsUnsupported');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot(
      'when a domain entity has both a required and optional reference to a property of the same name should have validation failure -> message',
    );
    expect(failures[1].sourceMap).toMatchSnapshot(
      'when a domain entity has both a required and optional reference to a property of the same name should have validation failure -> sourceMap',
    );
  });
});

describe('when a domain entity has both a required and optional reference to domain entity with a property of the same name', (): void => {
  let failures: ValidationFailure[];

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';
    const domainEntityName4 = 'DomainEntityName4';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IntegerPropertyName1', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntity(domainEntityName4)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(`EdFi.${domainEntityName2}`, 'Documentation')
      .withDomainEntityProperty(`EdFi.${domainEntityName3}`, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
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
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MergingRequiredWithOptionalPropertyIsUnsupported');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot(
      'when a domain entity has both a required and optional reference to domain entity with a property of the same name should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when a domain entity has both a required and optional reference to domain entity with a property of the same name should have validation failure -> sourceMap',
    );
    expect(failures[1].validatorName).toBe('MergingRequiredWithOptionalPropertyIsUnsupported');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot(
      'when a domain entity has both a required and optional reference to domain entity with a property of the same name should have validation failure -> message',
    );
    expect(failures[1].sourceMap).toMatchSnapshot(
      'when a domain entity has both a required and optional reference to domain entity with a property of the same name should have validation failure -> sourceMap',
    );
  });
});

describe('when a domain entity has both a required and optional reference to a property of the same name with same context name', (): void => {
  let failures: ValidationFailure[];

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const contextName = 'ContextName';
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IntegerPropertyName1', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(`EdFi.${domainEntityName2}`, 'Documentation', contextName)
      .withDomainEntityProperty(`EdFi.${domainEntityName1}`, 'Documentation', false, false, false, contextName)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
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
    expect(failures).toHaveLength(2);
    expect(failures[0].validatorName).toBe('MergingRequiredWithOptionalPropertyIsUnsupported');
    expect(failures[0].category).toBe('warning');
    expect(failures[0].message).toMatchSnapshot(
      'when a domain entity has both a required and optional reference to a property of the same name with same context name should have validation failure -> message',
    );
    expect(failures[0].sourceMap).toMatchSnapshot(
      'when a domain entity has both a required and optional reference to a property of the same name with same context name should have validation failure -> sourceMap',
    );
    expect(failures[1].validatorName).toBe('MergingRequiredWithOptionalPropertyIsUnsupported');
    expect(failures[1].category).toBe('warning');
    expect(failures[1].message).toMatchSnapshot(
      'when a domain entity has both a required and optional reference to a property of the same name with same context name should have validation failure -> message',
    );
    expect(failures[1].sourceMap).toMatchSnapshot(
      'when a domain entity has both a required and optional reference to a property of the same name with same context name should have validation failure -> sourceMap',
    );
  });
});

describe('when a domain entity has both a required and optional reference to a property of the same name with different context name', (): void => {
  let failures: ValidationFailure[];

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntityName3 = 'DomainEntityName3';
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity('IntegerPropertyName1', 'Documentation')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(domainEntityName1, 'Documentation')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntity(domainEntityName3)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(`EdFi.${domainEntityName2}`, 'Documentation')
      .withDomainEntityProperty(`EdFi.${domainEntityName1}`, 'Documentation', false, false, false, 'ContextName')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
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

describe('when a domain entity has both a required and optional reference to a property of the same name with different context name on property', (): void => {
  let failures: ValidationFailure[];

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const domainEntityName1 = 'DomainEntityName1';
    const domainEntityName2 = 'DomainEntityName2';
    const IntegerPropertyName1 = 'IntegerPropertyName1';

    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName1)
      .withDocumentation('Documentation')
      .withIntegerIdentity(IntegerPropertyName1, 'Documentation', '100', '0', 'ContextName')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntity(domainEntityName2)
      .withDocumentation('Documentation')
      .withDomainEntityIdentity(`EdFi.${domainEntityName1}`, 'Documentation')
      .withIntegerProperty(IntegerPropertyName1, 'Documentation', false, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
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
