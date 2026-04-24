// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EnhancerResult,
  Namespace,
  TopLevelEntity,
  getAllEntitiesOfType,
  EntityProperty,
  newEntityProperty,
  MetaEdPropertyPath,
  NoEntityProperty,
} from '@edfi/metaed-core';
import { Table, tableEntities, Column, canonicalColumnNameFor } from '@edfi/metaed-plugin-edfi-ods-relational';
import type { EntityPropertyEdfiOds } from '@edfi/metaed-plugin-edfi-ods-relational';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { PathType } from '../model/api-schema/PathType';
import { QueryFieldPathInfo } from '../model/api-schema/QueryFieldPathInfo';
import { findMergeJsonPathsMapping, uncapitalize } from '../Utility';
import { QueryFieldMapping } from '../model/api-schema/QueryFieldMapping';
import { JsonPathsInfo } from '../model/JsonPathsMapping';

const usiSuffix = 'USI';

/**
 * Maps Column Type to PathType for query field mappings
 */
function pathTypeFrom(column: Column): PathType {
  // Descriptor columns reference the synthetic Descriptor table in ODS, but descriptor query fields are strings
  if (column.sourceEntityProperties.some((property: EntityProperty) => property.type === 'descriptor')) return 'string';

  switch (column.type) {
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'date';
    case 'datetime':
      return 'date-time';
    case 'time':
      return 'time';
    case 'string':
      return 'string';
    case 'integer':
    case 'bigint':
    case 'short':
    case 'decimal':
    case 'currency':
    case 'percent':
    case 'year':
      return 'number';
    case 'duration':
      return 'string';
    default:
      return 'string';
  }
}

/**
 * Creates standard query field mapping for descriptors
 */
function createDescriptorQueryFieldMapping(): { [queryField: string]: QueryFieldPathInfo[] } {
  return {
    id: [
      {
        path: '$.id' as JsonPath,
        type: 'string',
        sourceProperty: { ...newEntityProperty(), type: 'string' },
      },
    ],
    codeValue: [
      {
        path: '$.codeValue' as JsonPath,
        type: 'string',
        sourceProperty: { ...newEntityProperty(), type: 'string' },
      },
    ],
    description: [
      {
        path: '$.description' as JsonPath,
        type: 'string',
        sourceProperty: { ...newEntityProperty(), type: 'string' },
      },
    ],
    effectiveBeginDate: [
      {
        path: '$.effectiveBeginDate' as JsonPath,
        type: 'date',
        sourceProperty: { ...newEntityProperty(), type: 'date' },
      },
    ],
    effectiveEndDate: [
      {
        path: '$.effectiveEndDate' as JsonPath,
        type: 'date',
        sourceProperty: { ...newEntityProperty(), type: 'date' },
      },
    ],
    namespace: [
      {
        path: '$.namespace' as JsonPath,
        type: 'string',
        sourceProperty: { ...newEntityProperty(), type: 'string' },
      },
    ],
    shortDescription: [
      {
        path: '$.shortDescription' as JsonPath,
        type: 'string',
        sourceProperty: { ...newEntityProperty(), type: 'string' },
      },
    ],
  };
}

/**
 * Derive the query field name from the column name components
 */
function queryFieldNameFrom(column: Column): string {
  const descriptorSource: EntityProperty | undefined = column.sourceEntityProperties.find(
    (property: EntityProperty) => property.type === 'descriptor',
  );

  return uncapitalize(
    // If a column is for a descriptor drop the "Id" suffix because it's a reference to the Descriptor lookup table
    descriptorSource != null ? canonicalColumnNameFor(column).replace(/Id$/, '') : canonicalColumnNameFor(column),
  );
}

/**
 * Add a query field path info to the mapping
 */
function addQueryFieldPathInfo(
  queryFieldMapping: QueryFieldMapping,
  queryFieldName: string,
  pathInfo: QueryFieldPathInfo,
): void {
  if (queryFieldMapping[queryFieldName] == null) {
    queryFieldMapping[queryFieldName] = [];
  }

  // Check if this exact path already exists to avoid duplicates
  const existingPath = queryFieldMapping[queryFieldName].find(
    (existing) => existing.path === pathInfo.path && existing.type === pathInfo.type,
  );

  if (!existingPath) {
    queryFieldMapping[queryFieldName].push(pathInfo);
  }
}

/**
 * Finds the UniqueId property represented by a synthetic USI column.
 */
function sourceUniqueIdPropertyFrom(column: Column): EntityProperty {
  const usiProperty: EntityProperty | undefined = column.sourceEntityProperties.find((property: EntityProperty) => {
    const edfiOdsRelationalData: EntityPropertyEdfiOds | undefined = property.data.edfiOdsRelational;
    return edfiOdsRelationalData?.isUsiProperty === true;
  });
  if (usiProperty == null) return NoEntityProperty;

  return (usiProperty.data.edfiOdsRelational as EntityPropertyEdfiOds).sourceUniqueIdProperty;
}

/**
 * Builds a semantic property path by replacing only the terminal synthetic USI property with its source UniqueId property.
 */
function sourceUniqueIdPropertyPathFrom(column: Column, sourceUniqueIdProperty: EntityProperty): MetaEdPropertyPath {
  const propertyPathParts: string[] = column.propertyPath.split('.');
  propertyPathParts[propertyPathParts.length - 1] = sourceUniqueIdProperty.fullPropertyName;
  return propertyPathParts.join('.') as MetaEdPropertyPath;
}

/**
 * Handle USI columns by using the semantic JsonPaths for their source UniqueId properties.
 */
function addUniqueIdColumn(column: Column, entity: TopLevelEntity, queryFieldMapping: QueryFieldMapping): void {
  const columnName = canonicalColumnNameFor(column);
  if (!columnName.endsWith(usiSuffix)) return;

  // Extract the entity/role name from the column name
  const namePrefix = columnName.substring(0, columnName.length - usiSuffix.length);
  const queryFieldName = `${uncapitalize(namePrefix)}UniqueId`;

  const sourceUniqueIdProperty: EntityProperty = sourceUniqueIdPropertyFrom(column);
  if (sourceUniqueIdProperty === NoEntityProperty || sourceUniqueIdProperty.fullPropertyName === '') return;

  const jsonPathsInfo: JsonPathsInfo | null = findMergeJsonPathsMapping(
    entity,
    sourceUniqueIdPropertyPathFrom(column, sourceUniqueIdProperty),
  );
  if (jsonPathsInfo == null) return;

  jsonPathsInfo.jsonPathPropertyPairs.forEach((pair) => {
    const queryFieldPathInfo: QueryFieldPathInfo = {
      path: pair.jsonPath,
      type: 'string',
      sourceProperty: pair.sourceProperty,
    };

    addQueryFieldPathInfo(queryFieldMapping, queryFieldName, queryFieldPathInfo);
  });
}

/**
 * Adds queryFieldMapping based on that
 */
function addQueryFieldMappingsFrom(column: Column, entity: TopLevelEntity, queryFieldMapping: QueryFieldMapping): void {
  // USI columns need conversion to UniqueId
  if (column.isFromUsiProperty) {
    addUniqueIdColumn(column, entity, queryFieldMapping);
    return;
  }

  const jsonPathsInfo: JsonPathsInfo | null = findMergeJsonPathsMapping(entity, column.propertyPath);

  // Handle synthetic columns
  if (jsonPathsInfo == null) {
    // Other synthetic columns don't map to anything
    return;
  }

  // Handle regular columns with JSON path mappings
  jsonPathsInfo.jsonPathPropertyPairs.forEach((pair) => {
    const queryFieldPathInfo: QueryFieldPathInfo = {
      path: pair.jsonPath,
      type: pathTypeFrom(column),
      sourceProperty: pair.sourceProperty,
    };

    addQueryFieldPathInfo(queryFieldMapping, queryFieldNameFrom(column), queryFieldPathInfo);
  });
}

/**
 * Processes a single table to generate query field mappings for its entity
 */
function createQueryFieldMappingsFrom(table: Table): void {
  // Skip descriptors as they're handled separately
  if (table.parentEntity.type === 'descriptor') {
    return;
  }

  // Skip schoolYearEnumeration as it's handled separately
  if (table.parentEntity.type === 'schoolYearEnumeration') {
    return;
  }

  // Skip synthetic tables
  if (table.existenceReason.isSynthetic) {
    return;
  }

  // Only process main tables for an entity
  if (!table.existenceReason.isEntityMainTable) {
    return;
  }

  // Starts off with synthetic id field
  const queryFieldMapping: QueryFieldMapping = {
    id: [
      {
        path: '$.id' as JsonPath,
        type: 'string',
        sourceProperty: { ...newEntityProperty(), type: 'string' },
      },
    ],
  };

  table.columns.forEach((column) => {
    addQueryFieldMappingsFrom(column, table.parentEntity, queryFieldMapping);
  });

  // if this is a subclass table, we also need columns from the superclass table
  if (table.parentEntity.type === 'associationSubclass' || table.parentEntity.type === 'domainEntitySubclass') {
    const superclassTable: Table = table.parentEntity.baseEntity?.data.edfiOdsRelational.odsEntityTable;
    superclassTable.columns.forEach((column) => {
      // We skip the superclass PK columns - the subclass table already has them due to its FK to superclass table
      if (column.isPartOfPrimaryKey) return;
      addQueryFieldMappingsFrom(column, superclassTable.parentEntity, queryFieldMapping);
    });
  }

  (table.parentEntity.data.edfiApiSchema as EntityApiSchemaData).queryFieldMapping = queryFieldMapping;
}

/**
 * Creates standard query field mapping for SchoolYearEnumeration
 */
function createSchoolYearEnumerationQueryFieldMapping(): { [queryField: string]: QueryFieldPathInfo[] } {
  return {
    id: [
      {
        path: '$.id' as JsonPath,
        type: 'string',
        sourceProperty: { ...newEntityProperty(), type: 'string' },
      },
    ],
    schoolYear: [
      {
        path: '$.schoolYear' as JsonPath,
        type: 'number',
        sourceProperty: { ...newEntityProperty(), type: 'short' },
      },
    ],
    currentSchoolYear: [
      {
        path: '$.currentSchoolYear' as JsonPath,
        type: 'boolean',
        sourceProperty: { ...newEntityProperty(), type: 'boolean' },
      },
    ],
    schoolYearDescription: [
      {
        path: '$.schoolYearDescription' as JsonPath,
        type: 'string',
        sourceProperty: { ...newEntityProperty(), type: 'string' },
      },
    ],
  };
}

/**
 * Generates query field mappings from relational table columns.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Handle descriptors directly
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((entity) => {
    const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    if (entityApiSchemaData) {
      const queryFieldMapping = createDescriptorQueryFieldMapping();
      entityApiSchemaData.queryFieldMapping = queryFieldMapping;
    }
  });

  // Handle SchoolYearEnumeration directly
  getAllEntitiesOfType(metaEd, 'schoolYearEnumeration').forEach((entity) => {
    const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    if (entityApiSchemaData) {
      const queryFieldMapping = createSchoolYearEnumerationQueryFieldMapping();
      entityApiSchemaData.queryFieldMapping = queryFieldMapping;
    }
  });

  // Handle everything else through tables
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables = tableEntities(metaEd, namespace);
    tables.forEach((table: Table) => {
      createQueryFieldMappingsFrom(table);
    });
  });

  return {
    enhancerName: 'QueryFieldMappingEnhancer',
    success: true,
  };
}
