// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType } from '@edfi/metaed-core';
import type { TopLevelEntity } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { FlatteningMetadata } from '../../model/flattening/FlatteningMetadata';
import { createRootTable } from './helpers/TableBuilder';
import type { TableDiscriminator } from './helpers/TableBuilder';

/**
 * Initializes the flattening metadata structure for entities that need it.
 * Sets up an empty table structure that will be populated by subsequent enhancers.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Process all entities that will have flattening metadata
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'domainEntityExtension',
    'associationExtension',
    'descriptor',
  ).forEach((entity) => {
    const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    const topLevelEntity = entity as TopLevelEntity;

    const discriminator =
      topLevelEntity.type === 'domainEntitySubclass' || topLevelEntity.type === 'associationSubclass'
        ? (topLevelEntity.metaEdName as TableDiscriminator)
        : undefined;

    const rootTable = createRootTable(topLevelEntity, discriminator);

    const flatteningMetadata: FlatteningMetadata = {
      table: rootTable,
    };

    apiSchemaData.flatteningMetadata = flatteningMetadata;
  });

  return {
    enhancerName: 'FlatteningMetadataInitializerEnhancer',
    success: true,
  };
}
