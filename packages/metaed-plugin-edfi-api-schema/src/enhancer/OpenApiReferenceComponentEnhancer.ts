// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, TopLevelEntity } from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import { OpenApiObject, OpenApiProperties, OpenApiProperty } from '../model/OpenApi';
import {
  ED_FI_DEPRECATED_EXTENSION_KEY,
  ED_FI_DEPRECATED_REASONS_EXTENSION_KEY,
  ED_FI_IDENTITY_EXTENSION_KEY,
  ED_FI_NULLABLE_EXTENSION_KEY,
} from '../model/OpenApiTypes';
import { defaultPropertyModifier, prefixedName } from '../model/PropertyModifier';
import { findIdenticalRoleNamePatternPrefix, prependPrefixWithCollapse, uncapitalize } from '../Utility';
import { FlattenedIdentityProperty } from '../model/FlattenedIdentityProperty';
import {
  isOpenApiPropertyRequired,
  newSchoolYearOpenApis,
  openApiObjectFrom,
  openApiPropertyForNonReference,
  SchoolYearOpenApis,
} from './OpenApiComponentEnhancerBase';
import { parentPropertyModifier } from './JsonElementNamingHelper';

const enhancerName = 'OpenApiReferenceComponentEnhancer';

/**
 * Returns an OpenApi object that specifies the reference component shape
 * corresponding to the given entity.
 */
function openApiReferenceComponentFor(entity: TopLevelEntity, schoolYearOpenApis: SchoolYearOpenApis): OpenApiObject {
  const openApiProperties: OpenApiProperties = {};
  const required: Set<string> = new Set();

  const referencedEntityApiMapping = (entity.data.edfiApiSchema as EntityApiSchemaData).apiMapping;

  // Ignore merges on references
  const flattenedIdentityPropertiesOmittingMerges = referencedEntityApiMapping.flattenedIdentityProperties.filter(
    (flattenedIdentityProperty: FlattenedIdentityProperty) => flattenedIdentityProperty.mergedAwayBy == null,
  );

  flattenedIdentityPropertiesOmittingMerges.forEach((flattenedIdentityProperty: FlattenedIdentityProperty) => {
    const identityPropertyApiMapping = (
      flattenedIdentityProperty.identityProperty.data.edfiApiSchema as EntityPropertyApiSchemaData
    ).apiMapping;

    const specialPrefix: string = findIdenticalRoleNamePatternPrefix(flattenedIdentityProperty);

    const adjustedName =
      specialPrefix === ''
        ? identityPropertyApiMapping.fullName
        : prependPrefixWithCollapse(identityPropertyApiMapping.fullName, specialPrefix);

    const parentAdjustedPropertyModifier = parentPropertyModifier(flattenedIdentityProperty, defaultPropertyModifier);

    const openApiPropertyName: string = uncapitalize(prefixedName(adjustedName, parentAdjustedPropertyModifier));

    // Because these are flattened, we know they are non-reference properties
    const openApiProperty: OpenApiProperty = openApiPropertyForNonReference(
      flattenedIdentityProperty.identityProperty,
      schoolYearOpenApis,
    );

    // Add x-Ed-Fi-isIdentity extension for identity properties
    openApiProperty[ED_FI_IDENTITY_EXTENSION_KEY] = true;
    // Add x-Ed-Fi-nullable extension for nullable identity properties
    if (flattenedIdentityProperty.identityProperty.isOptional) {
      openApiProperty[ED_FI_NULLABLE_EXTENSION_KEY] = true;
    }
    // Add x-Ed-Fi-deprecated extension for deprecated identity properties
    if (flattenedIdentityProperty.identityProperty.isDeprecated) {
      openApiProperty[ED_FI_DEPRECATED_EXTENSION_KEY] = true;
      openApiProperty[ED_FI_DEPRECATED_REASONS_EXTENSION_KEY] =
        flattenedIdentityProperty.identityProperty.data.edfiApiSchema.deprecationReasons;
    }

    // Note that this key/value usage of Object implicitly merges by overwrite if there is more than one scalar property
    // with the same name sourced from different identity reference properties. There is no need to check
    // properties for merge directive annotations because MetaEd has already validated merges and any scalar identity
    // property name duplication _must_ be a merge.
    openApiProperties[openApiPropertyName] = openApiProperty;

    if (isOpenApiPropertyRequired(flattenedIdentityProperty.identityProperty, defaultPropertyModifier)) {
      // As above, this usage of Set implicitly merges by overwrite
      required.add(openApiPropertyName);
    }
  });

  return openApiObjectFrom(openApiProperties, Array.from(required.values()));
}

/**
 * This enhancer uses the results of the ApiMappingEnhancer to create an OpenApiReferenceComponent
 * for each MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const schoolYearOpenApis: SchoolYearOpenApis = newSchoolYearOpenApis(metaEd.minSchoolYear, metaEd.maxSchoolYear);

  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      const entityApiOpenApiData = entity.data.edfiApiSchema as EntityApiSchemaData;
      entityApiOpenApiData.openApiReferenceComponent = openApiReferenceComponentFor(
        entity as TopLevelEntity,
        schoolYearOpenApis,
      );
      entityApiOpenApiData.openApiReferenceComponentPropertyName = `${entity.namespace.namespaceName}_${entity.metaEdName}_Reference`;
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
