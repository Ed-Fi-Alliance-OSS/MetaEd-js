// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType, MetaEdPropertyFullName } from '@edfi/metaed-core';
import invariant from 'ts-invariant';
import { JsonPath } from '../../model/api-schema/JsonPath';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { JsonPathsInfo } from '../../model/JsonPathsMapping';

/**
 * Finds the StudentUniqueId elements that can be Student securable elements for the document.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
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
    const result: Set<JsonPath> = new Set();

    const { identityFullnames, allJsonPathsMapping, studentSecurableElements } = entity.data
      .edfiApiSchema as EntityApiSchemaData;

    identityFullnames.forEach((identityFullname: MetaEdPropertyFullName) => {
      const matchingJsonPathsInfo: JsonPathsInfo = allJsonPathsMapping[identityFullname];
      invariant(matchingJsonPathsInfo != null, 'identityFullname did not match an allJsonPathsMapping');

      matchingJsonPathsInfo.jsonPathPropertyPairs.forEach((jppp) => {
        // Add securable elements for entities that reference the Student entity as part of their identity
        if (
          jppp.flattenedIdentityProperty.identityProperty.parentEntity.namespace.namespaceName === 'EdFi' &&
          jppp.flattenedIdentityProperty.identityProperty.parentEntity.metaEdName === 'Student'
        ) {
          result.add(jppp.jsonPath);
        }

        // Add securable element for Student.StudentUniqueId itself
        if (
          entity.namespace.namespaceName === 'EdFi' &&
          entity.metaEdName === 'Student' &&
          jppp.sourceProperty.roleName === 'Student' &&
          jppp.sourceProperty.metaEdName === 'UniqueId'
        )
          result.add(jppp.jsonPath);
      });
    });

    studentSecurableElements.push(...[...result].sort());
  });

  return {
    enhancerName: 'StudentSecurableElementEnhancer',
    success: true,
  };
}
