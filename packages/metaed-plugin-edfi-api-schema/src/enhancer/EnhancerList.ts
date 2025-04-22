// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Enhancer } from '@edfi/metaed-core';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../model/EntityApiSchemaData';
import { enhance as namespaceSetupEnhancer } from '../model/Namespace';
import { enhance as subclassPropertyNamingCollisionEnhancer } from './SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from './ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from './ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from './ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from './SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from './PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from './SubclassPropertyCollectingEnhancer';
import { enhance as mergeCoveringFlattenedIdentityPropertyEnhancer } from './MergeCoveringFlattenedIdentityPropertyEnhancer';
import { enhance as jsonSchemaForInsertEnhancer } from './JsonSchemaForInsertEnhancer';
import { enhance as openApiReferenceComponentEnhancer } from './OpenApiReferenceComponentEnhancer';
import { enhance as openApiRequestBodyComponentEnhancer } from './OpenApiRequestBodyComponentEnhancer';
import { enhance as openApiRequestBodyCollectionComponentEnhancer } from './OpenApiRequestBodyCollectionComponentEnhancer';
import { enhance as openApiRequestBodyCollectionComponentSubclassEnhancer } from './OpenApiRequestBodyCollectionComponentSubclassEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from './AllJsonPathsMappingEnhancer';
import { enhance as mergeJsonPathsMappingEnhancer } from './MergeJsonPathsMappingEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from './MergeDirectiveEqualityConstraintEnhancer';
import { enhance as columnConflictEqualityConstraintEnhancer } from './ColumnConflictEqualityConstraintEnhancer';
import { enhance as resourceNameEnhancer } from './ResourceNameEnhancer';
import { enhance as identityFullnameEnhancer } from './IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from './SubclassIdentityFullnameEnhancer';
import { enhance as documentPathsMappingEnhancer } from './DocumentPathsMappingEnhancer';
import { enhance as identityJsonPathsEnhancer } from './IdentityJsonPathsEnhancer';
import { enhance as typeCoercionJsonPathsEnhancer } from './TypeCoercionJsonPathsEnhancer';
import { enhance as apiSchemaBuildingEnhancer } from './ApiSchemaBuildingEnhancer';
import { enhance as queryFieldMappingEnhancer } from './QueryFieldMappingEnhancer';
import { enhance as openApiCoreSpecificationEnhancer } from './OpenApiCoreSpecificationEnhancer';
import { enhance as openApiExtensionFragmentEnhancer } from './OpenApiExtensionFragmentEnhancer';
import { enhance as namespaceSecurableElementEnhancer } from './security/NamespaceSecurableElementEnhancer';
import { enhance as educationOrganizationSecurableElementEnhancer } from './security/EducationOrganizationSecurableElementEnhancer';
import { enhance as educationOrganizationHierarchyEnhancer } from './security/EducationOrganizationHierarchyEnhancer';
import { enhance as authorizationPathwayEnhancer } from './security/AuthorizationPathwayEnhancer';
import { enhance as studentSecurableElementEnhancer } from './security/StudentSecurableElementEnhancer';
import { enhance as contactSecurableElementEnhancer } from './security/ContactSecurableElementEnhancer';

export function enhancerList(): Enhancer[] {
  return [
    namespaceSetupEnhancer,
    entityPropertyApiSchemaDataSetupEnhancer,
    entityApiSchemaDataSetupEnhancer,
    subclassPropertyNamingCollisionEnhancer,
    referenceComponentEnhancer,
    apiPropertyMappingEnhancer,
    propertyCollectingEnhancer,
    subclassPropertyCollectingEnhancer,
    apiEntityMappingEnhancer,
    subclassApiEntityMappingEnhancer,
    mergeCoveringFlattenedIdentityPropertyEnhancer,
    resourceNameEnhancer,
    jsonSchemaForInsertEnhancer,
    openApiReferenceComponentEnhancer,
    openApiRequestBodyComponentEnhancer,
    openApiRequestBodyCollectionComponentEnhancer,
    openApiRequestBodyCollectionComponentSubclassEnhancer,
    allJsonPathsMappingEnhancer,
    mergeJsonPathsMappingEnhancer,
    mergeDirectiveEqualityConstraintEnhancer,
    columnConflictEqualityConstraintEnhancer,
    identityFullnameEnhancer,
    subclassIdentityFullnameEnhancer,
    documentPathsMappingEnhancer,
    queryFieldMappingEnhancer,
    identityJsonPathsEnhancer,
    typeCoercionJsonPathsEnhancer,
    openApiCoreSpecificationEnhancer,
    openApiExtensionFragmentEnhancer,
    namespaceSecurableElementEnhancer,
    educationOrganizationSecurableElementEnhancer,
    educationOrganizationHierarchyEnhancer,
    authorizationPathwayEnhancer,
    studentSecurableElementEnhancer,
    contactSecurableElementEnhancer,
    apiSchemaBuildingEnhancer,
  ];
}
