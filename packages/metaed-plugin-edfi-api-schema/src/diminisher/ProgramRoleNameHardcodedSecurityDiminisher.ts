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
  MetaEdPropertyFullName,
  versionSatisfies,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { JsonPathsInfo } from '../model/JsonPathsMapping';
import { EducationOrganizationSecurableElement } from '../model/api-schema/EducationOrganizationSecurableElement';

const hardcodedSecurityResources: string[] = [
  'ProgramEvaluation',
  'ProgramEvaluationElement',
  'ProgramEvaluationObjective',
  'EvaluationRubricDimension',
];

/** Hardcode EducationOrganization securable elements for ProgramEvaluation, ProgramEvaluationElement,
 * ProgramEvaluationObjective and EvaluationRubricDimension to a role-named EducationOrganizationId property in their identity.
 * A future ticket (DMS-735) will define a formal mechanism to replace this hardcoded logic
 * with a long-term solution so that Extension developers don’t need to hardcode logic in MetaEd. */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const enhancerName = 'ProgramRoleNameHardcodedSecurityDiminisher';

  // ProgramEvaluation hardcoded security was added on Data Standard 5.0.0
  if (!versionSatisfies(metaEd.dataStandardVersion, '>=5.0.0')) return { enhancerName, success: true };

  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };

  // Hardcoded find of data standard EducationOrganization
  const edfiEducationOrganization: TopLevelEntity | undefined =
    coreNamespace.entity.domainEntity.get('EducationOrganization');
  if (edfiEducationOrganization == null) {
    throw new Error(`${enhancerName}: Fatal Error: EducationOrganization not found in EdFi Data Standard project`);
  }

  const allEducationOrganizations: TopLevelEntity[] = [...edfiEducationOrganization.subclassedBy, edfiEducationOrganization];

  hardcodedSecurityResources.forEach((resourceName) => {
    const entity = getEntitiesOfType(coreNamespace.entity, 'domainEntity').find(
      (x) => x.metaEdName === resourceName,
    ) as TopLevelEntity;

    if (entity == null) {
      throw new Error(
        `${enhancerName}: Fatal Error: '${resourceName}' not found in EdFi Data Standard ${metaEd.dataStandardVersion}`,
      );
    }

    // Using Map to remove duplicate JsonPaths
    const result: Map<JsonPath, EducationOrganizationSecurableElement> = new Map();

    const { identityFullnames, allJsonPathsMapping, educationOrganizationSecurableElements } = entity.data
      .edfiApiSchema as EntityApiSchemaData;

    identityFullnames.forEach((identityFullname: MetaEdPropertyFullName) => {
      const matchingJsonPathsInfo: JsonPathsInfo = allJsonPathsMapping[identityFullname];

      const matchingJsonPathPropertyPairs = matchingJsonPathsInfo.jsonPathPropertyPairs.filter((jppp) => {
        const { sourceProperty, flattenedIdentityProperty } = jppp;

        const hasRoleNameInPropertyChain = [sourceProperty, ...flattenedIdentityProperty.propertyChain].some(
          (property) => property.roleName === 'Program',
        );

        const hasEdOrgParent = allEducationOrganizations.includes(flattenedIdentityProperty.identityProperty.parentEntity);

        return hasRoleNameInPropertyChain && hasEdOrgParent;
      });

      matchingJsonPathPropertyPairs.forEach((match) => {
        result.set(match.jsonPath, {
          metaEdName: match.sourceProperty.metaEdName,
          jsonPath: match.jsonPath,
        });
      });
    });

    if (result.size === 0) {
      throw new Error(`${enhancerName}: Fatal Error: No securable paths found for entity '${resourceName}'`);
    }

    educationOrganizationSecurableElements.push(
      ...[...result.values()].sort((a, b) => a.metaEdName.localeCompare(b.metaEdName)),
    );
  });

  return {
    enhancerName,
    success: true,
  };
}
