// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EnhancerResult,
  Namespace,
  TopLevelEntity,
  getEntitiesOfType,
  MetaEdPropertyPath,
  versionSatisfies,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';

const hardcodedSecurityResources: string[] = ['StudentAssessment'];

/** Hardcode EducationOrganization securable elements for StudentAssessment
 * to a role-named SchoolId property in their identity.
 * A future ticket (DMS-735) will define a formal mechanism to replace this hardcoded logic
 * with a long-term solution so that Extension developers don’t need to hardcode logic in MetaEd. */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const enhancerName = 'StudentAssessmentHardcodedSecurityDiminisher';

  // StudentAssessment hardcoded security was added on Data Standard 4.0.0
  if (!versionSatisfies(metaEd.dataStandardVersion, '>=4.0.0')) return { enhancerName, success: true };

  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };

  hardcodedSecurityResources.forEach((resourceName) => {
    const entity = getEntitiesOfType(coreNamespace.entity, 'domainEntity').find(
      (x) => x.metaEdName === resourceName,
    ) as TopLevelEntity;

    if (entity == null) {
      throw new Error(
        `${enhancerName}: Fatal Error: '${resourceName}' not found in EdFi Data Standard ${metaEd.dataStandardVersion}`,
      );
    }

    const { allJsonPathsMapping, educationOrganizationSecurableElements } = entity.data.edfiApiSchema as EntityApiSchemaData;

    const reportedSchoolJsonPathInfo = allJsonPathsMapping['ReportedSchool' as MetaEdPropertyPath];

    if (reportedSchoolJsonPathInfo == null) {
      throw new Error(
        `${enhancerName}: Fatal Error: EdFi Data Standard ${metaEd.dataStandardVersion} has removed ReportedSchool resource from '${resourceName}'`,
      );
    }

    // Try to find a mapping that includes SchoolId in the property chain
    const reportedJsonPathPair = reportedSchoolJsonPathInfo.jsonPathPropertyPairs.find((jppp) => {
      const { sourceProperty, flattenedIdentityProperty } = jppp;
      const propertyChain = [sourceProperty, ...flattenedIdentityProperty.propertyChain];
      return propertyChain.some((property) => property.fullPropertyName === 'SchoolId');
    });

    if (!reportedJsonPathPair) {
      throw new Error(
        `${enhancerName}: Fatal Error: EdFi Data Standard ${metaEd.dataStandardVersion} has removed ReportedSchoolId property from '${resourceName}'`,
      );
    }

    educationOrganizationSecurableElements.push({
      metaEdName: reportedJsonPathPair.sourceProperty.fullPropertyName,
      jsonPath: reportedJsonPathPair.jsonPath,
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
