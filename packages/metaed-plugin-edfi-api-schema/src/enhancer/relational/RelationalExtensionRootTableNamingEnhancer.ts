// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { EnhancerResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import type { RelationalBaseName } from '../../model/api-schema/RelationalBaseName';

const enhancerName = 'RelationalExtensionRootTableNamingEnhancer';

const entityTypesToEnhance = ['associationExtension', 'domainEntityExtension'] as const;

/**
 * Populates relational root table overrides for every eligible MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, ...entityTypesToEnhance).forEach((entity) => {
    const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

    apiSchemaData.relationalRootTableNameOverride =
      `${entity.metaEdName}${entity.namespace.extensionEntitySuffix}` as RelationalBaseName;
  });

  return {
    enhancerName,
    success: true,
  };
}
