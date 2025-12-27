// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { EnhancerResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import type { JsonPath } from '../../model/api-schema/JsonPath';
import type { RelationalBaseName } from '../../model/api-schema/RelationalBaseName';
import type { RelationalNameOverrides } from '../../model/relational/RelationalNameOverrides';
import type { RelationalNamingPlan } from '../../model/relational/RelationalNamingPlan';

const enhancerName = 'RelationalNameOverrideBuilderEnhancer';

const entityTypesToEnhance = [
  'association',
  'associationSubclass',
  'associationExtension',
  'domainEntity',
  'domainEntitySubclass',
  'domainEntityExtension',
] as const;

/**
 * Builds the JsonPath-based name overrides by comparing JSON and relational base names.
 */
function buildNameOverrides(plan: RelationalNamingPlan): RelationalNameOverrides {
  const { jsonBaseNames, relationalBaseNames } = plan;

  const overrides: RelationalNameOverrides = {};
  Object.entries(jsonBaseNames).forEach(([jsonPathKey, jsonBaseName]) => {
    const jsonPath = jsonPathKey as JsonPath;
    const relationalBaseName: RelationalBaseName | undefined = relationalBaseNames[jsonPath];
    if (relationalBaseName == null) return;
    if (relationalBaseName === jsonBaseName) return;
    overrides[jsonPath] = relationalBaseName;
  });

  return overrides;
}

/**
 * Populates relational name overrides for every eligible MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, ...entityTypesToEnhance).forEach((entity) => {
    const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    apiSchemaData.relationalNameOverrides = buildNameOverrides(apiSchemaData.relationalNamingPlan);
  });

  return {
    enhancerName,
    success: true,
  };
}
