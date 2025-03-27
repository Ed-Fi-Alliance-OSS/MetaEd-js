// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType, MetaEdPropertyFullName } from '@edfi/metaed-core';
import { JsonPath } from '../../model/api-schema/JsonPath';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { JsonPathsInfo } from '../../model/JsonPathsMapping';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      // Using Set to remove duplicates
      const result: Set<JsonPath> = new Set();

      const { identityFullnames, allJsonPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

      identityFullnames.forEach((identityFullname: MetaEdPropertyFullName) => {
        const matchingJsonPathsInfo: JsonPathsInfo = allJsonPathsMapping[identityFullname];
        // Add student securable authorization elements
        matchingJsonPathsInfo.jsonPathPropertyPairs.forEach((jppp) => {
          if (
            jppp.flattenedIdentityProperty.identityProperty.parentEntity.metaEdName === 'Student' &&
            jppp.flattenedIdentityProperty.identityProperty.parentEntity.namespace.namespaceName === 'EdFi'
          )
            result.add(jppp.jsonPath);
        });
      });

      (entity.data.edfiApiSchema as EntityApiSchemaData).studentSecurableAuthorizationElements = [...result].sort();
    },
  );

  return {
    enhancerName: 'StudentSecurableAuthorizationEnhancer',
    success: true,
  };
}
