import { MetaEdEnvironment } from '@edfi/metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
} from '@edfi/metaed-core';
import { xpathSelect, enhanceAndGenerate, initializeNamespaceDependencies } from './IntegrationTestHelper';

describe('when generating xsd for descriptor', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity = 'CoreEntity';
  const coreEntityPk = 'CoreEntityPk';
  const extensionProperty = 'ExtensionProperty';
  const extensionNamespace = 'Extension';
  const extension = 'EXTENSION';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const domainEntityExtensionBuilder = new DomainEntityExtensionBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartDomainEntity(coreEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntityPk, 'doc')
      .withEndDomainEntity()

      .withEndNamespace()

      .withBeginNamespace(extensionNamespace, extension)

      .withStartDomainEntityExtension(`EdFi.${coreEntity}`)
      .withIntegerProperty(extensionProperty, 'doc', true, false)
      .withEndDomainEntityExtension()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(domainEntityExtensionBuilder);

    initializeNamespaceDependencies(metaEd, 'EdFi', extensionNamespace);
    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate descriptor', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate descriptor reference', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-CoreEntityExtension']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate descriptor reference', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-CoreEntityExtension']/xs:complexContent/xs:extension[@base='CoreEntity']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate descriptor reference', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-CoreEntityExtension']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionProperty']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});
