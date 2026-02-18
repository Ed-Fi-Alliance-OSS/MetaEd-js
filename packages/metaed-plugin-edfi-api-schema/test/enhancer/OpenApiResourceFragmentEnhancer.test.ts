// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  DescriptorBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  descriptorReferenceEnhancer,
  domainEntityExtensionBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as namespaceSetupEnhancer } from '../../src/model/Namespace';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as resourceNameEnhancer } from '../../src/enhancer/ResourceNameEnhancer';
import { enhance as apiSchemaBuildingEnhancer } from '../../src/enhancer/ApiSchemaBuildingEnhancer';
import { enhance as openApiRequestBodyComponentEnhancer } from '../../src/enhancer/OpenApiRequestBodyComponentEnhancer';
import { enhance as openApiReferenceComponentEnhancer } from '../../src/enhancer/OpenApiReferenceComponentEnhancer';
import { enhance as resourceDomainEnhancer } from '../../src/enhancer/ResourceDomainEnhancer';
import { enhance as jsonSchemaForInsertEnhancer } from '../../src/enhancer/JsonSchemaForInsertEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from '../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { enhance as identityFullnameEnhancer } from '../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as typeCoercionJsonPathsEnhancer } from '../../src/enhancer/TypeCoercionJsonPathsEnhancer';
import { enhance } from '../../src/enhancer/OpenApiResourceFragmentEnhancer';
import { NamespaceEdfiApiSchema } from '../../src/model/Namespace';
import { OpenApiDocumentType } from '../../src/model/api-schema/OpenApiDocumentType';

function runPrerequisiteEnhancers(metaEd: MetaEdEnvironment) {
  namespaceSetupEnhancer(metaEd);
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);
  referenceComponentEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  apiEntityMappingEnhancer(metaEd);
  jsonSchemaForInsertEnhancer(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  mergeDirectiveEqualityConstraintEnhancer(metaEd);
  resourceNameEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  identityJsonPathsEnhancer(metaEd);
  typeCoercionJsonPathsEnhancer(metaEd);
  resourceDomainEnhancer(metaEd);
  openApiRequestBodyComponentEnhancer(metaEd);
  openApiReferenceComponentEnhancer(metaEd);
}

describe('OpenApiResourceFragmentEnhancer', () => {
  describe('when enhancing a domain entity', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';
    const domainEntityName = 'Student';
    let namespace: any = null;

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity(domainEntityName)
        .withDocumentation('A student')
        .withStringIdentity('StudentUniqueId', 'doc', '30', '20')
        .withBooleanProperty('Active', 'Is active', true, false)
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      runPrerequisiteEnhancers(metaEd);
      enhance(metaEd);

      namespace = metaEd.namespace.get(namespaceName);
    });

    it('should add openApiFragments to the entity data', () => {
      const student = namespace.entity.domainEntity.get('Student');
      const studentApiData = student.data.edfiApiSchema;

      expect(studentApiData).toBeDefined();
      expect(studentApiData.openApiFragments).toBeDefined();
      expect(studentApiData.openApiFragments[OpenApiDocumentType.RESOURCES]).toBeDefined();
    });

    it('should create a resources fragment with schemas, paths, and tags', () => {
      const student = namespace.entity.domainEntity.get('Student');
      const studentApiData = student.data.edfiApiSchema;
      const fragment = studentApiData.openApiFragments[OpenApiDocumentType.RESOURCES];

      expect(fragment).toBeDefined();
      expect(fragment?.components?.schemas).toBeDefined();
      expect(fragment?.components?.schemas?.EdFi_Student).toBeDefined();
      expect(fragment?.paths).toBeDefined();
      expect(fragment?.paths?.['/ed-fi/students']).toBeDefined();
      expect(fragment?.tags).toBeDefined();
      expect(fragment?.tags).toHaveLength(1);
      expect(fragment?.tags?.[0].name).toBe('students');
    });

    it('should not create a descriptors fragment for domain entities', () => {
      const student = namespace.entity.domainEntity.get('Student');
      const studentApiData = student.data.edfiApiSchema;
      const fragment = studentApiData.openApiFragments[OpenApiDocumentType.DESCRIPTORS];

      expect(fragment).toBeUndefined();
    });
  });

  describe('when enhancing a descriptor', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';
    const descriptorName = 'GradeLevel';
    let namespace: any = null;

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDescriptor(descriptorName)
        .withDocumentation('Grade level descriptor')
        .withEndDescriptor()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DescriptorBuilder(metaEd, []));

      descriptorReferenceEnhancer(metaEd);
      runPrerequisiteEnhancers(metaEd);
      enhance(metaEd);

      namespace = metaEd.namespace.get(namespaceName);
    });

    it('should create a descriptors fragment', () => {
      const descriptor = namespace.entity.descriptor.get('GradeLevel');
      const descriptorApiData = descriptor.data.edfiApiSchema;
      const fragment = descriptorApiData.openApiFragments[OpenApiDocumentType.DESCRIPTORS];

      expect(fragment).toBeDefined();
      expect(fragment?.components?.schemas).toBeDefined();
      expect(fragment?.components?.schemas?.EdFi_GradeLevelDescriptor).toBeDefined();
      expect(fragment?.paths).toBeDefined();
      expect(fragment?.paths?.['/ed-fi/gradeLevelDescriptors']).toBeDefined();
      expect(fragment?.tags).toBeDefined();
      expect(fragment?.tags).toHaveLength(1);
      expect(fragment?.tags?.[0].name).toBe('gradeLevelDescriptors');
    });

    it('should not create a resources fragment for descriptors', () => {
      const descriptor = namespace.entity.descriptor.get('GradeLevel');
      const descriptorApiData = descriptor.data.edfiApiSchema;
      const fragment = descriptorApiData.openApiFragments[OpenApiDocumentType.RESOURCES];

      expect(fragment).toBeUndefined();
    });
  });

  describe('when enhancing an abstract domain entity', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';
    const domainEntityName = 'EducationOrganization';
    let namespace: any = null;

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartAbstractEntity(domainEntityName)
        .withDocumentation('Base education organization')
        .withIntegerIdentity('EducationOrganizationId', 'doc')
        .withEndAbstractEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      runPrerequisiteEnhancers(metaEd);
      enhance(metaEd);

      namespace = metaEd.namespace.get(namespaceName);
    });

    it('should create a fragment with schemas but no paths or tags', () => {
      const abstractEntity = namespace.entity.domainEntity.get('EducationOrganization');
      const entityApiData = abstractEntity.data.edfiApiSchema;
      const fragment = entityApiData.openApiFragments?.[OpenApiDocumentType.RESOURCES];

      expect(fragment).toBeDefined();
      expect(fragment?.components?.schemas).toBeDefined();
      expect(fragment?.components?.schemas?.EdFi_EducationOrganization).toBeDefined();
      // Abstract entities have no paths or tags
      expect(fragment?.paths).toBeUndefined();
      expect(fragment?.tags).toBeUndefined();
    });
  });

  describe('when ApiSchemaBuildingEnhancer runs after fragments are created', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';
    const domainEntityName = 'School';
    let namespace: any = null;

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity(domainEntityName)
        .withDocumentation('A school')
        .withIntegerIdentity('SchoolId', 'doc')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      runPrerequisiteEnhancers(metaEd);
      enhance(metaEd);

      // Now run apiSchemaBuildingEnhancer after fragments are created
      apiSchemaBuildingEnhancer(metaEd);

      namespace = metaEd.namespace.get(namespaceName);
    });

    it('should copy openApiFragments from entity data to ResourceSchema', () => {
      const namespaceEdfiApiSchema = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;
      const { resourceSchemas } = namespaceEdfiApiSchema.apiSchema.projectSchema;

      // Find the school resource schema
      const schoolResourceSchema = Object.values(resourceSchemas).find((schema) => schema.resourceName === 'School');

      expect(schoolResourceSchema).toBeDefined();
      expect(schoolResourceSchema?.openApiFragments).toBeDefined();
      expect(schoolResourceSchema?.openApiFragments?.[OpenApiDocumentType.RESOURCES]).toBeDefined();

      // Verify the fragments contain the expected data
      const fragment = schoolResourceSchema?.openApiFragments?.[OpenApiDocumentType.RESOURCES];
      expect(fragment?.components?.schemas?.EdFi_School).toBeDefined();
      expect(fragment?.paths?.['/ed-fi/schools']).toBeDefined();
      expect(fragment?.tags?.[0].name).toBe('schools');
    });
  });

  describe('when enhancing an extension entity', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const coreNamespaceName = 'EdFi';
    const extensionNamespaceName = 'SampleExtension';
    const domainEntityName = 'Student';
    let extensionNamespace: any = null;

    beforeAll(() => {
      // Create core entity
      MetaEdTextBuilder.build()
        .withBeginNamespace(coreNamespaceName)
        .withStartDomainEntity(domainEntityName)
        .withDocumentation('A student')
        .withStringIdentity('StudentUniqueId', 'doc', '30', '20')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      // Create extension
      MetaEdTextBuilder.build()
        .withBeginNamespace(extensionNamespaceName)
        .withStartDomainEntityExtension(domainEntityName)
        .withDocumentation('Student extension')
        .withBooleanProperty('IsGifted', 'Is gifted', false, false)
        .withEndDomainEntityExtension()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

      const coreNamespace = metaEd.namespace.get(coreNamespaceName);
      extensionNamespace = metaEd.namespace.get(extensionNamespaceName);

      // Mark as extension by adding dependency
      extensionNamespace.dependencies.push(coreNamespace);

      domainEntityReferenceEnhancer(metaEd);
      domainEntityExtensionBaseClassEnhancer(metaEd);
      runPrerequisiteEnhancers(metaEd);
      enhance(metaEd);
    });

    it('should create extension fragments on entity data', () => {
      // Get the extension entity - it's named "Student" in the extension namespace
      const studentExtension = extensionNamespace.entity.domainEntityExtension.get('Student');
      expect(studentExtension).toBeDefined();

      // Check that the extension fragment is stored on the entity data
      const entityApiData = studentExtension.data.edfiApiSchema;
      expect(entityApiData.openApiFragments).toBeDefined();
      expect(entityApiData.openApiFragments.resources).toBeDefined();

      const fragment = entityApiData.openApiFragments.resources;
      expect(fragment).toBeDefined();
      expect(fragment?.components?.schemas).toBeDefined();

      // Extension with no real collected properties should not produce exts
      expect(fragment?.exts).toBeUndefined();
    });
  });

  describe('when testing projectEndpointName transformation', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'SpecialEducation';
    const domainEntityName = 'Student';
    let namespace: any = null;

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName, namespaceName)
        .withStartDomainEntity(domainEntityName)
        .withDocumentation('A student')
        .withStringIdentity('StudentUniqueId', 'doc', '30', '20')
        .withBooleanProperty('Active', 'Is active', true, false)
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      runPrerequisiteEnhancers(metaEd);
      enhance(metaEd);

      namespace = metaEd.namespace.get(namespaceName);
    });

    it('should create paths with special-education endpoint prefix', () => {
      const student = namespace.entity.domainEntity.get('Student');
      const studentApiData = student.data.edfiApiSchema;
      const fragment = studentApiData.openApiFragments[OpenApiDocumentType.RESOURCES];

      expect(fragment).toBeDefined();
      expect(fragment?.paths).toBeDefined();
      expect(fragment?.paths?.['/special-education/students']).toBeDefined();
      expect(fragment?.paths?.['/special-education/students/{id}']).toBeDefined();
    });
  });
});
