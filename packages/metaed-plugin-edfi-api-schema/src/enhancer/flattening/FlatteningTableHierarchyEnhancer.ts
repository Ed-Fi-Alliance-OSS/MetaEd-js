// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  EntityProperty,
  MetaEdEnvironment,
  TopLevelEntity,
  getAllEntitiesOfType,
  type EnhancerResult,
  type CommonProperty,
} from '@edfi/metaed-core';
import invariant from 'ts-invariant';
import type { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import type { FlatteningMetadata } from '../../model/flattening/FlatteningMetadata';
import type { TableMetadata } from '../../model/flattening/TableMetadata';
import type { TablePath } from '../../model/flattening/FlatteningTableNode';
import { ROOT_TABLE_PATH, collectTableNodes, deriveTableSuffix, sortTableNodes } from './FlatteningTableHelper';

type PropertyWithReference = EntityProperty & {
  referencedEntity?: TopLevelEntity;
};

/**
 * Determines whether a child table should be marked as part of an extension payload.
 * This is a first pass, DMS-832 will improve on it
 */
function derivesExtensionTable(property: EntityProperty, parentTable: TableMetadata): boolean {
  if (parentTable.isExtensionTable === true) return true;

  if (property.type === 'common') {
    const commonProperty = property as CommonProperty;
    if (commonProperty.isExtensionOverride) return true;
  }

  const { referencedEntity } = property as PropertyWithReference;
  if (referencedEntity?.namespace.isExtension === true) {
    return true;
  }

  return false;
}

/**
 * Builds the root table metadata for the supplied entity.
 */
function createRootTable(entity: TopLevelEntity): TableMetadata {
  const isExtensionEntity = entity.type === 'domainEntityExtension' || entity.type === 'associationExtension';
  const isSubclassEntity = entity.type === 'domainEntitySubclass' || entity.type === 'associationSubclass';
  const baseName =
    isExtensionEntity && !entity.metaEdName.endsWith(entity.namespace.extensionEntitySuffix)
      ? `${entity.metaEdName}${entity.namespace.extensionEntitySuffix}`
      : entity.metaEdName;

  const table: TableMetadata = {
    baseName,
    columns: [],
    childTables: [],
    ...(isExtensionEntity ? { isExtensionTable: true } : {}),
    ...(isSubclassEntity ? { discriminatorValue: baseName } : {}),
  };

  return table;
}

/**
 * Materializes the complete table hierarchy for the entity.
 */
function buildTablesForEntity(entity: TopLevelEntity): TableMetadata {
  const tableNodes = collectTableNodes(entity);
  const rootTable = createRootTable(entity);
  const tableMap: Map<TablePath, TableMetadata> = new Map([[ROOT_TABLE_PATH, rootTable]]);

  const sortedNodes = sortTableNodes(tableNodes);

  sortedNodes.forEach((tableNode) => {
    const parentTable = tableMap.get(tableNode.parentPath);
    invariant(
      parentTable != null,
      `Parent table "${tableNode.parentPath}" was not initialized for "${tableNode.tablePath}"`,
    );

    const table: TableMetadata = {
      baseName: `${parentTable.baseName}${deriveTableSuffix(tableNode)}`,
      columns: [],
      childTables: [],
    };

    if (derivesExtensionTable(tableNode.property, parentTable)) {
      table.isExtensionTable = true;
    }

    parentTable.childTables.push(table);
    tableMap.set(tableNode.tablePath, table);
  });

  return rootTable;
}

/**
 * Produces root flattening metadata for the entity using the assembled table hierarchy.
 */
function buildFlatteningMetadata(entity: TopLevelEntity): FlatteningMetadata {
  const table = buildTablesForEntity(entity);
  return { table };
}

/**
 * Enumerates the entities that should participate in the flattening metadata sequence.
 */
const entityTypesToEnhance = [
  'association',
  'associationSubclass',
  'associationExtension',
  'domainEntity',
  'domainEntitySubclass',
  'domainEntityExtension',
] as const;

/**
 * Constructs the flattening table hierarchy for every API resource entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, ...entityTypesToEnhance).forEach((entity) => {
    const topLevelEntity = entity as TopLevelEntity;
    const apiSchemaData = topLevelEntity.data.edfiApiSchema as EntityApiSchemaData | undefined;
    if (apiSchemaData == null) return;

    apiSchemaData.flatteningMetadata = buildFlatteningMetadata(topLevelEntity);
  });

  return {
    enhancerName: 'FlatteningTableHierarchyEnhancer',
    success: true,
  };
}
