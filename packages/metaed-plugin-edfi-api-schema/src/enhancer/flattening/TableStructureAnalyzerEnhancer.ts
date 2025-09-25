// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType, ReferentialProperty } from '@edfi/metaed-core';
import type { TopLevelEntity } from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { EntityPropertyApiSchemaData } from '../../model/EntityPropertyApiSchemaData';
import type { TableMetadata } from '../../model/flattening/TableMetadata';
import {
  createChildTable,
  toTableBaseName,
  toTableJsonPath,
  TableBaseName,
  TableJsonPath,
} from './helpers/TableBuilder';

const MAX_COLLECTION_DEPTH = 2;

function shouldCreateChildTable(property: any, apiMapping: EntityPropertyApiSchemaData['apiMapping']): boolean {
  if (!property.isCollection) {
    return false;
  }

  if (apiMapping.isReferenceCollection || apiMapping.isDescriptorCollection || apiMapping.isScalarReference) {
    return false;
  }

  return apiMapping.isCommonCollection || apiMapping.isInlineCommon;
}

function resolveReferencedEntity(property: any): ReferentialProperty['referencedEntity'] | undefined {
  if ('referencedEntity' in property) {
    return (property as ReferentialProperty).referencedEntity;
  }

  return undefined;
}

function buildChildTablesForEntity(
  entity: TopLevelEntity | undefined,
  parentBaseName: TableBaseName,
  parentJsonPath: TableJsonPath,
  isExtensionTable: boolean,
  depth: number,
): TableMetadata[] {
  if (!entity?.data?.edfiApiSchema) {
    return [];
  }

  const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  const collectedProperties = apiSchemaData.collectedApiProperties ?? [];
  const childTables: TableMetadata[] = [];

  collectedProperties.forEach((collectedProperty) => {
    const property = collectedProperty.property;
    const propertyApiSchemaData = property.data.edfiApiSchema as EntityPropertyApiSchemaData | undefined;
    const apiMapping = propertyApiSchemaData?.apiMapping;

    if (!apiMapping) {
      return;
    }

    if (!shouldCreateChildTable(property, apiMapping)) {
      return;
    }

    const collectionName = apiMapping.topLevelName;
    if (!collectionName) {
      return;
    }

    const childBaseName = toTableBaseName(`${parentBaseName as string}${property.metaEdName}`);
    const parentJsonPathValue = parentJsonPath as string;
    const childJsonPathValue = `${parentJsonPathValue}.${collectionName}[*]`;
    const childJsonPath = toTableJsonPath(childJsonPathValue);

    const canRecurse = depth + 1 < MAX_COLLECTION_DEPTH;
    const referencedEntity = canRecurse ? resolveReferencedEntity(property) : undefined;
    const nestedChildTables = canRecurse
      ? buildChildTablesForEntity(referencedEntity, childBaseName, childJsonPath, isExtensionTable, depth + 1)
      : [];

    const childTable = createChildTable(childBaseName, childJsonPath, isExtensionTable, undefined);
    childTables.push({
      ...childTable,
      childTables: nestedChildTables,
    });
  });

  return childTables;
}

/**
 * Analyzes entity structure to determine table hierarchy.
 * Identifies collection properties that need child tables.
 * Processes nested collections recursively to build the full table structure.
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
    'descriptor',
  ).forEach((entity) => {
    const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    const topLevelEntity = entity as TopLevelEntity;
    const flatteningMetadata = apiSchemaData.flatteningMetadata;

    if (!flatteningMetadata) {
      return;
    }

    const rootTable = flatteningMetadata.table;
    const parentBaseName = toTableBaseName(rootTable.baseName);
    const parentJsonPath = toTableJsonPath(rootTable.jsonPath);
    const isExtensionTable = rootTable.isExtensionTable === true;

    const childTables = buildChildTablesForEntity(topLevelEntity, parentBaseName, parentJsonPath, isExtensionTable, 0);

    apiSchemaData.flatteningMetadata = {
      table: {
        ...rootTable,
        childTables,
      },
    };
  });

  return {
    enhancerName: 'TableStructureAnalyzerEnhancer',
    success: true,
  };
}
