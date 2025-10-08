// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  CommonBuilder,
  CommonExtensionBuilder,
  DomainEntityExtensionBuilder,
  DescriptorBuilder,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  commonReferenceEnhancer,
  commonSubclassBaseClassEnhancer,
  descriptorReferenceEnhancer,
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
import { enhance as flatteningColumnMetadataEnhancer } from '../../../src/enhancer/flattening/FlatteningColumnMetadataEnhancer';

function runApiSchemaEnhancers(metaEd: MetaEdEnvironment): void {
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

describe('FlatteningColumnAndReferenceDeriverEnhancer', () => {
  describe('when deriving scalar and collection columns', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';
    const domainEntityName = 'DomainEntityName';

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity(domainEntityName)
        .withDocumentation('doc')
        .withBooleanProperty('OptionalBooleanRoot', 'doc0', false, false)
        .withBooleanProperty('OptionalBooleanProperty', 'doc1', false, true)
        .withDecimalProperty('RequiredDecimalProperty', 'doc2', true, false, '3', '1')
        .withStringIdentity('StringIdentity', 'doc3', '32', '16')
        .withIntegerProperty('RequiredIntegerProperty', 'doc4', true, true, '10', '5')
        .withDescriptorProperty('EducationContent', 'doc5', false, false, 'EducationContent')
        .withEndDomainEntity()
        .withStartDescriptor('EducationContent')
        .withDocumentation('doc')
        .withEndDescriptor()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new DescriptorBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      descriptorReferenceEnhancer(metaEd);
      runApiSchemaEnhancers(metaEd);
      flatteningTableHierarchyEnhancer(metaEd);
      flatteningColumnMetadataEnhancer(metaEd);
    });

    it('populates scalar and collection columns with metadata and parent references', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
      expect(entity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "table": Object {
            "baseName": "DomainEntityName",
            "childTables": Array [
              Object {
                "baseName": "DomainEntityNameOptionalBooleanProperty",
                "childTables": Array [],
                "columns": Array [
                  Object {
                    "columnName": "OptionalBooleanProperty",
                    "columnType": "boolean",
                    "isRequired": false,
                    "jsonPath": "$.optionalBooleanProperties[*].optionalBooleanProperty",
                  },
                  Object {
                    "columnName": "DomainEntityName_Id",
                    "columnType": "bigint",
                    "isParentReference": true,
                    "isRequired": true,
                  },
                ],
                "jsonPath": "$.optionalBooleanProperties[*]",
              },
              Object {
                "baseName": "DomainEntityNameRequiredIntegerProperty",
                "childTables": Array [],
                "columns": Array [
                  Object {
                    "columnName": "RequiredIntegerProperty",
                    "columnType": "integer",
                    "isRequired": false,
                    "jsonPath": "$.requiredIntegerProperties[*].requiredIntegerProperty",
                  },
                  Object {
                    "columnName": "DomainEntityName_Id",
                    "columnType": "bigint",
                    "isParentReference": true,
                    "isRequired": true,
                  },
                ],
                "jsonPath": "$.requiredIntegerProperties[*]",
              },
            ],
            "columns": Array [
              Object {
                "columnName": "OptionalBooleanRoot",
                "columnType": "boolean",
                "isRequired": false,
                "jsonPath": "$.optionalBooleanRoot",
              },
              Object {
                "columnName": "RequiredDecimalProperty",
                "columnType": "decimal",
                "isRequired": true,
                "jsonPath": "$.requiredDecimalProperty",
                "precision": "3",
                "scale": "1",
              },
              Object {
                "columnName": "StringIdentity",
                "columnType": "string",
                "isNaturalKey": true,
                "isRequired": true,
                "jsonPath": "$.stringIdentity",
                "maxLength": "32",
              },
              Object {
                "columnName": "EducationContent",
                "columnType": "descriptor",
                "isRequired": false,
                "jsonPath": "$.educationContentDescriptor",
              },
            ],
            "jsonPath": "$",
          },
        }
      `);
    });
  });

  describe('when deriving reference and descriptor collection columns', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity('Assessment')
        .withDocumentation('doc')
        .withIntegerIdentity('AssessmentIdentifier', 'doc')
        .withCommonProperty('ContentStandard', 'doc', false, false)
        .withDescriptorProperty('GradeLevel', 'doc', false, true, 'Assessed')
        .withEndDomainEntity()

        .withStartCommon('ContentStandard')
        .withDocumentation('doc')
        .withStringProperty('Title', 'doc', false, false, '30')
        .withDomainEntityProperty('EducationOrganization', 'doc', false, false, false, 'Mandating')
        .withEndCommon()

        .withStartDomainEntity('EducationOrganization')
        .withDocumentation('doc')
        .withIntegerIdentity('EducationOrganizationId', 'doc')
        .withEndDomainEntity()

        .withStartDescriptor('GradeLevel')
        .withDocumentation('doc')
        .withEndDescriptor()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []))
        .sendToListener(new DescriptorBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      descriptorReferenceEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      runApiSchemaEnhancers(metaEd);
      flatteningTableHierarchyEnhancer(metaEd);
      flatteningColumnMetadataEnhancer(metaEd);
    });

    it('derives reference metadata with fromReferencePath and descriptor scalars', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
      expect(entity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "table": Object {
            "baseName": "Assessment",
            "childTables": Array [
              Object {
                "baseName": "AssessmentContentStandard",
                "childTables": Array [],
                "columns": Array [
                  Object {
                    "columnName": "Title",
                    "columnType": "string",
                    "isRequired": false,
                    "jsonPath": "$.contentStandard.title",
                    "maxLength": "30",
                  },
                  Object {
                    "columnName": "Mandating_EducationOrganization_Id",
                    "columnType": "bigint",
                    "fromReferencePath": "ContentStandard.MandatingEducationOrganization",
                    "isRequired": false,
                  },
                  Object {
                    "columnName": "Assessment_Id",
                    "columnType": "bigint",
                    "isParentReference": true,
                    "isRequired": true,
                  },
                ],
                "jsonPath": "$.contentStandard",
              },
              Object {
                "baseName": "AssessmentAssessedGradeLevel",
                "childTables": Array [],
                "columns": Array [
                  Object {
                    "columnName": "AssessedGradeLevel",
                    "columnType": "descriptor",
                    "isRequired": false,
                    "jsonPath": "$.assessedGradeLevels[*].gradeLevelDescriptor",
                  },
                  Object {
                    "columnName": "Assessment_Id",
                    "columnType": "bigint",
                    "isParentReference": true,
                    "isRequired": true,
                  },
                ],
                "jsonPath": "$.assessedGradeLevels[*]",
              },
            ],
            "columns": Array [
              Object {
                "columnName": "AssessmentIdentifier",
                "columnType": "integer",
                "isNaturalKey": true,
                "isRequired": true,
                "jsonPath": "$.assessmentIdentifier",
              },
            ],
            "jsonPath": "$",
          },
        }
      `);
    });
  });

  describe('when deriving columns for extension tables with reference overrides', () => {
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
        .withStartCommonExtension(`${coreNamespace}.${commonName}`)
        .withDocumentation('doc')
        .withIntegerProperty('ExtensionCount', 'doc', true, true)
        .withEndCommonExtension()
        .withStartDomainEntityExtension(`${coreNamespace}.${domainEntityName}`)
        .withCommonExtensionOverrideProperty(`${coreNamespace}.${commonName}`, 'doc', true, true)
        .withEndDomainEntityExtension()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []))
        .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
        .sendToListener(new CommonBuilder(metaEd, []))
        .sendToListener(new CommonExtensionBuilder(metaEd, []));

      const core = metaEd.namespace.get(coreNamespace);
      const extension = metaEd.namespace.get(extensionNamespace);
      if (core != null && extension != null) {
        extension.dependencies.push(core);
      }

      domainEntityReferenceEnhancer(metaEd);
      commonReferenceEnhancer(metaEd);
      commonSubclassBaseClassEnhancer(metaEd);
      domainEntityExtensionBaseClassEnhancer(metaEd);
      runApiSchemaEnhancers(metaEd);
      flatteningTableHierarchyEnhancer(metaEd);
      flatteningColumnMetadataEnhancer(metaEd);
    });

    it('emits columns for extension tables and maintains parent linkage', () => {
      const extensionNamespaceData = metaEd.namespace.get(extensionNamespace);
      const extensionEntity = extensionNamespaceData?.entity.domainEntityExtension.get(domainEntityName);
      expect(extensionEntity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "table": Object {
            "baseName": "CollectionEntityExtension",
            "childTables": Array [
              Object {
                "baseName": "CollectionEntityExtensionCollectionCommon",
                "childTables": Array [],
                "columns": Array [
                  Object {
                    "columnName": "CollectionId",
                    "columnType": "integer",
                    "isNaturalKey": true,
                    "isRequired": true,
                    "jsonPath": "$._ext.edfi.collectionCommons[*].collectionId",
                  },
                  Object {
                    "columnName": "CollectionEntityExtension_Id",
                    "columnType": "bigint",
                    "isParentReference": true,
                    "isRequired": true,
                  },
                ],
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
