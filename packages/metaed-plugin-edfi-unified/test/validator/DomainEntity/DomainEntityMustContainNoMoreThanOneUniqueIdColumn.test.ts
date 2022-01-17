import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/DomainEntity/DomainEntityMustContainNoMoreThanOneUniqueIdColumn';

describe('when validating domain entity with no UniqueId fields', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('Property1', 'doc', '100')
      .withStringProperty('Property2', 'doc', true, false, '50')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures.length).toBe(0);
  });
});

describe('when validating domain entity with one UniqueId field', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '100', 'Student')
      .withStringProperty('Property', 'doc', true, false, '50')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating domain entity with two UniqueId fields', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '100', null, 'Student')
      .withStringIdentity('UniqueId', 'doc', '100', null, 'Staff')
      .withStringProperty('Property', 'doc', true, false, '50')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DomainEntityMustContainNoMoreThanOneUniqueIdColumn');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});

describe('when validating domain entity with two UniqueId fields in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('AnEntity')
      .withDocumentation('doc')
      .withStringIdentity('EntityId', 'doc', '100')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '100', null, 'Student')
      .withStringIdentity('UniqueId', 'doc', '100', null, 'Staff')
      .withStringProperty('Property', 'doc', true, false, '50')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one domain entity', (): void => {
    expect(extensionNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});
