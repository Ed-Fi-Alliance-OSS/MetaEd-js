// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  CommonBuilder,
  DomainEntityExtensionBuilder,
  newMetaEdEnvironment,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  associationReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonReferenceEnhancer,
  commonSubclassBaseClassEnhancer,
  descriptorReferenceEnhancer,
  enumerationReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  domainEntityExtensionBaseClassEnhancer,
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
import { enhance as documentPathsMappingEnhancer } from '../../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as mergeCoveringFlattenedIdentityPropertyEnhancer } from '../../../src/enhancer/MergeCoveringFlattenedIdentityPropertyEnhancer';
import { enhance as jsonSchemaForInsertEnhancer } from '../../../src/enhancer/JsonSchemaForInsertEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from '../../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { enhance as resourceNameEnhancer } from '../../../src/enhancer/ResourceNameEnhancer';
import { enhance as identityFullnameEnhancer } from '../../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance as decimalPropertyValidationInfoEnhancer } from '../../../src/enhancer/DecimalPropertyValidationInfoEnhancer';
import { enhance as typeCoercionJsonPathsEnhancer } from '../../../src/enhancer/TypeCoercionJsonPathsEnhancer';
import { enhance as commonExtensionOverrideResolverEnhancer } from '../../../src/enhancer/CommonExtensionOverrideResolverEnhancer';
import { enhance as flatteningTableHierarchyEnhancer } from '../../../src/enhancer/flattening/FlatteningTableHierarchyEnhancer';

function runApiSchemaPrerequisites(metaEd: MetaEdEnvironment): void {
  namespaceSetupEnhancer(metaEd);
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

describe('FlatteningStructureAssemblerEnhancer', () => {
  describe('when resource contains scalar collections', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';
    const entityName = 'DomainEntityName';

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity(entityName)
        .withDocumentation('doc')
        .withBooleanProperty('OptionalBooleanProperty', 'doc', false, true)
        .withStringProperty('OptionalStringProperty', 'doc', false, false, '30')
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
      domainEntityExtensionBaseClassEnhancer(metaEd);

      runApiSchemaPrerequisites(metaEd);
      flatteningTableHierarchyEnhancer(metaEd);
    });

    it('produces a root table with a scalar collection child', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(entityName);
      expect(entity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "table": Object {
            "baseName": "DomainEntityName",
            "childTables": Array [
              Object {
                "baseName": "DomainEntityNameOptionalBooleanProperty",
                "childTables": Array [],
                "columns": Array [],
                "jsonPath": "$.optionalBooleanProperties[*]",
              },
            ],
            "columns": Array [],
            "jsonPath": "$",
          },
        }
      `);
    });
  });

  describe('when resource contains a singular common property', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';
    const entityName = 'Assessment';

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity(entityName)
        .withDocumentation('doc')
        .withIntegerIdentity('AssessmentIdentifier', 'doc')
        .withCommonProperty('ContentStandard', 'doc', false, false)
        .withEndDomainEntity()
        .withStartCommon('ContentStandard')
        .withDocumentation('doc')
        .withStringProperty('Title', 'doc', false, false, '30')
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []))
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
      domainEntityExtensionBaseClassEnhancer(metaEd);

      runApiSchemaPrerequisites(metaEd);
      flatteningTableHierarchyEnhancer(metaEd);
    });

    it('creates a child table for the common property with the correct jsonPath', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(entityName);
      expect(entity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "table": Object {
            "baseName": "Assessment",
            "childTables": Array [
              Object {
                "baseName": "AssessmentContentStandard",
                "childTables": Array [],
                "columns": Array [],
                "jsonPath": "$.contentStandard",
              },
            ],
            "columns": Array [],
            "jsonPath": "$",
          },
        }
      `);
    });
  });

  describe('when resource contains nested collection commons', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';
    const entityName = 'StudentEducationOrganizationAssociation';

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity(entityName)
        .withDocumentation('doc')
        .withIntegerIdentity('StudentId', 'doc')
        .withCommonProperty('Address', 'doc', false, true)
        .withEndDomainEntity()
        .withStartCommon('Address')
        .withDocumentation('doc')
        .withStringProperty('StreetNumberName', 'doc', true, false, '30')
        .withCommonProperty('Period', 'doc', false, true)
        .withEndCommon()
        .withStartCommon('Period')
        .withDocumentation('doc')
        .withIntegerIdentity('BeginDate', 'doc')
        .withIntegerProperty('EndDate', 'doc', false, false)
        .withEndCommon()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []))
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
      domainEntityExtensionBaseClassEnhancer(metaEd);

      runApiSchemaPrerequisites(metaEd);
      flatteningTableHierarchyEnhancer(metaEd);
    });

    it('nests child tables to mirror the collection hierarchy', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(entityName);
      expect(entity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "table": Object {
            "baseName": "StudentEducationOrganizationAssociation",
            "childTables": Array [
              Object {
                "baseName": "StudentEducationOrganizationAssociationAddress",
                "childTables": Array [
                  Object {
                    "baseName": "StudentEducationOrganizationAssociationAddressPeriod",
                    "childTables": Array [],
                    "columns": Array [],
                    "jsonPath": "$.addresses[*].periods[*]",
                  },
                ],
                "columns": Array [],
                "jsonPath": "$.addresses[*]",
              },
            ],
            "columns": Array [],
            "jsonPath": "$",
          },
        }
      `);
    });
  });

  describe('when processing extension overrides', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const coreNamespace = 'EdFi';
    const extensionNamespace = 'Extension';
    const domainEntityName = 'CollectionEntity';
    const commonName = 'CollectionCommon';

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(coreNamespace)
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
        .withBeginNamespace(extensionNamespace)
        .withStartDomainEntityExtension(`${coreNamespace}.${domainEntityName}`)
        .withCommonExtensionOverrideProperty(`${coreNamespace}.${commonName}`, 'doc', true, true)
        .withEndDomainEntityExtension()
        .withStartCommonExtension(`${coreNamespace}.${commonName}`)
        .withIntegerProperty('ExtensionCount', 'doc', true, true)
        .withEndCommonExtension()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []));

      const core = metaEd.namespace.get(coreNamespace);
      const extension = metaEd.namespace.get(extensionNamespace);
      if (core != null && extension != null) {
        extension.dependencies.push(core);
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
      domainEntityExtensionBaseClassEnhancer(metaEd);

      runApiSchemaPrerequisites(metaEd);
      flatteningTableHierarchyEnhancer(metaEd);
    });

    it('marks extension tables and preserves extension jsonPaths', () => {
      const extensionEntity = metaEd.namespace.get(extensionNamespace)?.entity.domainEntityExtension.get(domainEntityName);
      expect(extensionEntity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "table": Object {
            "baseName": "CollectionEntityExtension",
            "childTables": Array [
              Object {
                "baseName": "CollectionEntityExtensionCollectionCommon",
                "childTables": Array [],
                "columns": Array [],
                "isExtensionTable": true,
                "jsonPath": "$._ext.edfi.collectionCommons[*]",
              },
            ],
            "columns": Array [],
            "isExtensionTable": true,
            "jsonPath": "$",
          },
        }
      `);
    });
  });
});
