// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  getAllEntitiesOfType,
  MetaEdPropertyFullName,
  isReferentialProperty,
  ReferentialProperty,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { JsonPath } from '../../model/api-schema/JsonPath';
import { JsonPathPropertyPair, JsonPathsInfo } from '../../model/JsonPathsMapping';
import { EducationOrganizationSecurableElement } from '../../model/api-schema/EducationOrganizationSecurableElement';

/**
 * Adds EducationOrganization-specific SecurableElements like the renamed educationOrganizationId
 * and non-identity EducationOrganization scalar references regardless of role name
 */
function addEducationOrganizationSpecificSecurableElements(
  educationOrganization: TopLevelEntity,
  result: Map<JsonPath, EducationOrganizationSecurableElement>,
  allEducationOrganizations: TopLevelEntity[],
) {
  const entityApiSchemaData: EntityApiSchemaData = educationOrganization.data.edfiApiSchema as EntityApiSchemaData;

  Object.values(entityApiSchemaData.allJsonPathsMapping).forEach((jsonPathsInfo: JsonPathsInfo) => {
    jsonPathsInfo.jsonPathPropertyPairs.forEach((jppp: JsonPathPropertyPair) => {
      // Add securable elements for renamed educationOrganizationIds on each EducationOrganization subclass
      if (jppp.sourceProperty.isIdentityRename && jppp.sourceProperty.parentEntity === educationOrganization) {
        result.set(jppp.jsonPath, {
          metaEdName: jppp.sourceProperty.metaEdName,
          jsonPath: jppp.jsonPath,
        });
      }

      // Add non-identity EducationOrganization scalar references regardless of role name
      if (
        isReferentialProperty(jppp.sourceProperty) &&
        (jppp.sourceProperty.isRequired || jppp.sourceProperty.isOptional) &&
        allEducationOrganizations.includes((jppp.sourceProperty as ReferentialProperty).referencedEntity)
      ) {
        result.set(jppp.jsonPath, {
          metaEdName: jppp.sourceProperty.metaEdName,
          jsonPath: jppp.jsonPath,
        });
      }
    });
  });
}

/**
 * Finds the EducationOrganizationId elements that can be EducationOrganization
 * securable elements for the document. This includes EducationOrganizationId renames on
 * EducationOrganization subclasses
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Hardcoded find of data standard EducationOrganization
  const edfiEducationOrganization: TopLevelEntity | undefined = metaEd.namespace
    .get('EdFi')
    ?.entity.domainEntity.get('EducationOrganization');
  if (edfiEducationOrganization == null) {
    throw new Error(
      'EducationOrganizationSecurableElementEnhancer: Fatal Error: EducationOrganization not found in EdFi Data Standard project',
    );
  }

  const allEducationOrganizations: TopLevelEntity[] = [...edfiEducationOrganization.subclassedBy, edfiEducationOrganization];

  // Add securable elements for entities that have non-rolenamed reference to EducationOrganization as part of their identity
  // Also handle EducationOrganization special cases
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
    // Using Map to remove duplicate JsonPaths
    const result: Map<JsonPath, EducationOrganizationSecurableElement> = new Map();

    const { identityFullnames, allJsonPathsMapping, educationOrganizationSecurableElements } = entity.data
      .edfiApiSchema as EntityApiSchemaData;

    identityFullnames.forEach((identityFullname: MetaEdPropertyFullName) => {
      const matchingJsonPathsInfo: JsonPathsInfo = allJsonPathsMapping[identityFullname];

      matchingJsonPathsInfo.jsonPathPropertyPairs.forEach((jppp) => {
        if (
          allEducationOrganizations.includes(jppp.flattenedIdentityProperty.identityProperty.parentEntity) &&
          jppp.sourceProperty.roleName === ''
        ) {
          result.set(jppp.jsonPath, {
            metaEdName: jppp.sourceProperty.metaEdName,
            jsonPath: jppp.jsonPath,
          });
        }
      });
    });

    // EducationOrganization entities have additional securable elements
    if (allEducationOrganizations.includes(entity)) {
      addEducationOrganizationSpecificSecurableElements(entity, result, allEducationOrganizations);
    }

    educationOrganizationSecurableElements.push(
      ...[...result.values()].sort((a, b) => a.metaEdName.localeCompare(b.metaEdName)),
    );
  });

  return {
    enhancerName: 'EducationOrganizationSecurableElementEnhancer',
    success: true,
  };
}
