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

const hardcodedSecurityResources: string[] = ['OrganizationDepartment'];

/** Hardcode EducationOrganization securable elements for OrganizationDepartment
 * to a role-named EducationOrganizationId property in their identity.
 * A future ticket (DMS-735) will define a formal mechanism to replace this hardcoded logic
 * with a long-term solution so that Extension developers don’t need to hardcode logic in MetaEd. */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const enhancerName = 'OrganizationDepartmentHardcodedSecurityDiminisher';

  // OrganizationDepartment hardcoded security was added on Data Standard 3.3.0-a
  if (!versionSatisfies(metaEd.dataStandardVersion, '>=3.3.0-a')) return { enhancerName, success: true };

  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };

  hardcodedSecurityResources.forEach((resourceName) => {
    const entity = getEntitiesOfType(coreNamespace.entity, 'domainEntitySubclass').find(
      (x) => x.metaEdName === resourceName,
    ) as TopLevelEntity;

    if (entity == null) {
      throw new Error(
        `${enhancerName}: Fatal Error: '${resourceName}' not found in EdFi Data Standard ${metaEd.dataStandardVersion}`,
      );
    }

    const { allJsonPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

    const parentEdOrgJsonPathInfo = allJsonPathsMapping['ParentEducationOrganization' as MetaEdPropertyPath];

    if (parentEdOrgJsonPathInfo == null) {
      throw new Error(
        `${enhancerName}: Fatal Error: EdFi Data Standard ${metaEd.dataStandardVersion} has removed ParentEducationOrganization resource from '${resourceName}'`,
      );
    }

    // Try to find a mapping that includes EducationOrganizationId in the property chain
    const parentJsonPathPair = parentEdOrgJsonPathInfo.jsonPathPropertyPairs.find((jppp) => {
      const { sourceProperty, flattenedIdentityProperty } = jppp;
      const propertyChain = [sourceProperty, ...flattenedIdentityProperty.propertyChain];
      return propertyChain.some((property) => property.fullPropertyName === 'EducationOrganizationId');
    });

    if (!parentJsonPathPair) {
      throw new Error(
        `${enhancerName}: Fatal Error: EdFi Data Standard ${metaEd.dataStandardVersion} has removed ParentEducationOrganizationId property from '${resourceName}'`,
      );
    }

    // Override previous securable element
    entity.data.edfiApiSchema.educationOrganizationSecurableElements[0] = {
      metaEdName: parentJsonPathPair.sourceProperty.fullPropertyName,
      jsonPath: parentJsonPathPair.jsonPath,
    };
  });

  return {
    enhancerName,
    success: true,
  };
}
