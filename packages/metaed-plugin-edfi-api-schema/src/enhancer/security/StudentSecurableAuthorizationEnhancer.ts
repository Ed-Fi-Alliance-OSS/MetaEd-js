// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, TopLevelEntity, ReferentialProperty, SimpleProperty } from '@edfi/metaed-core';
import { JsonPath } from '../../model/api-schema/JsonPath';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { JsonPathsInfo, JsonPathPropertyPair } from '../../model/JsonPathsMapping';

function recursiveEnhance(studentReferenceProperty: ReferentialProperty | SimpleProperty) {
  // Needs to be part of identity
  if (!studentReferenceProperty.isPartOfIdentity) return;

  // Skip role named properties
  if (studentReferenceProperty.roleName !== '') return;

  const result: Set<JsonPath> = new Set();

  const { allJsonPathsMapping } = studentReferenceProperty.parentEntity.data.edfiApiSchema as EntityApiSchemaData;

  Object.values(allJsonPathsMapping).forEach((jsonPathsInfo: JsonPathsInfo) => {
    jsonPathsInfo.jsonPathPropertyPairs.forEach((jsonPathPropertyPair: JsonPathPropertyPair) => {
      // We are only interested in the identity properties relating to the Student entity
      if (jsonPathPropertyPair.flattenedIdentityProperty.identityProperty.parentEntityName === 'Student')
        result.add(jsonPathPropertyPair.jsonPath);
    });
  });
  (studentReferenceProperty.parentEntity.data.edfiApiSchema as EntityApiSchemaData).studentSecurableAuthorizationElements = [
    ...result,
  ].sort();

  studentReferenceProperty.parentEntity.inReferences.forEach((referenceProperty) => {
    recursiveEnhance(referenceProperty);
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const edfiStudent: TopLevelEntity | undefined = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Student');
  if (edfiStudent) {
    edfiStudent.inReferences.forEach((studentReferenceProperty) => {
      recursiveEnhance(studentReferenceProperty);
    });
  }

  return {
    enhancerName: 'StudentSecurableAuthorizationEnhancer',
    success: true,
  };
}
