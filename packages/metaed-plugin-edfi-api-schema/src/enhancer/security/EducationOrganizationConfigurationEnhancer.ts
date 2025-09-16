// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  getAllEntitiesOfType,
  MetaEdPropertyPath,
  versionSatisfies,
  EntityProperty,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { JsonPathPropertyPair, JsonPathsInfo } from '../../model/JsonPathsMapping';

interface SecurableElementConfig {
  propertyPath: string;
  requiredIdentityProperty: string;
  description?: string;
}

interface SecurityConfiguration {
  versionRange?: string;
  mode?: 'append' | 'replace';
  securableElements: SecurableElementConfig[];
}

/**
 * Processes configuration-based education organization security elements.
 * Reads configuration from entity.config?.edfiApiSchema and applies direct property mappings
 * to educationOrganizationSecurableElements.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const enhancerName = 'EducationOrganizationConfigurationEnhancer';

  // Process all entity types that might have configuration
  (
    getAllEntitiesOfType(
      metaEd,
      'domainEntity',
      'association',
      'domainEntitySubclass',
      'associationSubclass',
      'domainEntityExtension',
      'associationExtension',
    ) as TopLevelEntity[]
  ).forEach((entity) => {
    // Check if entity has security configuration
    const securityConfig = entity.config?.edfiApiSchema as SecurityConfiguration | undefined;
    if (!securityConfig?.securableElements) {
      return;
    }

    // Check version constraint if specified
    if (securityConfig.versionRange && !versionSatisfies(metaEd.dataStandardVersion, securityConfig.versionRange)) {
      return;
    }

    const { allJsonPathsMapping, educationOrganizationSecurableElements } = entity.data.edfiApiSchema as EntityApiSchemaData;

    // Handle mode: replace clears existing elements
    if (securityConfig.mode === 'replace') {
      educationOrganizationSecurableElements.length = 0;
    }

    // Process each configured securable element
    securityConfig.securableElements.forEach((elementConfig) => {
      const jsonPathsInfo: JsonPathsInfo = allJsonPathsMapping[elementConfig.propertyPath as MetaEdPropertyPath];

      if (!jsonPathsInfo) {
        throw new Error(
          `${enhancerName}: Property '${elementConfig.propertyPath}' not found on entity '${entity.metaEdName}'`,
        );
      }

      // Find a mapping that includes the required identity property in the property chain
      const matchingPair: JsonPathPropertyPair | undefined = jsonPathsInfo.jsonPathPropertyPairs.find((jppp) => {
        const { sourceProperty, flattenedIdentityProperty } = jppp;
        const propertyChain: EntityProperty[] = [sourceProperty, ...flattenedIdentityProperty.propertyChain];
        return propertyChain.some((property) => property.fullPropertyName === elementConfig.requiredIdentityProperty);
      });

      if (matchingPair == null) {
        throw new Error(
          `${enhancerName}: Required identity property '${elementConfig.requiredIdentityProperty}' not found in '${elementConfig.propertyPath}' on entity '${entity.metaEdName}'`,
        );
      }

      // Add the security element
      educationOrganizationSecurableElements.push({
        metaEdName: matchingPair.sourceProperty.fullPropertyName,
        jsonPath: matchingPair.jsonPath,
      });
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
