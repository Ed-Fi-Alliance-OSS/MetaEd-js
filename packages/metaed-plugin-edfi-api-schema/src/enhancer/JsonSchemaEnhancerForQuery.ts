// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';

const enhancerName = 'JsonSchemaEnhancerForQuery';

/**
 * This enhancer uses the results of the ApiMappingEnhancer to create a JSON schema for query
 * for each MetaEd entity. This schema is used to validate API query strings as objects
 * for each resource that corresponds to the MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Build schemas for each domain entity and association
  getAllEntitiesOfType(
    metaEd,
    'descriptor',
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'schoolYearEnumeration',
  ).forEach((entity) => {
    const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    const { jsonSchemaForInsert } = entityApiSchemaData;
    entityApiSchemaData.jsonSchemaForQuery = {
      ...jsonSchemaForInsert,
      // Need to relax the validation such that no fields are "required" in the query string
      required: [],
    };
  });
  return {
    enhancerName,
    success: true,
  };
}
