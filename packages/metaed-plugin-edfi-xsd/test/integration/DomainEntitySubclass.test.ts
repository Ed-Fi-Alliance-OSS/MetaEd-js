import { MetaEdEnvironment } from 'metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
} from 'metaed-core';
import { xpathSelect, enhanceAndGenerate, initializeNamespaceDependencies } from './IntegrationTestHelper';

describe('when generating xsd for descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity = 'CoreEntity';
  const coreEntityPk = 'CoreEntityPk';
  const extensionEntity = 'ExtensionEntity';
  const extensionEntityProperty = 'ExtensionEntityProperty';
  const extensionNamespace = 'Extension';
  const extension = 'EXTENSION';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const domainEntitySubclassBuilder = new DomainEntitySubclassBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartDomainEntity(coreEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntityPk, 'doc')
      .withEndDomainEntity()

      .withEndNamespace()

      .withBeginNamespace(extensionNamespace, extension)

      .withStartDomainEntitySubclass(extensionEntity, `EdFi.${coreEntity}`)
      .withIntegerProperty(extensionEntityProperty, 'doc', true, false)
      .withEndDomainEntitySubclass()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(domainEntitySubclassBuilder);

    initializeNamespaceDependencies(metaEd, 'EdFi', extensionNamespace);
    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core domain entity', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity', () => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity as extending core entity', () => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']/xs:complexContent/xs:extension[@base='CoreEntity']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});
