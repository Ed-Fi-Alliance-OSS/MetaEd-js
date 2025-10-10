// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPlugin } from '@edfi/metaed-core';
import { enhancerList } from './enhancer/EnhancerList';
import { generate as apiSchemaGenerator } from './generator/ApiSchemaGenerator';
import {
  educationOrganizationIdentitySecurableElementsSchema,
  educationOrganizationSecurableElementsSchema,
} from './model/ConfigurationSchema';

export { enhance as entityApiSchemaDataSetupEnhancer } from './model/EntityApiSchemaData';
export { enhance as entityPropertyApiSchemaDataSetupEnhancer } from './model/EntityPropertyApiSchemaData';
export { enhance as apiEntityMappingEnhancer } from './enhancer/ApiEntityMappingEnhancer';
export { enhance as apiPropertyMappingEnhancer } from './enhancer/ApiPropertyMappingEnhancer';
export { enhance as mergeDirectiveEqualityConstraintEnhancer } from './enhancer/MergeDirectiveEqualityConstraintEnhancer';
export { enhance as allJsonPathsMappingEnhancer } from './enhancer/AllJsonPathsMappingEnhancer';
export { enhance as mergeJsonPathsMappingEnhancer } from './enhancer/MergeJsonPathsMappingEnhancer';
export { enhance as JsonSchemaForInsertEnhancer } from './enhancer/JsonSchemaForInsertEnhancer';
export { enhance as propertyCollectingEnhancer } from './enhancer/PropertyCollectingEnhancer';
export { enhance as referenceComponentEnhancer } from './enhancer/ReferenceComponentEnhancer';
export { enhance as subclassApiEntityMappingEnhancer } from './enhancer/SubclassApiEntityMappingEnhancer';
export { enhance as subclassPropertyCollectingEnhancer } from './enhancer/SubclassPropertyCollectingEnhancer';
export { enhance as subclassPropertyNamingCollisionEnhancer } from './enhancer/SubclassPropertyNamingCollisionEnhancer';
export { enhance as apiSchemaBuildingEnhancer } from './enhancer/ApiSchemaBuildingEnhancer';
export { enhance as flatteningTableMetadataEnhancer } from './enhancer/flattening/FlatteningTableMetadataEnhancer';
export { enhance as abstractResourceFlatteningMetadataEnhancer } from './enhancer/flattening/AbstractResourceFlatteningMetadataEnhancer';

export type { CollectedProperty } from './model/CollectedProperty';
export type { EntityApiSchemaData } from './model/EntityApiSchemaData';
export type { EntityPropertyApiSchemaData } from './model/EntityPropertyApiSchemaData';
export { prefixedName } from './model/PropertyModifier';
export { isReferenceElement } from './model/ReferenceComponent';
export type { ReferenceComponent, ReferenceGroup } from './model/ReferenceComponent';
export { topLevelApiNameOnEntity, pluralize, uncapitalize } from './Utility';
export type { ApiPropertyMapping } from './model/ApiPropertyMapping';
export type { EqualityConstraint } from './model/EqualityConstraint';

export function initialize(): MetaEdPlugin {
  const configurationSchemas = new Map();

  // Schema for direct property mapping rule
  configurationSchemas.set('educationOrganizationSecurableElements', educationOrganizationSecurableElementsSchema());

  // Schema for identity search rule
  configurationSchemas.set(
    'educationOrganizationIdentitySecurableElements',
    educationOrganizationIdentitySecurableElementsSchema(),
  );

  return {
    enhancer: enhancerList(),
    validator: [],
    generator: [apiSchemaGenerator],
    shortName: 'edfiApiSchema',
    configurationSchemas,
  };
}
