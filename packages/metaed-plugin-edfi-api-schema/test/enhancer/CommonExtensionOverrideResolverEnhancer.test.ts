// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  AssociationBuilder,
  AssociationExtensionBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  CommonBuilder,
  CommonExtensionBuilder,
  Namespace,
  NoCommonExtension,
} from '@edfi/metaed-core';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as commonExtensionOverrideResolverEnhancer } from '../../src/enhancer/CommonExtensionOverrideResolverEnhancer';

describe('when domain entity extension has common extension override property with matching common extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const commonName = 'TestCommon';
  const domainEntityName = 'TestEntity';
  const extensionProperty = 'ExtensionProperty';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withIntegerIdentity('CommonId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('EntityId', 'doc')
      .withCommonProperty(commonName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${core}.${commonName}`, 'doc', true, false)
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${commonName}`)
      .withStringProperty(extensionProperty, 'doc', false, false, '50')
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(core);
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (coreNamespace && extensionNamespace) {
      extensionNamespace.dependencies.push(coreNamespace);
    }

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    commonExtensionOverrideResolverEnhancer(metaEd);
  });

  it('should set referencedCommonExtension to the matching common extension', () => {
    const overrideProperty = metaEd.propertyIndex.common.find((p) => p.isExtensionOverride && p.metaEdName === commonName);
    const { referencedCommonExtension } = overrideProperty!.data.edfiApiSchema;
    expect(referencedCommonExtension.metaEdName).toBe(commonName);
    expect(referencedCommonExtension.namespace.namespaceName).toBe(extension);
  });

  it('should not affect regular common properties without isExtensionOverride flag', () => {
    const regularProperty = metaEd.propertyIndex.common.find((p) => !p.isExtensionOverride && p.metaEdName === commonName);
    expect(regularProperty!.data.edfiApiSchema.referencedCommonExtension).toBe(NoCommonExtension);
  });
});

describe('when association extension has common extension override property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const commonName = 'AssociationCommon';
  const associationName = 'TestAssociation';
  const domainEntity1 = 'Entity1';
  const domainEntity2 = 'Entity2';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withIntegerIdentity('CommonId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntity1)
      .withDocumentation('doc')
      .withIntegerIdentity('Entity1Id', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntity2)
      .withDocumentation('doc')
      .withIntegerIdentity('Entity2Id', 'doc')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty(domainEntity1, 'doc')
      .withAssociationDomainEntityProperty(domainEntity2, 'doc')
      .withCommonProperty(commonName, 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartAssociationExtension(`${core}.${associationName}`)
      .withCommonExtensionOverrideProperty(`${core}.${commonName}`, 'doc', true, false)
      .withEndAssociationExtension()

      .withStartCommonExtension(`${core}.${commonName}`)
      .withBooleanProperty('ExtensionFlag', 'doc', false, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(core);
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (coreNamespace && extensionNamespace) {
      extensionNamespace.dependencies.push(coreNamespace);
    }

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    commonExtensionOverrideResolverEnhancer(metaEd);
  });

  it('should resolve common extension override for association extension', () => {
    const overrideProperty = metaEd.propertyIndex.common.find((p) => p.isExtensionOverride && p.metaEdName === commonName);

    const { referencedCommonExtension } = overrideProperty!.data.edfiApiSchema;
    expect(referencedCommonExtension.metaEdName).toBe(commonName);
    expect(referencedCommonExtension.namespace.namespaceName).toBe(extension);
  });
});

describe('when extension override property has collection modifier', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const commonName = 'CollectionCommon';
  const domainEntityName = 'CollectionEntity';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withIntegerIdentity('CollectionId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('EntityId', 'doc')
      .withCommonProperty(commonName, 'doc', true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${core}.${commonName}`, 'doc', true, true)
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${commonName}`)
      .withDecimalProperty('ExtensionAmount', 'doc', false, false, '10', '2')
      .withIntegerProperty('ExtensionCount', 'doc', true, true)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(core);
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (coreNamespace && extensionNamespace) {
      extensionNamespace.dependencies.push(coreNamespace);
    }

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    commonExtensionOverrideResolverEnhancer(metaEd);
  });

  it('should resolve collection common extension override correctly', () => {
    const overrideProperty = metaEd.propertyIndex.common.find(
      (p) => p.isExtensionOverride && p.metaEdName === commonName && p.isCollection,
    );
    expect(overrideProperty!.isCollection).toBe(true);

    const { referencedCommonExtension } = overrideProperty!.data.edfiApiSchema;
    expect(referencedCommonExtension.metaEdName).toBe(commonName);
  });
});

describe('when extension override property has no matching common extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const commonName = 'OrphanCommon';
  const domainEntityName = 'OrphanEntity';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withIntegerIdentity('OrphanId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('EntityId', 'doc')
      .withCommonProperty(commonName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${core}.${commonName}`, 'doc', true, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(core);
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (coreNamespace && extensionNamespace) {
      extensionNamespace.dependencies.push(coreNamespace);
    }

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    commonExtensionOverrideResolverEnhancer(metaEd);
  });

  it('should not set referencedCommonExtension when no matching extension found', () => {
    const overrideProperty = metaEd.propertyIndex.common.find((p) => p.isExtensionOverride && p.metaEdName === commonName);
    expect(overrideProperty!.data.edfiApiSchema.referencedCommonExtension).toBe(NoCommonExtension);
  });
});

describe('when multiple common extension override properties exist', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const common1 = 'FirstCommon';
  const common2 = 'SecondCommon';
  const domainEntityName = 'MultiEntity';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(common1)
      .withDocumentation('doc')
      .withIntegerIdentity('FirstId', 'doc')
      .withEndCommon()

      .withStartCommon(common2)
      .withDocumentation('doc')
      .withIntegerIdentity('SecondId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('EntityId', 'doc')
      .withCommonProperty(common1, 'doc', true, false)
      .withCommonProperty(common2, 'doc', false, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${core}.${common1}`, 'doc', true, false)
      .withCommonExtensionOverrideProperty(`${core}.${common2}`, 'doc', false, true)
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${common1}`)
      .withStringProperty('FirstExtensionProp', 'doc', false, false, '100')
      .withEndCommonExtension()

      .withStartCommonExtension(`${core}.${common2}`)
      .withDateProperty('SecondExtensionProp', 'doc', false, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(core);
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (coreNamespace && extensionNamespace) {
      extensionNamespace.dependencies.push(coreNamespace);
    }

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    commonExtensionOverrideResolverEnhancer(metaEd);
  });

  it('should resolve first common extension override correctly', () => {
    const firstOverrideProperty = metaEd.propertyIndex.common.find((p) => p.isExtensionOverride && p.metaEdName === common1);

    const referencedExtension = firstOverrideProperty!.data.edfiApiSchema.referencedCommonExtension;
    expect(referencedExtension.metaEdName).toBe(common1);
  });

  it('should resolve second common extension override correctly', () => {
    const secondOverrideProperty = metaEd.propertyIndex.common.find(
      (p) => p.isExtensionOverride && p.metaEdName === common2,
    );
    expect(secondOverrideProperty!.isCollection).toBe(true);
    const referencedExtension = secondOverrideProperty!.data.edfiApiSchema.referencedCommonExtension;
    expect(referencedExtension.metaEdName).toBe(common2);
  });

  it('should have total of 4 common properties (2 originals + 2 overrides)', () => {
    expect(metaEd.propertyIndex.common).toHaveLength(4);
    const overrideProperties = metaEd.propertyIndex.common.filter((p) => p.isExtensionOverride);
    const regularProperties = metaEd.propertyIndex.common.filter((p) => !p.isExtensionOverride);
    expect(overrideProperties).toHaveLength(2);
    expect(regularProperties).toHaveLength(2);
  });
});

describe('when there are no common extension override properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const commonName = 'RegularCommon';
  const domainEntityName = 'RegularEntity';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withIntegerIdentity('RegularId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('EntityId', 'doc')
      .withCommonProperty(commonName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${domainEntityName}`)
      .withStringProperty('RegularExtensionProp', 'doc', false, false, '50')
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${commonName}`)
      .withBooleanProperty('UnusedExtensionProp', 'doc', false, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const coreNamespace: Namespace | undefined = metaEd.namespace.get(core);
    const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extension);
    if (coreNamespace && extensionNamespace) {
      extensionNamespace.dependencies.push(coreNamespace);
    }

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    commonExtensionOverrideResolverEnhancer(metaEd);
  });

  it('should not modify any common properties when no extension overrides exist', () => {
    const commonProperties = metaEd.propertyIndex.common;
    expect(commonProperties).toHaveLength(1);

    const commonProperty = commonProperties[0];
    expect(commonProperty.isExtensionOverride).toBe(false);
    expect(commonProperty.data.edfiApiSchema.referencedCommonExtension).toBe(NoCommonExtension);
  });
});
