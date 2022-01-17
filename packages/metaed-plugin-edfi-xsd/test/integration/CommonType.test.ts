import { MetaEdEnvironment } from '@edfi/metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  CommonBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
} from '@edfi/metaed-core';
import { xpathSelect, enhanceAndGenerate, initializeNamespaceDependencies } from './IntegrationTestHelper';

describe('when generating xsd for common type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity = 'CoreEntity';
  const coreProperty = 'CoreProperty';

  let coreResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const commonBuilder = new CommonBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartCommon(coreEntity)
      .withDocumentation('doc')
      .withIntegerProperty(coreProperty, 'doc', false, false)
      .withEndCommon()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(commonBuilder);

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate common type', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate common type property', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType/xs:sequence/xs:element[@name='CoreProperty']", coreResult);
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for domain entity in extension namespace with reference to core common type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreEntity = 'CoreEntity';
  const coreProperty = 'CoreProperty';
  const extensionName = 'Extension';
  const extension = 'EXTENSION';
  const extensionEntity = 'ExtensionEntity';
  const extensionEntityPk = 'ExtensionEntityPk';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const commonBuilder = new CommonBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const domainEntityExtensionBuilder = new DomainEntityExtensionBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartCommon(coreEntity)
      .withDocumentation('doc')
      .withIntegerProperty(coreProperty, 'doc', true, false)
      .withEndCommon()

      .withEndNamespace()

      .withBeginNamespace(extensionName, extension)

      .withStartDomainEntity(extensionEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(extensionEntityPk, 'doc')
      .withCommonProperty(coreEntity, 'doc', true, false)

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(commonBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(domainEntityExtensionBuilder);

    initializeNamespaceDependencies(metaEd, 'EdFi', extensionName);
    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core common type', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']", extensionResult);
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for common type in extension namespace with reference to core entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreEntity = 'CoreEntity';
  const coreEntityPk = 'CoreEntityPk';
  const extensionName = 'Extension';
  const extension = 'EXTENSION';
  const extensionEntity = 'ExtensionEntity';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const commonBuilder = new CommonBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const domainEntityExtensionBuilder = new DomainEntityExtensionBuilder(metaEd, []);

    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartCommon(coreEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntityPk, 'doc')
      .withEndCommon()

      .withEndNamespace()

      .withBeginNamespace(extensionName, extension)

      .withStartDomainEntity(extensionEntity)
      .withDocumentation('doc')
      .withDomainEntityProperty(coreEntity, 'doc', true, false)
      .withEndDomainEntity()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(domainEntityExtensionBuilder)
      .sendToListener(commonBuilder);

    initializeNamespaceDependencies(metaEd, 'EdFi', extensionName);
    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension common type', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']", extensionResult);
    expect(elements).toHaveLength(1);
  });
});
