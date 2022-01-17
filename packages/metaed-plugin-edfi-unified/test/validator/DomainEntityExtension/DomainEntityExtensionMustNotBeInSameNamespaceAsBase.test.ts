import { newMetaEdEnvironment, MetaEdTextBuilder, DomainEntityExtensionBuilder, NamespaceBuilder } from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/DomainEntityExtension/DomainEntityExtensionMustNotBeInSameNamespaceAsBase';

describe('when domain entity extension is in correct namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'ProjectExtension')
      .withStartDomainEntityExtension(`EdFi.${entityName}`)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));
    extensionNamespace = metaEd.namespace.get('Extension');
    failures = validate(metaEd);
  });

  it('should build one domain entity extension', (): void => {
    expect(extensionNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when domain entity extension is in core namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withBooleanProperty('PropertyName', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntityExtension(entityName)
      .withBooleanProperty('PropertyName2', 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));
    coreNamespace = metaEd.namespace.get('EdFi');
    failures = validate(metaEd);
  });

  it('should build one domain entity extension', (): void => {
    expect(coreNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have validation failure', (): void => {
    expect(failures).toHaveLength(1);
    expect(failures[0].validatorName).toBe('DomainEntityExtensionMustNotBeInSameNamespaceAsBase');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
