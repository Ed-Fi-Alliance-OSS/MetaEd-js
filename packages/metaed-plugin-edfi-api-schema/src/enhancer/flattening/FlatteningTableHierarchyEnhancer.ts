// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  EntityProperty,
  MetaEdEnvironment,
  MetaEdPropertyPath,
  TopLevelEntity,
  getAllEntitiesOfType,
  normalizeDescriptorSuffix,
  type EnhancerResult,
  type Namespace,
} from '@edfi/metaed-core';
import invariant from 'ts-invariant';
import type { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import type { EntityPropertyApiSchemaData } from '../../model/EntityPropertyApiSchemaData';
import type { JsonPathsInfo, JsonPathsMapping } from '../../model/JsonPathsMapping';
import type { FlatteningMetadata } from '../../model/flattening/FlatteningMetadata';
import type { TableMetadata } from '../../model/flattening/TableMetadata';
import type { JsonPath } from '../../model/api-schema/JsonPath';
import {
  ROOT_TABLE_PATH,
  collectTableNodes,
  deriveTableSuffix,
  sortTableNodes,
  type FlatteningTableNode,
  type TablePath,
} from './FlatteningTableRegistry';

/**
 * Computes the canonical JSON path for a collection property using available schema mappings.
 */
function resolveCollectionContainerPath(
  propertyPath: MetaEdPropertyPath,
  property: EntityProperty,
  apiSchemaData: EntityApiSchemaData,
): JsonPath | null {
  const { allJsonPathsMapping, flatteningCollectionContainerPaths, collectionContainerPaths } = apiSchemaData;
  const jsonPathsInfo: JsonPathsInfo | undefined = allJsonPathsMapping[propertyPath];
  if (jsonPathsInfo?.collectionContainerJsonPath != null) {
    return jsonPathsInfo.collectionContainerJsonPath;
  }

  if (jsonPathsInfo?.collectionContainerJsonPath == null) {
    const matchingEntry = Object.entries(allJsonPathsMapping).find(
      ([path, candidate]) =>
        candidate.collectionContainerJsonPath != null &&
        (candidate.initialPropertyPath === propertyPath || path.startsWith(`${propertyPath}.`)),
    );
    if (matchingEntry?.[1].collectionContainerJsonPath != null) {
      return matchingEntry[1].collectionContainerJsonPath;
    }
  }

  const flatteningContainerPath = flatteningCollectionContainerPaths[propertyPath];
  if (flatteningContainerPath != null) {
    return flatteningContainerPath;
  }

  const collectionContainerPath = collectionContainerPaths[propertyPath];
  if (collectionContainerPath != null) {
    return collectionContainerPath;
  }

  const propertyApiData = property.data?.edfiApiSchema;
  const apiMapping = propertyApiData?.apiMapping;
  const requiresDescriptorSuffix: boolean = apiMapping?.isDescriptorCollection === true;

  if (requiresDescriptorSuffix) {
    const descriptorPropertyPath = normalizeDescriptorSuffix(propertyPath) as MetaEdPropertyPath;
    const descriptorInfo: JsonPathsInfo | undefined = allJsonPathsMapping[descriptorPropertyPath];
    if (descriptorInfo?.collectionContainerJsonPath != null) {
      return descriptorInfo.collectionContainerJsonPath;
    }

    const descriptorFlatteningPath = flatteningCollectionContainerPaths[descriptorPropertyPath];
    if (descriptorFlatteningPath != null) {
      return descriptorFlatteningPath;
    }

    const descriptorCollectionPath = collectionContainerPaths[descriptorPropertyPath];
    if (descriptorCollectionPath != null) {
      return descriptorCollectionPath;
    }
  }

  return null;
}

function isReferenceCollectionProperty(property: EntityProperty): boolean {
  const apiSchemaData = property.data?.edfiApiSchema as EntityPropertyApiSchemaData | undefined;
  return apiSchemaData?.apiMapping.isReferenceCollection === true;
}

function normalizeReferenceCollectionJsonPath(
  jsonPath: JsonPath,
  tableNode: FlatteningTableNode,
  apiSchemaData: EntityApiSchemaData,
): JsonPath {
  if (!isReferenceCollectionProperty(tableNode.property)) {
    return jsonPath;
  }

  const collectionPath: JsonPath | null = resolveCollectionContainerPath(
    tableNode.tablePath,
    tableNode.property,
    apiSchemaData,
  );
  if (collectionPath != null) {
    return collectionPath;
  }

  const jsonPathValue = jsonPath as unknown as string;
  const lastArrayTokenIndex = jsonPathValue.lastIndexOf('[*]');
  if (lastArrayTokenIndex !== -1) {
    return jsonPathValue.slice(0, lastArrayTokenIndex + 3) as JsonPath;
  }

  return jsonPath;
}

/**
 * Derives the jsonPath for a non-collection table by inspecting the JsonPaths of its child properties.
 */
function resolveNestedObjectPath(propertyPath: MetaEdPropertyPath, allJsonPathsMapping: JsonPathsMapping): JsonPath {
  const childPrefix = `${propertyPath}.`;
  const childEntries = Object.entries(allJsonPathsMapping).filter(([path]) => path.startsWith(childPrefix));

  invariant(
    childEntries.length > 0,
    `Expected JsonPath entries for properties within "${propertyPath}" when constructing flattening tables`,
  );

  const rankedEntries = childEntries
    .map(([, info]) => {
      const sample = info.jsonPathPropertyPairs[0];
      if (sample == null) return null;
      const samplePath = sample.jsonPath;
      const samplePathString = samplePath as unknown as string;
      return {
        info,
        samplePath,
        samplePathString,
        segmentCount: samplePathString.split('.').length,
      };
    })
    .filter(
      (
        entry,
      ): entry is {
        info: JsonPathsInfo;
        samplePath: JsonPath;
        samplePathString: string;
        segmentCount: number;
      } => entry != null,
    )
    .sort((left, right) => {
      if (left.segmentCount !== right.segmentCount) return left.segmentCount - right.segmentCount;
      return left.samplePathString.length - right.samplePathString.length;
    });

  invariant(
    rankedEntries.length > 0,
    `JsonPathPropertyPairs missing for properties under "${propertyPath}" when constructing flattening tables`,
  );

  const { samplePathString } = rankedEntries[0];
  const lastDot: number = samplePathString.lastIndexOf('.');
  invariant(
    lastDot !== -1,
    `Unable to determine container JsonPath for "${propertyPath}" using sample path "${samplePathString}"`,
  );

  return samplePathString.slice(0, lastDot) as JsonPath;
}

/**
 * Resolves the JsonPath for the table represented by the supplied table node.
 */
function resolveTableJsonPath(tableNode: FlatteningTableNode, apiSchemaData: EntityApiSchemaData): JsonPath {
  const { allJsonPathsMapping } = apiSchemaData;
  const collectionPath: JsonPath | null = resolveCollectionContainerPath(
    tableNode.tablePath,
    tableNode.property,
    apiSchemaData,
  );

  if (collectionPath != null) {
    return collectionPath;
  }

  return resolveNestedObjectPath(tableNode.tablePath, allJsonPathsMapping);
}

/**
 * Determines whether the provided jsonPath targets an extension payload.
 */
function isExtensionJsonPath(jsonPath: JsonPath): boolean {
  return jsonPath.includes('._ext.');
}

/**
 * Builds the root table metadata for the supplied entity.
 */
function createRootTable(entity: TopLevelEntity): TableMetadata {
  const namespace = entity.namespace as Namespace | undefined;
  const namespaceExtensionSuffix = namespace?.extensionEntitySuffix ?? 'Extension';
  const rawResourceName = entity.metaEdName;
  const isExtensionEntity = entity.type === 'domainEntityExtension' || entity.type === 'associationExtension';
  const resourceName =
    isExtensionEntity && !rawResourceName.endsWith(namespaceExtensionSuffix)
      ? `${rawResourceName}${namespaceExtensionSuffix}`
      : rawResourceName;
  const isExtensionTable = entity.type === 'domainEntityExtension' || entity.type === 'associationExtension';
  const table: TableMetadata = {
    baseName: resourceName,
    jsonPath: '$',
    columns: [],
    childTables: [],
  };

  if (isExtensionTable) table.isExtensionTable = true;
  if (entity.type === 'domainEntitySubclass' || entity.type === 'associationSubclass') {
    table.discriminatorValue = resourceName;
  }

  return table;
}

/**
 * Materialises the complete table hierarchy for the entity.
 */
function buildTablesForEntity(entity: TopLevelEntity, apiSchemaData: EntityApiSchemaData): TableMetadata {
  const tableNodes = collectTableNodes(entity);
  const rootTable = createRootTable(entity);
  const tableMap: Map<TablePath, TableMetadata> = new Map([[ROOT_TABLE_PATH, rootTable]]);

  const sortedNodes = sortTableNodes(tableNodes);

  sortedNodes.forEach((tableNode) => {
    const parentTable = tableMap.get(tableNode.parentPath);
    invariant(
      parentTable != null,
      `Parent table "${tableNode.parentPath}" was not initialised for "${tableNode.tablePath}"`,
    );

    const jsonPath = resolveTableJsonPath(tableNode, apiSchemaData);
    const normalizedJsonPath = normalizeReferenceCollectionJsonPath(jsonPath, tableNode, apiSchemaData);
    const tableSuffix = deriveTableSuffix(tableNode);
    const tableBaseName = `${parentTable.baseName}${tableSuffix}`;

    const table: TableMetadata = {
      baseName: tableBaseName,
      jsonPath: normalizedJsonPath,
      columns: [],
      childTables: [],
    };

    if (parentTable.isExtensionTable === true || isExtensionJsonPath(jsonPath)) {
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
function buildFlatteningMetadata(entity: TopLevelEntity, apiSchemaData: EntityApiSchemaData): FlatteningMetadata {
  const table = buildTablesForEntity(entity, apiSchemaData);
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
 * Enhancer entry point. Constructs the flattening table hierarchy for every API resource entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, ...entityTypesToEnhance).forEach((entity) => {
    const topLevelEntity = entity as TopLevelEntity;
    const apiSchemaData = topLevelEntity.data.edfiApiSchema as EntityApiSchemaData | undefined;
    if (apiSchemaData == null) return;

    apiSchemaData.flatteningMetadata = buildFlatteningMetadata(topLevelEntity, apiSchemaData);
  });

  return {
    enhancerName: 'FlatteningTableHierarchyEnhancer',
    success: true,
  };
}
