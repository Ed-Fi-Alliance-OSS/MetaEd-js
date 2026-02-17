// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  CommonBuilder,
  CommonExtensionBuilder,
  Namespace,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  commonReferenceEnhancer,
  domainEntityExtensionBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { EntityApiSchemaData, enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as commonExtensionOverrideResolverEnhancer } from '../../src/enhancer/CommonExtensionOverrideResolverEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as jsonSchemaForInsertEnhancer } from '../../src/enhancer/JsonSchemaForInsertEnhancer';
import { enhance } from '../../src/enhancer/CommonExtensionOverrideCollectorEnhancer';

describe('when domain entity extension has a collection common extension override', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const commonName = 'Address';
  const domainEntityName = 'Contact';
  let extensionNamespace: Namespace;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withIntegerIdentity('AddressId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('ContactId', 'doc')
      .withCommonProperty(commonName, 'doc', true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${core}.${commonName}`, 'doc', true, true)
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${commonName}`)
      .withStringProperty('Complex', 'doc', false, false, '255')
      .withBooleanProperty('OnBusRoute', 'doc', true, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const coreNamespace = metaEd.namespace.get(core) as Namespace;
    extensionNamespace = metaEd.namespace.get(extension) as Namespace;
    extensionNamespace.dependencies.push(coreNamespace);

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    domainEntityExtensionBaseClassEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    commonExtensionOverrideResolverEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaForInsertEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should produce one commonExtensionOverride with collection insertion location', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(domainEntityName)!;
    const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

    expect(entityApiSchemaData.commonExtensionOverrides).toHaveLength(1);

    const override = entityApiSchemaData.commonExtensionOverrides[0];
    expect(override.insertionLocations).toMatchInlineSnapshot(`
      Array [
        "$.properties.addresses.items",
      ]
    `);
    expect(override.projectEndpointName).toBe('ed-fi');
    expect(override.schemaFragment.type).toBe('object');
    expect(override.schemaFragment.properties).toBeDefined();
    const projectKey = Object.keys(override.schemaFragment.properties)[0];
    const projectFragment = override.schemaFragment.properties[projectKey] as { properties: Record<string, unknown> };
    expect(Object.keys(projectFragment.properties)).toContain('complex');
    expect(Object.keys(projectFragment.properties)).toContain('onBusRoute');
  });
});

describe('when domain entity extension has no common extension overrides', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const domainEntityName = 'Student';
  let extensionNamespace: Namespace;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('StudentId', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${domainEntityName}`)
      .withStringProperty('FavoriteColor', 'doc', false, false, '50')
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    const coreNamespace = metaEd.namespace.get(core) as Namespace;
    extensionNamespace = metaEd.namespace.get(extension) as Namespace;
    extensionNamespace.dependencies.push(coreNamespace);

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    domainEntityExtensionBaseClassEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    commonExtensionOverrideResolverEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaForInsertEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should produce empty commonExtensionOverrides array', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(domainEntityName)!;
    const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

    expect(entityApiSchemaData.commonExtensionOverrides).toEqual([]);
  });
});

describe('when domain entity extension has multiple common extension overrides', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const common1 = 'Address';
  const common2 = 'StudentCharacteristic';
  const domainEntityName = 'StudentEducationOrganizationAssociation';
  let extensionNamespace: Namespace;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(common1)
      .withDocumentation('doc')
      .withIntegerIdentity('AddressId', 'doc')
      .withEndCommon()

      .withStartCommon(common2)
      .withDocumentation('doc')
      .withIntegerIdentity('CharacteristicId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('AssociationId', 'doc')
      .withCommonProperty(common1, 'doc', true, true)
      .withCommonProperty(common2, 'doc', false, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${core}.${common1}`, 'doc', true, true)
      .withCommonExtensionOverrideProperty(`${core}.${common2}`, 'doc', false, true)
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${common1}`)
      .withStringProperty('Complex', 'doc', false, false, '255')
      .withEndCommonExtension()

      .withStartCommonExtension(`${core}.${common2}`)
      .withBooleanProperty('PrimaryIndicator', 'doc', false, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const coreNamespace = metaEd.namespace.get(core) as Namespace;
    extensionNamespace = metaEd.namespace.get(extension) as Namespace;
    extensionNamespace.dependencies.push(coreNamespace);

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    domainEntityExtensionBaseClassEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    commonExtensionOverrideResolverEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaForInsertEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should produce two commonExtensionOverrides', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(domainEntityName)!;
    const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

    expect(entityApiSchemaData.commonExtensionOverrides).toHaveLength(2);
  });

  it('should have correct insertion locations for both overrides', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(domainEntityName)!;
    const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

    const addressOverride = entityApiSchemaData.commonExtensionOverrides.find(
      (o) => o.insertionLocations[0] === '$.properties.addresses.items',
    );
    expect(addressOverride).toBeDefined();
    expect(addressOverride?.projectEndpointName).toBe('ed-fi');

    const characteristicOverride = entityApiSchemaData.commonExtensionOverrides.find(
      (o) => o.insertionLocations[0] === '$.properties.studentCharacteristics.items',
    );
    expect(characteristicOverride).toBeDefined();
    expect(characteristicOverride?.projectEndpointName).toBe('ed-fi');
  });
});

describe('when domain entity extension has a scalar common extension override', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const commonName = 'Name';
  const domainEntityName = 'Person';
  let extensionNamespace: Namespace;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withIntegerIdentity('NameId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('PersonId', 'doc')
      .withCommonProperty(commonName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${core}.${commonName}`, 'doc', true, false)
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${commonName}`)
      .withStringProperty('Suffix', 'doc', false, false, '50')
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const coreNamespace = metaEd.namespace.get(core) as Namespace;
    extensionNamespace = metaEd.namespace.get(extension) as Namespace;
    extensionNamespace.dependencies.push(coreNamespace);

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    domainEntityExtensionBaseClassEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    commonExtensionOverrideResolverEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaForInsertEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should produce one commonExtensionOverride with scalar insertion location', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(domainEntityName)!;
    const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

    expect(entityApiSchemaData.commonExtensionOverrides).toHaveLength(1);

    const override = entityApiSchemaData.commonExtensionOverrides[0];
    expect(override.insertionLocations).toMatchInlineSnapshot(`
      Array [
        "$.properties.name",
      ]
    `);
    expect(override.projectEndpointName).toBe('ed-fi');
    expect(override.schemaFragment).toBeDefined();
    expect(override.schemaFragment.type).toBe('object');
    const projectKey = Object.keys(override.schemaFragment.properties)[0];
    const projectFragment = override.schemaFragment.properties[projectKey] as { properties: Record<string, unknown> };
    expect(Object.keys(projectFragment.properties)).toContain('suffix');
  });
});
