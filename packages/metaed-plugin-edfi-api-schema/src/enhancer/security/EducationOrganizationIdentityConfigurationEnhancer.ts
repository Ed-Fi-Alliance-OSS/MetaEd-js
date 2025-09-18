// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EnhancerResult,
  Namespace,
  TopLevelEntity,
  getAllEntitiesOfType,
  MetaEdPropertyFullName,
  versionSatisfies,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { JsonPath } from '../../model/api-schema/JsonPath';
import { EducationOrganizationSecurableElement } from '../../model/api-schema/EducationOrganizationSecurableElement';
import { EducationOrganizationIdentitySecurableElementsConfig } from '../../model/ConfigurationSchema';
import { JsonPathPropertyPair, JsonPathsInfo } from '../../model/JsonPathsMapping';

/**
 * Processes configuration-based education organization identity security elements.
 * Searches all identity properties to discover security elements based on role names.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const enhancerName = 'EducationOrganizationIdentityConfigurationEnhancer';

  // Get EducationOrganization and its subclasses for validation
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (!coreNamespace) {
    return { enhancerName, success: false };
  }

  const edfiEducationOrganization = coreNamespace.entity.domainEntity.get('EducationOrganization');
  if (!edfiEducationOrganization) {
    throw new Error(`${enhancerName}: Fatal Error: EducationOrganization not found in EdFi namespace`);
  }

  const allEducationOrganizations: TopLevelEntity[] = [...edfiEducationOrganization.subclassedBy, edfiEducationOrganization];

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
    // Check if entity has identity security configuration
    const securableElementsConfig = entity.config?.edfiApiSchema as
      | EducationOrganizationIdentitySecurableElementsConfig
      | undefined;
    if (!securableElementsConfig?.roleName) {
      return;
    }

    // Check version constraint if specified
    if (
      securableElementsConfig.versionRange &&
      !versionSatisfies(metaEd.dataStandardVersion, securableElementsConfig.versionRange)
    ) {
      return;
    }

    const { identityFullnames, allJsonPathsMapping, educationOrganizationSecurableElements } = entity.data
      .edfiApiSchema as EntityApiSchemaData;

    // Use Map to deduplicate by JsonPath
    const results = new Map<JsonPath, EducationOrganizationSecurableElement>();

    // Search all identity properties for matching role names
    identityFullnames.forEach((identityFullname: MetaEdPropertyFullName) => {
      const jsonPathsInfo: JsonPathsInfo = allJsonPathsMapping[identityFullname];
      if (!jsonPathsInfo) {
        return;
      }

      const matchingPairs: JsonPathPropertyPair[] = jsonPathsInfo.jsonPathPropertyPairs.filter((jppp) => {
        const { sourceProperty, flattenedIdentityProperty } = jppp;

        // Check if any property in the chain has the target role name
        const hasTargetRoleName = [sourceProperty, ...flattenedIdentityProperty.propertyChain].some(
          (property) => property.roleName === securableElementsConfig.roleName,
        );

        // Check if the parent entity is an EducationOrganization
        const hasEdOrgParent = allEducationOrganizations.includes(flattenedIdentityProperty.identityProperty.parentEntity);

        return hasTargetRoleName && hasEdOrgParent;
      });

      matchingPairs.forEach((jppp: JsonPathPropertyPair) => {
        results.set(jppp.jsonPath, {
          metaEdName: jppp.sourceProperty.metaEdName,
          jsonPath: jppp.jsonPath,
        });
      });
    });

    // Add all discovered matches to securable elements
    if (results.size > 0) {
      educationOrganizationSecurableElements.push(
        ...[...results.values()].sort((a, b) => a.metaEdName.localeCompare(b.metaEdName)),
      );
    }
  });

  return {
    enhancerName,
    success: true,
  };
}
