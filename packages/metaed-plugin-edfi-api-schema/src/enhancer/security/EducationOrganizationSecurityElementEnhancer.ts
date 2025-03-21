// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, TopLevelEntity } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { JsonPath } from '../../model/api-schema/JsonPath';
import { JsonPathPropertyPair, JsonPathsInfo } from '../../model/JsonPathsMapping';

/**
 * Finds the EducationOrganizationId elements that can be EducationOrganization
 * security elements for the document. This includes EducationOrganizationId renames on
 * EducationOrganization subclasses
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Hardcoded find of data standard EducationOrganization
  const edfiEducationOrganization: TopLevelEntity | undefined = metaEd.namespace
    .get('EdFi')
    ?.entity.domainEntity.get('EducationOrganization');
  if (edfiEducationOrganization == null) {
    throw new Error(
      'EducationOrganizationSecurityElementEnhancer: Fatal Error: EducationOrganization not found in EdFi Data Standard project',
    );
  }

  const allEducationOrganizations: TopLevelEntity[] = [...edfiEducationOrganization.subclassedBy, edfiEducationOrganization];

  allEducationOrganizations.forEach((educationOrganization) => {
    educationOrganization.inReferences.forEach((educationOrganizationReferenceProperty) => {
      // Skip role named properties
      if (educationOrganizationReferenceProperty.roleName !== '') return;

      // Using Set to remove duplicates
      const result: Set<{ metaEdName: string; jsonPath: JsonPath }> = new Set();

      const { allJsonPathsMapping } = educationOrganizationReferenceProperty.parentEntity.data
        .edfiApiSchema as EntityApiSchemaData;

      // Find the jsonPath for the educationOrganizationReferenceProperty on its parent entity
      Object.values(allJsonPathsMapping).forEach((jsonPathsInfo: JsonPathsInfo) => {
        jsonPathsInfo.jsonPathPropertyPairs.forEach((jsonPathPropertyPair: JsonPathPropertyPair) => {
          if (jsonPathPropertyPair.sourceProperty !== educationOrganizationReferenceProperty) return;
          result.add({
            metaEdName: educationOrganizationReferenceProperty.metaEdName,
            jsonPath: jsonPathPropertyPair.jsonPath,
          });
        });
      });

      (
        educationOrganizationReferenceProperty.parentEntity.data.edfiApiSchema as EntityApiSchemaData
      ).educationOrganizationSecurityElements = [...result].sort((a, b) => a.metaEdName.localeCompare(b.metaEdName));
    });
  });

  return {
    enhancerName: 'EducationOrganizationSecurityElementEnhancer',
    success: true,
  };
}
