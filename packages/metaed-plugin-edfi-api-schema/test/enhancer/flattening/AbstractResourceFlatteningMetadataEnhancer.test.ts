// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  AssociationBuilder,
  AssociationSubclassBuilder,
  DomainEntityBuilder,
  DomainEntitySubclassBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import {
  associationReferenceEnhancer,
  associationSubclassBaseClassEnhancer,
  choiceReferenceEnhancer,
  commonReferenceEnhancer,
  commonSubclassBaseClassEnhancer,
  descriptorReferenceEnhancer,
  domainEntityReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  enumerationReferenceEnhancer,
  inlineCommonReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as namespaceSetupEnhancer } from '../../../src/model/Namespace';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../../src/model/EntityPropertyApiSchemaData';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeJsonPathsMappingEnhancer } from '../../../src/enhancer/MergeJsonPathsMappingEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from '../../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { enhance as resourceNameEnhancer } from '../../../src/enhancer/ResourceNameEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as identityFullnameEnhancer } from '../../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance as decimalPropertyValidationInfoEnhancer } from '../../../src/enhancer/DecimalPropertyValidationInfoEnhancer';
import { enhance as typeCoercionJsonPathsEnhancer } from '../../../src/enhancer/TypeCoercionJsonPathsEnhancer';
import { enhance as jsonSchemaForInsertEnhancer } from '../../../src/enhancer/JsonSchemaForInsertEnhancer';
import { enhance as mergeCoveringFlattenedIdentityPropertyEnhancer } from '../../../src/enhancer/MergeCoveringFlattenedIdentityPropertyEnhancer';
import { enhance as commonExtensionOverrideResolverEnhancer } from '../../../src/enhancer/CommonExtensionOverrideResolverEnhancer';
import { enhance as flatteningTableMetadataEnhancer } from '../../../src/enhancer/flattening/FlatteningTableMetadataEnhancer';
import { enhance as flatteningAbstractResourceConsolidatorEnhancer } from '../../../src/enhancer/flattening/AbstractResourceFlatteningMetadataEnhancer';
import { enhance as apiSchemaBuildingEnhancer } from '../../../src/enhancer/ApiSchemaBuildingEnhancer';
import { enhance as namespaceDomainEnhancer } from '../../../src/enhancer/NamespaceDomainEnhancer';
import { enhance as resourceDomainEnhancer } from '../../../src/enhancer/ResourceDomainEnhancer';

function runApiSchemaPrerequisites(metaEd: MetaEdEnvironment): void {
  namespaceSetupEnhancer(metaEd);
  namespaceDomainEnhancer(metaEd);
  resourceDomainEnhancer(metaEd);
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);
  subclassPropertyNamingCollisionEnhancer(metaEd);
  referenceComponentEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  subclassPropertyCollectingEnhancer(metaEd);
  apiEntityMappingEnhancer(metaEd);
  subclassApiEntityMappingEnhancer(metaEd);
  mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
  jsonSchemaForInsertEnhancer(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  mergeJsonPathsMappingEnhancer(metaEd);
  mergeDirectiveEqualityConstraintEnhancer(metaEd);
  resourceNameEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  identityJsonPathsEnhancer(metaEd);
  decimalPropertyValidationInfoEnhancer(metaEd);
  typeCoercionJsonPathsEnhancer(metaEd);
  commonExtensionOverrideResolverEnhancer(metaEd);
}

function runFlatteningSequence(metaEd: MetaEdEnvironment): void {
  runApiSchemaPrerequisites(metaEd);
  flatteningTableMetadataEnhancer(metaEd);
  flatteningAbstractResourceConsolidatorEnhancer(metaEd);
}

describe('FlatteningAbstractResourceConsolidatorEnhancer', () => {
  describe('when abstract entity owns multiple concrete subclasses', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartAbstractEntity('EducationOrganization')
        .withDocumentation('doc')
        .withIntegerIdentity('EducationOrganizationId', 'doc')
        .withEndAbstractEntity()

        .withStartDomainEntitySubclass('School', 'EducationOrganization')
        .withDocumentation('doc')
        .withIntegerIdentityRename('SchoolId', 'EducationOrganizationId', 'doc')
        .withEndDomainEntitySubclass()

        .withStartDomainEntitySubclass('LocalEducationAgency', 'EducationOrganization')
        .withDocumentation('doc')
        .withIntegerIdentityRename('LocalEducationAgencyId', 'EducationOrganizationId', 'doc')
        .withEndDomainEntitySubclass()

        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      associationReferenceEnhancer(metaEd);
      choiceReferenceEnhancer(metaEd);
      inlineCommonReferenceEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      commonSubclassBaseClassEnhancer(metaEd);
      descriptorReferenceEnhancer(metaEd);
      enumerationReferenceEnhancer(metaEd);
      domainEntitySubclassBaseClassEnhancer(metaEd);
      associationSubclassBaseClassEnhancer(metaEd);

      runFlatteningSequence(metaEd);
      apiSchemaBuildingEnhancer(metaEd);
    });

    it('records subclass endpoint names sorted deterministically', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('EducationOrganization');
      expect(entity?.data.edfiApiSchema.abstractResourceFlatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "subclassTypes": Array [
            "localEducationAgencies",
            "schools",
          ],
          "unionViewName": "EducationOrganization",
        }
      `);

      const projectSchema = metaEd.namespace.get(namespaceName)?.data.edfiApiSchema.apiSchema.projectSchema;
      expect(projectSchema?.abstractResources?.EducationOrganization?.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "subclassTypes": Array [
            "localEducationAgencies",
            "schools",
          ],
          "unionViewName": "EducationOrganization",
        }
      `);
    });
  });

  describe('when subclass originates from a dependent namespace', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const coreNamespaceName = 'EdFi';
    const extensionNamespaceName = 'Sample';

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(coreNamespaceName)
        .withStartAbstractEntity('EducationOrganization')
        .withDocumentation('doc')
        .withIntegerIdentity('EducationOrganizationId', 'doc')
        .withEndAbstractEntity()
        .withEndNamespace()

        .withBeginNamespace(extensionNamespaceName)
        .withStartDomainEntitySubclass('SampleSchool', `${coreNamespaceName}.EducationOrganization`)
        .withDocumentation('doc')
        .withIntegerIdentityRename('SampleSchoolId', 'EducationOrganizationId', 'doc')
        .withEndDomainEntitySubclass()
        .withEndNamespace()

        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

      const coreNamespace = metaEd.namespace.get(coreNamespaceName);
      const extensionNamespace = metaEd.namespace.get(extensionNamespaceName);
      if (coreNamespace != null && extensionNamespace != null) {
        extensionNamespace.dependencies.push(coreNamespace);
      }

      domainEntityReferenceEnhancer(metaEd);
      associationReferenceEnhancer(metaEd);
      choiceReferenceEnhancer(metaEd);
      inlineCommonReferenceEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      commonSubclassBaseClassEnhancer(metaEd);
      descriptorReferenceEnhancer(metaEd);
      enumerationReferenceEnhancer(metaEd);
      domainEntitySubclassBaseClassEnhancer(metaEd);
      associationSubclassBaseClassEnhancer(metaEd);

      runFlatteningSequence(metaEd);
      apiSchemaBuildingEnhancer(metaEd);
    });

    it('aggregates endpoint names across namespaces without duplication', () => {
      const entity = metaEd.namespace.get(coreNamespaceName)?.entity.domainEntity.get('EducationOrganization');
      expect(entity?.data.edfiApiSchema.abstractResourceFlatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "subclassTypes": Array [
            "sampleSchools",
          ],
          "unionViewName": "EducationOrganization",
        }
      `);

      const projectSchema = metaEd.namespace.get(coreNamespaceName)?.data.edfiApiSchema.apiSchema.projectSchema;
      expect(projectSchema?.abstractResources?.EducationOrganization?.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "subclassTypes": Array [
            "sampleSchools",
          ],
          "unionViewName": "EducationOrganization",
        }
      `);
    });
  });

  describe('when entity is not abstract', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity('Student')
        .withDocumentation('doc')
        .withStringIdentity('StudentUniqueId', 'doc', '32')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      associationReferenceEnhancer(metaEd);
      choiceReferenceEnhancer(metaEd);
      inlineCommonReferenceEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      commonSubclassBaseClassEnhancer(metaEd);
      descriptorReferenceEnhancer(metaEd);
      enumerationReferenceEnhancer(metaEd);
      domainEntitySubclassBaseClassEnhancer(metaEd);
      associationSubclassBaseClassEnhancer(metaEd);

      runFlatteningSequence(metaEd);
      apiSchemaBuildingEnhancer(metaEd);
    });

    it('does not attach flattening metadata', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Student');
      expect(entity?.data.edfiApiSchema.abstractResourceFlatteningMetadata).toBeUndefined();
    });
  });

  describe('when processing GeneralStudentProgramAssociation hierarchy', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartAssociation('GeneralStudentProgramAssociation')
        .withDocumentation('doc')
        .withAssociationDomainEntityProperty('School', 'doc')
        .withAssociationDomainEntityProperty('Program', 'doc')
        .withDateIdentity('BeginDate', 'doc')
        .withEndAssociation()

        .withStartAssociationSubclass('StudentProgramAssociation', 'GeneralStudentProgramAssociation')
        .withDocumentation('doc')
        .withIntegerProperty('SubclassProperty', 'doc', true, false)
        .withEndAssociationSubclass()

        .withStartDomainEntity('School')
        .withDocumentation('doc')
        .withIntegerIdentity('SchoolId', 'doc')
        .withStringIdentity('SchoolName', 'doc', '30')
        .withEndDomainEntity()

        .withStartDomainEntity('Program')
        .withDocumentation('doc')
        .withIntegerIdentity('ProgramId', 'doc')
        .withStringIdentity('ProgramName', 'doc', '30')
        .withEndDomainEntity()

        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new AssociationBuilder(metaEd, []))
        .sendToListener(new AssociationSubclassBuilder(metaEd, []));

      associationReferenceEnhancer(metaEd);
      associationSubclassBaseClassEnhancer(metaEd);
      domainEntityReferenceEnhancer(metaEd);
      choiceReferenceEnhancer(metaEd);
      inlineCommonReferenceEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      commonSubclassBaseClassEnhancer(metaEd);
      descriptorReferenceEnhancer(metaEd);
      enumerationReferenceEnhancer(metaEd);
      domainEntitySubclassBaseClassEnhancer(metaEd);

      runFlatteningSequence(metaEd);
    });

    it('captures subclass endpoints and union view for pseudo-abstract association', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.association.get('GeneralStudentProgramAssociation');
      expect(entity?.data.edfiApiSchema.abstractResourceFlatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "subclassTypes": Array [
            "studentProgramAssociations",
          ],
          "unionViewName": "GeneralStudentProgramAssociation",
        }
      `);
    });
  });
});
