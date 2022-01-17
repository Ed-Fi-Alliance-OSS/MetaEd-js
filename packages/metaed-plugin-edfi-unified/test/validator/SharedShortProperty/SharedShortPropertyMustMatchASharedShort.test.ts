import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  NamespaceBuilder,
  SharedIntegerBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/SharedShortProperty/SharedShortPropertyMustMatchASharedShort';

describe('when shared short property has identifier of shared short', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedName = 'SharedName';
  const entityName = 'EntityName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedShortProperty(sharedName, sharedName, 'doc', true, false)
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

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when shared short property has identifier of shared integer', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedName = 'SharedName';
  const entityName = 'EntityName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedShortProperty(sharedName, sharedName, 'doc', true, false)
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

  it('should have validation failures()', (): void => {
    expect(failures).toHaveLength(1);
  });

  it('should have validation failure for property', (): void => {
    expect(failures[0].validatorName).toBe('SharedShortPropertyMustMatchASharedShort');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when shared short property has identifier of shared short with different local name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedName = 'SharedName';
  const entityName = 'EntityName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedShortProperty(sharedName, 'DifferentName', 'doc', true, false)
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

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when shared short property has invalid identifier', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedShortProperty('InvalidName', 'InvalidName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures()', (): void => {
    expect(failures).toHaveLength(1);
  });

  it('should have validation failure for property', (): void => {
    expect(failures[0].validatorName).toBe('SharedShortPropertyMustMatchASharedShort');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when shared short property has identifier of shared short in dependency namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedName = 'SharedName';
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedShort(sharedName)
      .withDocumentation('doc')
      .withEndSharedShort()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedShortProperty(`EdFi.${sharedName}`, sharedName, 'doc', true, false)
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

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when shared short property has invalid identifier of shared short in dependency namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedName = 'SharedName';
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartSharedShort(sharedName)
      .withDocumentation('doc')
      .withEndSharedShort()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedShortProperty('EdFi.Invalid', sharedName, 'doc', true, false)
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

  it('should have validation failures()', (): void => {
    expect(failures).toHaveLength(1);
  });

  it('should have validation failure for property', (): void => {
    expect(failures[0].validatorName).toBe('SharedShortPropertyMustMatchASharedShort');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when shared short property refers to shared short in non-dependency namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sharedName = 'SharedName';
  let failures: ValidationFailure[];

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('Extensiona', 'ProjectExtensiona')
      .withStartSharedShort(sharedName)
      .withDocumentation('doc')
      .withEndSharedShort()
      .withEndNamespace()

      .withBeginNamespace('Extensionb', 'ProjectExtensionb')
      .withStartDomainEntity('ExtensionEntityB')
      .withDocumentation('doc')
      .withSharedShortProperty(`Extensiona.${sharedName}`, sharedName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedIntegerBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    failures = validate(metaEd);
  });

  it('should have validation failures()', (): void => {
    expect(failures).toHaveLength(1);
  });

  it('should have validation failure for property', (): void => {
    expect(failures[0].validatorName).toBe('SharedShortPropertyMustMatchASharedShort');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
