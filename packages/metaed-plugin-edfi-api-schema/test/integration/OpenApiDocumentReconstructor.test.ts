// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DomainEntityBuilder,
  DescriptorBuilder,
  EnumerationBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer, descriptorReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { enhance as namespaceSetupEnhancer } from '../../src/model/Namespace';
import { enhance as openApiBaseDocumentEnhancer } from '../../src/enhancer/OpenApiBaseDocumentEnhancer';
import { enhance as openApiResourceFragmentEnhancer } from '../../src/enhancer/OpenApiResourceFragmentEnhancer';
import { reconstructOpenApiDocument } from './OpenApiDocumentReconstructor';
import { OpenApiDocumentType } from '../../src/model/api-schema/OpenApiDocumentType';

// Import all the prerequisite enhancers needed for resource schema building
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as resourceNameEnhancer } from '../../src/enhancer/ResourceNameEnhancer';
import { enhance as apiSchemaBuildingEnhancer } from '../../src/enhancer/ApiSchemaBuildingEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from '../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { enhance as identityFullnameEnhancer } from '../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as typeCoercionJsonPathsEnhancer } from '../../src/enhancer/TypeCoercionJsonPathsEnhancer';
import { enhance as resourceDomainEnhancer } from '../../src/enhancer/ResourceDomainEnhancer';
import { enhance as openApiRequestBodyComponentEnhancer } from '../../src/enhancer/OpenApiRequestBodyComponentEnhancer';
import { enhance as openApiReferenceComponentEnhancer } from '../../src/enhancer/OpenApiReferenceComponentEnhancer';
import { enhance as jsonSchemaForInsertEnhancer } from '../../src/enhancer/JsonSchemaForInsertEnhancer';

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

describe('OpenApiDocumentReconstructor', () => {
  describe('reconstructOpenApiDocument', () => {
    describe('when reconstructing resources document', () => {
      const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
      metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
      const namespaceName = 'EdFi';
      let namespace: any = null;

      beforeAll(() => {
        // Create namespace with multiple entities
        MetaEdTextBuilder.build()
          .withBeginNamespace(namespaceName)
          .withStartEnumeration('SchoolYear')
          .withDocumentation('doc')
          .withEnumerationItem('2022')
          .withEndEnumeration()
          .withStartDomainEntity('Student')
          .withDocumentation('A student')
          .withStringIdentity('StudentUniqueId', 'doc', '30', '20')
          .withBooleanProperty('Active', 'Is active', true, false)
          .withEndDomainEntity()
          .withStartDomainEntity('School')
          .withDocumentation('A school')
          .withIntegerIdentity('SchoolId', 'doc')
          .withStringProperty('Name', 'School name', true, false, '100')
          .withEndDomainEntity()
          .withEndNamespace()
          .sendToListener(new NamespaceBuilder(metaEd, []))
          .sendToListener(new EnumerationBuilder(metaEd, []))
          .sendToListener(new DomainEntityBuilder(metaEd, []));

        domainEntityReferenceEnhancer(metaEd);
        runPrerequisiteEnhancers(metaEd);
        openApiBaseDocumentEnhancer(metaEd);
        openApiResourceFragmentEnhancer(metaEd);
        apiSchemaBuildingEnhancer(metaEd);

        namespace = metaEd.namespace.get(namespaceName);
      });

      it('should reconstruct resources document with all fragments', () => {
        const reconstructed = reconstructOpenApiDocument(namespace, OpenApiDocumentType.RESOURCES);

        expect(reconstructed).toBeDefined();
        expect(reconstructed?.openapi).toBe('3.0.0');
        expect(reconstructed?.info?.title).toBe('Ed-Fi Data Management Service API');

        // Should have paths from both entities
        expect(reconstructed?.paths).toBeDefined();
        expect(reconstructed?.paths?.['/edfi/students']).toBeDefined();
        expect(reconstructed?.paths?.['/edfi/students/{id}']).toBeDefined();
        expect(reconstructed?.paths?.['/edfi/schools']).toBeDefined();
        expect(reconstructed?.paths?.['/edfi/schools/{id}']).toBeDefined();

        // Should have schemas from both entities
        expect(reconstructed?.components?.schemas).toBeDefined();
        expect(reconstructed?.components?.schemas?.EdFi_Student).toBeDefined();
        expect(reconstructed?.components?.schemas?.EdFi_School).toBeDefined();

        // Should have tags from both entities plus schoolYearTypes, sorted
        expect(reconstructed?.tags).toBeDefined();
        expect(reconstructed?.tags).toHaveLength(3);
        expect(reconstructed?.tags?.[0].name).toBe('schools');
        expect(reconstructed?.tags?.[1].name).toBe('schoolYearTypes');
        expect(reconstructed?.tags?.[2].name).toBe('students');

        // Should have base document components
        expect(reconstructed?.components?.parameters?.['If-None-Match']).toBeDefined();
        expect(reconstructed?.components?.responses?.Created).toBeDefined();
      });

      it('should not include descriptor fragments in resources document', () => {
        const reconstructed = reconstructOpenApiDocument(namespace, OpenApiDocumentType.RESOURCES);

        // Should not have any descriptor-related paths or schemas
        expect(Object.keys(reconstructed?.paths || {}).some((path) => path.includes('Descriptor'))).toBe(false);
        expect(Object.keys(reconstructed?.components?.schemas || {}).some((schema) => schema.includes('Descriptor'))).toBe(
          false,
        );
      });
    });

    describe('when reconstructing descriptors document', () => {
      const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
      metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
      const namespaceName = 'EdFi';
      let namespace: any = null;

      beforeAll(() => {
        // Create namespace with descriptors
        MetaEdTextBuilder.build()
          .withBeginNamespace(namespaceName)
          .withStartDescriptor('GradeLevel')
          .withDocumentation('Grade level descriptor')
          .withEndDescriptor()
          .withStartDescriptor('AcademicSubject')
          .withDocumentation('Academic subject descriptor')
          .withEndDescriptor()
          .withEndNamespace()
          .sendToListener(new NamespaceBuilder(metaEd, []))
          .sendToListener(new DescriptorBuilder(metaEd, []));

        descriptorReferenceEnhancer(metaEd);
        runPrerequisiteEnhancers(metaEd);
        openApiBaseDocumentEnhancer(metaEd);
        openApiResourceFragmentEnhancer(metaEd);
        apiSchemaBuildingEnhancer(metaEd);

        namespace = metaEd.namespace.get(namespaceName);
      });

      it('should reconstruct descriptors document with all fragments', () => {
        const reconstructed = reconstructOpenApiDocument(namespace, OpenApiDocumentType.DESCRIPTORS);

        expect(reconstructed).toBeDefined();
        expect(reconstructed?.openapi).toBe('3.0.0');

        // Should have paths from both descriptors
        expect(reconstructed?.paths).toBeDefined();
        expect(reconstructed?.paths?.['/edfi/gradeLevelDescriptors']).toBeDefined();
        expect(reconstructed?.paths?.['/edfi/gradeLevelDescriptors/{id}']).toBeDefined();
        expect(reconstructed?.paths?.['/edfi/academicSubjectDescriptors']).toBeDefined();
        expect(reconstructed?.paths?.['/edfi/academicSubjectDescriptors/{id}']).toBeDefined();

        // Should have schemas from both descriptors
        expect(reconstructed?.components?.schemas).toBeDefined();
        expect(reconstructed?.components?.schemas?.EdFi_GradeLevelDescriptor).toBeDefined();
        expect(reconstructed?.components?.schemas?.EdFi_AcademicSubjectDescriptor).toBeDefined();

        // Should have tags from both descriptors, sorted
        expect(reconstructed?.tags).toBeDefined();
        expect(reconstructed?.tags).toHaveLength(2);
        expect(reconstructed?.tags?.[0].name).toBe('academicSubjectDescriptors');
        expect(reconstructed?.tags?.[1].name).toBe('gradeLevelDescriptors');
      });
    });

    describe('when namespace has no base document', () => {
      const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
      metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
      const namespaceName = 'Extension';
      let namespace: any = null;

      beforeAll(() => {
        // Create extension namespace (no base documents)
        MetaEdTextBuilder.build()
          .withBeginNamespace(namespaceName)
          .withStartDomainEntity('ExtensionEntity')
          .withDocumentation('An extension entity')
          .withStringIdentity('Id', 'doc', '30', '20')
          .withEndDomainEntity()
          .withEndNamespace()
          .sendToListener(new NamespaceBuilder(metaEd, []))
          .sendToListener(new DomainEntityBuilder(metaEd, []));

        // Mark as extension
        namespace = metaEd.namespace.get(namespaceName);
        namespace.isExtension = true;

        domainEntityReferenceEnhancer(metaEd);
        runPrerequisiteEnhancers(metaEd);
        openApiBaseDocumentEnhancer(metaEd);
        openApiResourceFragmentEnhancer(metaEd);
      });

      it('should return undefined when no base document exists', () => {
        const reconstructed = reconstructOpenApiDocument(namespace, OpenApiDocumentType.RESOURCES);
        expect(reconstructed).toBeUndefined();
      });
    });
  });
});
