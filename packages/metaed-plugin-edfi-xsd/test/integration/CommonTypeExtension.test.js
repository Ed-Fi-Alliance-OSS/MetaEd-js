// @flow
import type { MetaEdEnvironment } from 'metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceInfoBuilder,
  CommonBuilder,
  CommonExtensionBuilder,
} from 'metaed-core';
import { xpathSelect, enhanceAndGenerate } from './IntegrationTestHelper';

describe('when generating xsd for common type extension in extension namespace based on core common type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity: string = 'CoreEntity';
  const coreEntityProperty: string = 'CoreEntityProperty';
  const extensionProperty: string = 'ExtensionProperty';
  const namespace: string = 'extension';
  const projectExtension: string = 'EXTENSION';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const commonExtensionBuilder = new CommonExtensionBuilder(metaEd, []);
    const namespaceInfoBuilder = new NamespaceInfoBuilder(metaEd, []);
    const commonBuilder = new CommonBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('edfi')

      .withStartCommon(coreEntity)
      .withDocumentation('doc')
      .withIntegerProperty(coreEntityProperty, 'doc', false, false)
      .withEndCommon()

      .withEndNamespace()
      .withBeginNamespace(namespace, projectExtension)

      .withStartCommonExtension(coreEntity, '1')
      .withIntegerProperty(extensionProperty, 'doc', true, false)
      .withEndCommonExtension()

      .withEndNamespace()

      .sendToListener(namespaceInfoBuilder)
      .sendToListener(commonExtensionBuilder)
      .sendToListener(commonBuilder)
      .toString();

    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core common type', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension common type', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-CoreEntityExtension']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should genrate extension common type as extending core common type', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-CoreEntityExtension']/xs:complexContent/xs:extension[@base='CoreEntity']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity new property', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-CoreEntityExtension']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionProperty']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});
