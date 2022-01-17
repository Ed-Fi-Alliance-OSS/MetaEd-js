import { MetaEdEnvironment } from '@edfi/metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  DomainEntityBuilder,
  AssociationBuilder,
  AssociationSubclassBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { xpathSelect, enhanceAndGenerate, initializeNamespaceDependencies } from './IntegrationTestHelper';

describe('when generating xsd for association extension in extension namespace based on core association', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const namespaceName = 'Extension';
  const projectExtension = 'EXTENSION';
  const coreEntity1 = 'CoreEntity1';
  const coreEntity1Pk = 'CoreEntity1Pk';
  const coreEntity2 = 'CoreEntity2';
  const coreEntity2Pk = 'CoreEntity2Pk';
  const coreAssociation = 'CoreAssociation';
  const extensionAssociation = 'ExtensionAssociation';
  const extensionAssociationProperty = 'ExtensionAssociationProperty';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const associationBuilder = new AssociationBuilder(metaEd, []);
    const associationSubclassBuilder = new AssociationSubclassBuilder(metaEd, []);
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')

      .withStartDomainEntity(coreEntity1)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntity1Pk, 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(coreEntity2)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntity2Pk, 'doc')
      .withEndDomainEntity()

      .withStartAssociation(coreAssociation)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty(coreEntity1, 'doc')
      .withAssociationDomainEntityProperty(coreEntity2, 'doc')
      .withEndAssociation()

      .withEndNamespace()
      .withBeginNamespace(namespaceName, projectExtension)

      .withStartAssociationSubclass(extensionAssociation, `EdFi.${coreAssociation}`)
      .withDocumentation('doc')
      .withIntegerProperty(extensionAssociationProperty, 'doc', true, false)
      .withEndAssociationSubclass()

      .withEndNamespace()
      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(associationBuilder)
      .sendToListener(associationSubclassBuilder);

    initializeNamespaceDependencies(metaEd, 'EdFi', namespaceName);
    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core domain entity1', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity1']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity2', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity2']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core association', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreAssociation']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association as extending core association', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']/xs:complexContent/xs:extension[@base='CoreAssociation']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension association new property', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionAssociation']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionAssociationProperty']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});
