import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  CommonBuilder,
  CommonExtensionBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, ValidationFailure } from '@edfi/metaed-core';
import { validate } from '../../../src/validator/CommonProperty/CommonPropertyWithExtensionOverrideMustReferenceCommonTypeExtension';

describe('when validating common property has extension override of common type extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const commonTypeName = 'CommonType';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(commonTypeName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartDomainEntity(entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName2', 'PropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'EXTENSION')
      .withStartCommonExtension(commonTypeName)
      .withBooleanProperty('PropertyName3', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartDomainEntityExtension(`EdFi.${entityName}`)
      .withCommonExtensionOverrideProperty(`EdFi.${commonTypeName}`, 'PropertyDocumentation', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one common', (): void => {
    expect(coreNamespace.entity.common.size).toBe(1);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity extension', (): void => {
    expect(extensionNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have no validation failures()', (): void => {
    expect(failures).toHaveLength(0);
  });
});

describe('when validating common property has extension override of non common type extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const entityName = 'EntityName';
  const commonTypeName = 'CommonType';
  let failures: ValidationFailure[];
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon(commonTypeName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName1', 'PropertyDocumentation', true, false)
      .withEndCommon()

      .withStartDomainEntity(entityName)
      .withDocumentation('EntityDocumentation')
      .withBooleanProperty('PropertyName2', 'PropertyDocumentation', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'EXTENSION')
      .withStartDomainEntityExtension(entityName)
      .withCommonExtensionOverrideProperty(commonTypeName, 'PropertyDocumentation', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get('EdFi');
    extensionNamespace = metaEd.namespace.get('Extension');
    extensionNamespace.dependencies.push(coreNamespace);

    failures = validate(metaEd);
  });

  it('should build one common', (): void => {
    expect(coreNamespace.entity.common.size).toBe(1);
  });

  it('should build one domain entity', (): void => {
    expect(coreNamespace.entity.domainEntity.size).toBe(1);
  });

  it('should build one domain entity extension', (): void => {
    expect(extensionNamespace.entity.domainEntityExtension.size).toBe(1);
  });

  it('should have validation failure for property', (): void => {
    expect(failures[0].validatorName).toBe('CommonPropertyWithExtensionOverrideMustReferenceCommonTypeExtension');
    expect(failures[0].category).toBe('error');
    expect(failures[0].message).toMatchSnapshot();
    expect(failures[0].sourceMap).toMatchSnapshot();
  });
});
