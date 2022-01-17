import { MetaEdEnvironment } from '@edfi/metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  CommonBuilder,
  CommonExtensionBuilder,
} from '@edfi/metaed-core';
import { xpathSelect, enhanceAndGenerate, initializeNamespaceDependencies } from './IntegrationTestHelper';

describe('when generating xsd for common type extension in extension namespace based on core common type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity = 'CoreEntity';
  const coreEntityProperty = 'CoreEntityProperty';
  const extensionProperty = 'ExtensionProperty';
  const namespaceName = 'Extension';
  const projectExtension = 'EXTENSION';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const commonExtensionBuilder = new CommonExtensionBuilder(metaEd, []);
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const commonBuilder = new CommonBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartCommon(coreEntity)
      .withDocumentation('doc')
      .withIntegerProperty(coreEntityProperty, 'doc', false, false)
      .withEndCommon()

      .withEndNamespace()
      .withBeginNamespace(namespaceName, projectExtension)

      .withStartCommonExtension(`EdFi.${coreEntity}`, '1')
      .withIntegerProperty(extensionProperty, 'doc', true, false)
      .withEndCommonExtension()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(commonExtensionBuilder)
      .sendToListener(commonBuilder)
      .toString();

    initializeNamespaceDependencies(metaEd, 'EdFi', namespaceName);
    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core common type', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension common type', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-CoreEntityExtension']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should genrate extension common type as extending core common type', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-CoreEntityExtension']/xs:complexContent/xs:extension[@base='CoreEntity']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity new property', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-CoreEntityExtension']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionProperty']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});
