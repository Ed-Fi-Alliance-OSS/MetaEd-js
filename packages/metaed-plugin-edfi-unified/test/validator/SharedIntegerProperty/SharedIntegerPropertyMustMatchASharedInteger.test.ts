import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
  SharedIntegerBuilder,
} from 'metaed-core';
import { MetaEdEnvironment, ValidationFailure } from 'metaed-core';
import { validate } from '../../../src/validator/SharedIntegerProperty/SharedIntegerPropertyMustMatchASharedInteger';

describe('when shared integer property has identifier of shared integer', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedName = 'SharedName';
  const entityName = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedIntegerProperty(sharedName, sharedName, 'doc', true, false)
      .withEndDomainEntity()

      .withStartSharedInteger(sharedName)
      .withDocumentation('doc')
      .withEndSharedInteger()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when shared integer property has identifier of shared short', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedName = 'SharedName';
  const entityName = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedIntegerProperty(sharedName, sharedName, 'doc', true, false)
      .withEndDomainEntity()

      .withStartSharedShort(sharedName)
      .withDocumentation('doc')
      .withEndSharedShort()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures()', () => {
    expect(failures).toHaveLength(1);
  });

  it('should have validation failure for property', () => {
    expect(failures[0].validatorName).toBe('SharedIntegerPropertyMustMatchASharedInteger');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when shared integer property has identifier of shared integer with different local name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedName = 'SharedName';
  const entityName = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedIntegerProperty(sharedName, 'DifferentName', 'doc', true, false)
      .withEndDomainEntity()

      .withStartSharedInteger(sharedName)
      .withDocumentation('doc')
      .withEndSharedInteger()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when shared integer property has invalid identifier', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedIntegerProperty('InvalidName', 'InvalidName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures()', () => {
    expect(failures).toHaveLength(1);
  });

  it('should have validation failure for property', () => {
    expect(failures[0].validatorName).toBe('SharedIntegerPropertyMustMatchASharedInteger');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when shared integer property has identifier of shared integer in dependency namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedName = 'SharedName';
  const entityName = 'EntityName';
  let failures: Array<ValidationFailure>;
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedInteger(sharedName)
      .withDocumentation('doc')
      .withEndSharedInteger()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedIntegerProperty(`EdFi.${sharedName}`, sharedName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should have no validation failures()', () => {
    expect(failures).toHaveLength(0);
  });
});

describe('when shared integer property has invalid identifier of shared integer in dependency namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedName = 'SharedName';
  const entityName = 'EntityName';
  let failures: Array<ValidationFailure>;
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedInteger(sharedName)
      .withDocumentation('doc')
      .withEndSharedInteger()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedIntegerProperty('EdFi.Invalid', sharedName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should have validation failures()', () => {
    expect(failures).toHaveLength(1);
  });

  it('should have validation failure for property', () => {
    expect(failures[0].validatorName).toBe('SharedIntegerPropertyMustMatchASharedInteger');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when shared integer property refers to shared integer in non-dependency namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedName = 'SharedName';
  let failures: Array<ValidationFailure>;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Extensiona', 'ProjectExtensiona')
      .withStartSharedInteger(sharedName)
      .withDocumentation('doc')
      .withEndSharedInteger()
      .withEndNamespace()

      .withBeginNamespace('Extensionb', 'ProjectExtensionb')
      .withStartDomainEntity('ExtensionEntityB')
      .withDocumentation('doc')
      .withSharedIntegerProperty(`Extensiona.${sharedName}`, sharedName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures()', () => {
    expect(failures).toHaveLength(1);
  });

  it('should have validation failure for property', () => {
    expect(failures[0].validatorName).toBe('SharedIntegerPropertyMustMatchASharedInteger');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
