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
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { JsonPath } from '../../model/api-schema/JsonPath';
import { JsonPathPropertyPair, JsonPathsInfo } from '../../model/JsonPathsMapping';

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

  // Add securable elements for renamed educationOrganizationIds on each EducationOrganization subclass
  allEducationOrganizations.forEach((educationOrganization) => {
    const entityApiSchemaData: EntityApiSchemaData = educationOrganization.data.edfiApiSchema as EntityApiSchemaData;
    Object.values(entityApiSchemaData.allJsonPathsMapping).forEach((jsonPathsInfo: JsonPathsInfo) => {
      jsonPathsInfo.jsonPathPropertyPairs.forEach((jppp: JsonPathPropertyPair) => {
        if (jppp.sourceProperty.isIdentityRename && jppp.sourceProperty.parentEntity === educationOrganization) {
          entityApiSchemaData.educationOrganizationSecurableElements.push({
            metaEdName: jppp.sourceProperty.metaEdName,
            jsonPath: jppp.jsonPath,
          });
          entityApiSchemaData.educationOrganizationSecurableElements.sort((a, b) =>
            a.metaEdName.localeCompare(b.metaEdName),
          );
        }
      });
    });
  });

  // Add securable elements for entities that have non-rolenamed reference to EducationOrganization as part of their identity
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'domainEntityExtension',
    'associationExtension',
  ).forEach((entity) => {
    // Using Set to remove duplicates
    const result: Set<{ metaEdName: string; jsonPath: JsonPath }> = new Set();

    const { identityFullnames, allJsonPathsMapping, educationOrganizationSecurableElements } = entity.data
      .edfiApiSchema as EntityApiSchemaData;

    identityFullnames.forEach((identityFullname: MetaEdPropertyFullName) => {
      const matchingJsonPathsInfo: JsonPathsInfo = allJsonPathsMapping[identityFullname];

      matchingJsonPathsInfo.jsonPathPropertyPairs.forEach((jppp) => {
        if (
          allEducationOrganizations.includes(jppp.flattenedIdentityProperty.identityProperty.parentEntity) &&
          jppp.sourceProperty.roleName === ''
        ) {
          result.add({
            metaEdName: jppp.sourceProperty.metaEdName,
            jsonPath: jppp.jsonPath,
          });
        }
      });
    });

    educationOrganizationSecurableElements.push(...[...result].sort((a, b) => a.metaEdName.localeCompare(b.metaEdName)));
  });

  return {
    enhancerName: 'EducationOrganizationSecurableElementEnhancer',
    success: true,
  };
}
