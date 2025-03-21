// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment } from '@edfi/metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DescriptorBuilder,
  DomainEntityBuilder,
} from '@edfi/metaed-core';
import { xpathSelect, enhanceAndGenerate, initializeNamespaceDependencies } from './IntegrationTestHelper';

describe('when generating xsd for descriptor', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity = 'CoreEntity';
  const descriptorProperty = 'CoreProperty';

  let coreResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const descriptorBuilder = new DescriptorBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartDescriptor(coreEntity)
      .withDocumentation('doc')
      .withIntegerProperty(descriptorProperty, 'doc', true, false)
      .withEndDescriptor()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(descriptorBuilder);

    ({ coreResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate descriptor', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntityDescriptor']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate descriptor reference', (): void => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='CoreEntityDescriptorReferenceType']", coreResult);
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for domain entity in extension namespace with reference to core descriptor', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity = 'CoreEntity';
  const descriptorProperty = 'CoreProperty';
  const extensionNamespace = 'Extension';
  const extension = 'EXTENSION';
  const extensionEntity = 'ExtensionEntity';
  const extensionEntityPk = 'ExtensionEntityPk';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const descriptorBuilder = new DescriptorBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartDescriptor(coreEntity)
      .withDocumentation('doc')
      .withIntegerProperty(descriptorProperty, 'doc', true, false)
      .withEndDescriptor()

      .withEndNamespace()
      .withBeginNamespace(extensionNamespace, extension)

      .withStartDomainEntity(extensionEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(extensionEntityPk, 'doc')
      .withDescriptorProperty(`EdFi.${coreEntity}`, 'doc', true, false)
      .withEndDomainEntity()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(descriptorBuilder);

    initializeNamespaceDependencies(metaEd, 'EdFi', extensionNamespace);
    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core descriptor', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntityDescriptor']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate core domain entity reference', (): void => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='CoreEntityDescriptorReferenceType']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity reference to core entity', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreEntity'][@type='CoreEntityDescriptorReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});

describe('when generating xsd for domain entity in extension namespace with reference to extension descriptor', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity = 'CoreEntity';
  const coreDescriptorProperty = 'CoreDescriptorProperty';
  const extensionNamespace = 'Extension';
  const extension = 'EXTENSION';
  const extensionEntity = 'ExtensionEntity';
  const extensionEntityPk = 'ExtensionEntityPk';
  const extentionDescriptorProperty = 'Extention Descriptor Property';

  let extensionResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const descriptorBuilder = new DescriptorBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartDescriptor(coreEntity)
      .withDocumentation('doc')
      .withIntegerProperty(coreDescriptorProperty, 'doc', true, false)
      .withEndDescriptor()

      .withEndNamespace()
      .withBeginNamespace(extensionNamespace, extension)

      .withStartDomainEntity(extensionEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(extensionEntityPk, 'doc')
      .withDescriptorProperty(extensionEntity, 'doc', true, false)
      .withEndDomainEntity()

      .withStartDescriptor(extensionEntity)
      .withDocumentation('doc')
      .withIntegerProperty(extentionDescriptorProperty, 'doc', true, false)
      .withEndDescriptor()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(descriptorBuilder);

    initializeNamespaceDependencies(metaEd, 'EdFi', extensionNamespace);
    ({ extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate extension descriptor', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntityDescriptor']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity reference to extension descriptor', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity reference to core entity', (): void => {
    const elements: any = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntity']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionEntity'][@type='EXTENSION-ExtensionEntityDescriptorReferenceType']/xs:annotation/xs:appinfo/ann:Descriptor",
      extensionResult,
    );
    expect(elements[0].childNodes[0].toString()).toEqual('EXTENSION-ExtensionEntityDescriptor');
  });
});

describe('when generating xsd for descriptor in extension namespace with reference to core entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreEntity = 'CoreEntity';
  const coreEntityPk = 'CoreEntityPk';
  const extensionNamespace = 'Extension';
  const extension = 'EXTENSION';
  const extensionEntity = 'ExtensionEntity';

  let coreResult;
  let extensionResult;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const descriptorBuilder = new DescriptorBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartDomainEntity(coreEntity)
      .withDocumentation('doc')
      .withIntegerIdentity(coreEntityPk, 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .withBeginNamespace(extensionNamespace, extension)

      .withStartDescriptor(extensionEntity)
      .withDocumentation('doc')
      .withDomainEntityProperty(`EdFi.${coreEntity}`, 'doc', true, false)
      .withStartMapType(true)
      .withDocumentation('doc')
      .withEnumerationItem('DescriptorItem')
      .withEndMapType()
      .withEndDescriptor()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(domainEntityBuilder)
      .sendToListener(descriptorBuilder);

    initializeNamespaceDependencies(metaEd, 'EdFi', extensionNamespace);
    ({ coreResult, extensionResult } = await enhanceAndGenerate(metaEd));
  });

  it('should generate core domain entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='CoreEntity']", coreResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension descriptor', (): void => {
    const elements = xpathSelect("/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntityDescriptor']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity reference to extension descriptor', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntityDescriptor']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='CoreEntityReference'][@type='CoreEntityReferenceType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity reference to core entity', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:complexType[@name='EXTENSION-ExtensionEntityDescriptor']/xs:complexContent/xs:extension/xs:sequence/xs:element[@name='ExtensionEntityMap'][@type='EXTENSION-ExtensionEntityMapType']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity reference to core entity', (): void => {
    const elements = xpathSelect("/xs:schema/xs:simpleType[@name='EXTENSION-ExtensionEntityMapType']", extensionResult);
    expect(elements).toHaveLength(1);
  });

  it('should generate extension domain entity reference to core entity', (): void => {
    const elements = xpathSelect(
      "/xs:schema/xs:simpleType/xs:restriction/xs:enumeration[@value='DescriptorItem']",
      extensionResult,
    );
    expect(elements).toHaveLength(1);
  });
});
