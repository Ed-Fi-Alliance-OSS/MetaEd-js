// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { EnhancerResult, MetaEdEnvironment, TopLevelEntity } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import type { RelationalBaseName } from '../../model/api-schema/RelationalBaseName';

const enhancerName = 'RelationalExtensionRootTableNamingEnhancer';

const entityTypesToEnhance = ['associationExtension', 'domainEntityExtension'] as const;

/**
 * Determines the relational root table base name for the supplied entity.
 */
function relationalRootTableBaseNameFor(entity: TopLevelEntity): RelationalBaseName {
  const suffix = entity.namespace.extensionEntitySuffix;
  if (entity.metaEdName.endsWith(suffix)) {
    return entity.metaEdName as RelationalBaseName;
  }

  return `${entity.metaEdName}${suffix}` as RelationalBaseName;
}

/**
 * Determines the root table name override when the relational base name differs from the resource name.
 */
function relationalRootTableNameOverrideFor(entity: TopLevelEntity): RelationalBaseName | undefined {
  const baseName = relationalRootTableBaseNameFor(entity);
  return baseName === entity.metaEdName ? undefined : baseName;
}

/**
 * Populates relational root table overrides for every eligible MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, ...entityTypesToEnhance).forEach((entity) => {
    const topLevelEntity = entity as TopLevelEntity;
    const apiSchemaData = topLevelEntity.data.edfiApiSchema as EntityApiSchemaData | undefined;
    if (apiSchemaData == null) return;

    apiSchemaData.relationalRootTableNameOverride = relationalRootTableNameOverrideFor(topLevelEntity);
  });

  return {
    enhancerName,
    success: true,
  };
}
