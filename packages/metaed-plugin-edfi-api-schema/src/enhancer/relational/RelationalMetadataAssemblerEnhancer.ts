// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { EnhancerResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import type { RelationalMetadata } from '../../model/api-schema/RelationalMetadata';
import type { RelationalBaseName } from '../../model/api-schema/RelationalBaseName';
import type { RelationalNameOverrides } from '../../model/relational/RelationalNameOverrides';

const enhancerName = 'RelationalMetadataAssemblerEnhancer';

const entityTypesToEnhance = [
  'association',
  'associationSubclass',
  'associationExtension',
  'domainEntity',
  'domainEntitySubclass',
  'domainEntityExtension',
] as const;

/**
 * Returns true when any JsonPath name overrides are present.
 */
function hasNameOverrides(nameOverrides: RelationalNameOverrides): boolean {
  return Object.keys(nameOverrides).length > 0;
}

/**
 * Builds relational metadata when overrides exist.
 */
function buildRelationalMetadata(
  nameOverrides: RelationalNameOverrides,
  rootTableNameOverride: RelationalBaseName | undefined,
): RelationalMetadata | undefined {
  const hasOverrides = hasNameOverrides(nameOverrides);
  if (!hasOverrides && rootTableNameOverride == null) return undefined;

  const relationalMetadata: RelationalMetadata = {};
  if (rootTableNameOverride != null) {
    relationalMetadata.rootTableNameOverride = rootTableNameOverride;
  }
  if (hasOverrides) {
    relationalMetadata.nameOverrides = nameOverrides;
  }
  return relationalMetadata;
}

/**
 * Assembles relational metadata for every eligible MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, ...entityTypesToEnhance).forEach((entity) => {
    const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData | undefined;
    if (apiSchemaData == null) return;

    const relationalMetadata = buildRelationalMetadata(
      apiSchemaData.relationalNameOverrides ?? {},
      apiSchemaData.relationalRootTableNameOverride,
    );
    apiSchemaData.relational = relationalMetadata;
  });

  return {
    enhancerName,
    success: true,
  };
}
