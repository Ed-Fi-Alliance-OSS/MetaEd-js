// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DecimalProperty,
  EntityProperty,
  MetaEdEnvironment,
  MetaEdPropertyPath,
  StringProperty,
  TopLevelEntity,
  getAllEntitiesOfType,
  type EnhancerResult,
  type AssociationProperty,
  type ChoiceProperty,
  type CommonProperty,
  type DomainEntityProperty,
  type InlineCommonProperty,
} from '@edfi/metaed-core';
import invariant from 'ts-invariant';
import { prefixedName, type PropertyModifier } from '../../model/PropertyModifier';
import { uncapitalize } from '../../Utility';
import type { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import type { JsonPath } from '../../model/api-schema/JsonPath';
import type { EntityPropertyApiSchemaData } from '../../model/EntityPropertyApiSchemaData';
import type { ColumnMetadata } from '../../model/flattening/ColumnMetadata';
import type { TableMetadata } from '../../model/flattening/TableMetadata';
import {
  ROOT_TABLE_PATH,
  collectTableNodes,
  deriveTableSuffix,
  sortTableNodes,
  type FlatteningTableNode,
  type TablePath,
} from './FlatteningTableRegistry';
import { buildFlatteningPropertyChains } from './FlatteningPropertyChainBuilder';
import { FlatteningPropertyChain } from '../../model/flattening/FlatteningPropertyChain';

type TableLookupResult = {
  tableMap: Map<TablePath, TableMetadata>;
  tablePathByReference: Map<TableMetadata, TablePath>;
};

const entityTypesToEnhance = [
  'association',
  'associationSubclass',
  'associationExtension',
  'domainEntity',
  'domainEntitySubclass',
  'domainEntityExtension',
] as const;

/**
 * Resolves table nodes and lookup maps needed to assign columns to flattening tables.
 */
function tableLookup(
  entity: TopLevelEntity,
  flatteningRoot: TableMetadata,
): {
  nodes: FlatteningTableNode[];
  nodesByKey: Map<MetaEdPropertyPath, FlatteningTableNode>;
  lookup: TableLookupResult;
} {
  const nodesByKey = collectTableNodes(entity);
  const nodes = sortTableNodes(nodesByKey);
  const tableMap: Map<TablePath, TableMetadata> = new Map([[ROOT_TABLE_PATH, flatteningRoot]]);
  const tablePathByReference: Map<TableMetadata, TablePath> = new Map([[flatteningRoot, ROOT_TABLE_PATH]]);

  nodes.forEach((node) => {
    const parentTable = tableMap.get(node.parentPath);
    invariant(
      parentTable != null,
      `Parent table "${node.parentPath}" not found while preparing column derivation for "${node.tablePath}"`,
    );

    const expectedChildBaseName = `${parentTable.baseName}${deriveTableSuffix(node)}`;
    const childTable = parentTable.childTables.find((table) => table.baseName === expectedChildBaseName);
    invariant(
      childTable != null,
      `Unable to locate table "${expectedChildBaseName}" under parent "${parentTable.baseName}"`,
    );

    tableMap.set(node.tablePath, childTable);
    tablePathByReference.set(childTable, node.tablePath);
  });

  return {
    nodes,
    nodesByKey,
    lookup: {
      tableMap,
      tablePathByReference,
    },
  };
}

/**
 * Builds a synthetic parent reference column linking a child table back to its parent table.
 */
function buildParentReferenceColumn(parentTable: TableMetadata): ColumnMetadata {
  return {
    columnName: `${parentTable.baseName}_Id`,
    columnType: 'bigint',
    isParentReference: true,
    isRequired: true,
  };
}

/**
 * Determines whether the supplied property represents a reference to another entity.
 */
function isReferenceProperty(property: EntityProperty): boolean {
  return property.type === 'association' || property.type === 'domainEntity';
}

/**
 * Identifies properties that serve structural purposes (commons, inline commons, choices).
 */
function isStructuralProperty(property: EntityProperty): boolean {
  return property.type === 'common' || property.type === 'inlineCommon' || property.type === 'choice';
}

/**
 * Maps a MetaEd property to the corresponding flattening column type.
 */
function columnTypeFor(property: EntityProperty): ColumnMetadata['columnType'] {
  switch (property.type) {
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'date';
    case 'datetime':
      return 'datetime';
    case 'duration':
      return 'duration';
    case 'time':
      return 'time';
    case 'decimal':
    case 'sharedDecimal':
      return 'decimal';
    case 'string':
    case 'sharedString':
      return 'string';
    case 'currency':
      return 'currency';
    case 'percent':
      return 'percent';
    case 'year':
      return 'year';
    case 'integer':
    case 'sharedInteger':
    case 'short':
    case 'sharedShort':
    case 'schoolYearEnumeration':
    case 'enumeration':
      return 'integer';
    case 'descriptor':
      return 'descriptor';
    default:
      return 'unknown';
  }
}

/**
 * Collects naming prefixes that should be applied to scalar columns based on the property chain.
 */
function collectScalarPrefixes(chain: EntityProperty[]): string[] {
  const prefixes: string[] = [];
  chain.slice(0, -1).forEach((property) => {
    const candidateSource = property.shortenTo !== '' ? property.shortenTo : property.roleName;
    const candidate = candidateSource === property.metaEdName ? '' : candidateSource;
    if (candidate !== '' && !prefixes.includes(candidate)) prefixes.push(candidate);
  });
  const target = chain.at(-1);
  if (target != null) {
    const targetSource = target.shortenTo !== '' ? target.shortenTo : target.roleName;
    const targetPrefix = targetSource === target.metaEdName ? '' : targetSource;
    if (targetPrefix !== '' && !prefixes.includes(targetPrefix)) prefixes.push(targetPrefix);
  }
  return prefixes;
}

/**
 * Collects naming prefixes that should be applied to reference columns based on the property chain.
 */
function collectReferencePrefixes(chain: EntityProperty[]): string[] {
  const prefixes: string[] = [];
  chain.slice(0, -1).forEach((property) => {
    const candidate = property.shortenTo !== '' ? property.shortenTo : property.roleName;
    if (candidate !== '' && !prefixes.includes(candidate)) prefixes.push(candidate);
  });
  const target = chain.at(-1);
  if (target != null) {
    const candidate = target.shortenTo !== '' ? target.shortenTo : target.roleName;
    if (candidate !== '' && !prefixes.includes(candidate)) prefixes.push(candidate);
  }
  return prefixes;
}

/**
 * Resolves a property chain for the supplied property path, traversing nested referenced entities as needed.
 */
function resolvePropertyChain(entity: TopLevelEntity, propertyPath: string): EntityProperty[] {
  if (propertyPath === '') return [];
  const segments = propertyPath.split('.');
  const chain: EntityProperty[] = [];
  let currentEntity: TopLevelEntity | undefined = entity;

  segments.forEach((segment) => {
    if (currentEntity == null) return;
    const property = currentEntity.properties.find(
      (candidate) => candidate.fullPropertyName === segment || candidate.metaEdName === segment,
    );
    if (property == null) return;
    chain.push(property);

    switch (property.type) {
      case 'common':
        currentEntity = (property as CommonProperty).referencedEntity;
        break;
      case 'inlineCommon':
        currentEntity = (property as InlineCommonProperty).referencedEntity;
        break;
      case 'choice':
        currentEntity = (property as ChoiceProperty).referencedEntity;
        break;
      case 'association':
        currentEntity = (property as AssociationProperty).referencedEntity;
        break;
      case 'domainEntity':
        currentEntity = (property as DomainEntityProperty).referencedEntity;
        break;
      default:
        currentEntity = undefined;
        break;
    }
  });

  return chain;
}

/**
 * Converts a property chain into its canonical MetaEd property path representation.
 */
function propertyChainPath(chain: EntityProperty[]): MetaEdPropertyPath {
  return chain.map((property) => property.fullPropertyName).join('.') as MetaEdPropertyPath;
}

/**
 * Determines which flattening table path a property chain belongs to by scanning for known table nodes.
 */
function determineTablePathForChain(
  chain: EntityProperty[],
  nodesByKey: Map<MetaEdPropertyPath, FlatteningTableNode>,
): TablePath {
  for (let index = chain.length - 1; index >= 0; index -= 1) {
    const candidatePath = propertyChainPath(chain.slice(0, index + 1));
    if (nodesByKey.has(candidatePath)) return candidatePath;
  }

  return ROOT_TABLE_PATH;
}

/**
 * Normalises descriptor property paths so related scalar properties share the same canonical key.
 */
function canonicalPropertyPath(propertyPath: string, sourceProperty: EntityProperty): MetaEdPropertyPath {
  if (sourceProperty.type === 'descriptor') {
    if (propertyPath.endsWith('Descriptor')) {
      return propertyPath.slice(0, -'Descriptor'.length) as MetaEdPropertyPath;
    }
  }

  return propertyPath as MetaEdPropertyPath;
}

/**
 * Determines whether a property should be treated as optional due to optional ancestors in its chain.
 */
function isOptionalDueToParent(chain: EntityProperty[]): boolean {
  return chain
    .slice(0, -1)
    .filter((property) => property.type !== 'inlineCommon' && property.type !== 'choice' && property.type !== 'common')
    .some((property) => property.isOptional || property.isOptionalCollection);
}

/**
 * Builds column metadata for scalar properties, including optionality and length/precision details.
 */
function buildScalarColumn(
  jsonPath: JsonPath,
  containerJsonPath: JsonPath | null,
  sourceProperty: EntityProperty,
  chain: EntityProperty[],
  optionalDueToParentOverride: boolean | null,
): ColumnMetadata {
  const modifier: PropertyModifier = {
    optionalDueToParent: optionalDueToParentOverride != null ? optionalDueToParentOverride : isOptionalDueToParent(chain),
    parentPrefixes: collectScalarPrefixes(chain),
  };

  const propertyApiData = sourceProperty.data?.edfiApiSchema as EntityPropertyApiSchemaData | undefined;
  const apiMapping = propertyApiData?.apiMapping;
  const jsonPropertyBaseName = apiMapping?.fullNamePreservingPrefix ?? sourceProperty.metaEdName;
  const jsonPropertySegment = uncapitalize(prefixedName(jsonPropertyBaseName, modifier));
  const effectiveJsonPath: JsonPath =
    containerJsonPath != null && !jsonPath.includes('[*]')
      ? (`${containerJsonPath}.${jsonPropertySegment}` as JsonPath)
      : jsonPath;
  const optionalDueToParent = modifier.optionalDueToParent && containerJsonPath == null;

  const column: ColumnMetadata = {
    columnName: prefixedName(sourceProperty.metaEdName, modifier),
    columnType: columnTypeFor(sourceProperty),
    jsonPath: effectiveJsonPath,
    isRequired: (sourceProperty.isRequired || sourceProperty.isPartOfIdentity) && !optionalDueToParent,
  };

  if (sourceProperty.isPartOfIdentity) column.isNaturalKey = true;

  if (column.columnType === 'string') {
    const candidate = sourceProperty as Partial<StringProperty>;
    if (candidate.maxLength != null) column.maxLength = candidate.maxLength;
  }

  if (column.columnType === 'decimal') {
    const candidate = sourceProperty as Partial<DecimalProperty>;
    if (candidate.totalDigits != null) column.precision = candidate.totalDigits;
    if (candidate.decimalPlaces != null) column.scale = candidate.decimalPlaces;
  }

  return column;
}

/**
 * Locates the base reference path for a referential property within a JSON path mapping entry.
 */
function baseReferencePath(propertyPath: string, sourceProperty: EntityProperty): MetaEdPropertyPath {
  const segments = propertyPath.split('.');
  const targetFullName = sourceProperty.fullPropertyName;
  const targetMetaName = sourceProperty.metaEdName;
  const indexByFullName = segments.lastIndexOf(targetFullName);
  if (indexByFullName !== -1) {
    return segments.slice(0, indexByFullName + 1).join('.') as MetaEdPropertyPath;
  }

  const indexByMetaName = segments.lastIndexOf(targetMetaName);
  if (indexByMetaName !== -1) {
    return segments.slice(0, indexByMetaName + 1).join('.') as MetaEdPropertyPath;
  }

  return propertyPath as MetaEdPropertyPath;
}

/**
 * Builds column metadata for reference properties, including keys back to `documentPathsMapping`.
 */
function buildReferenceColumn(
  propertyPath: string,
  sourceProperty: EntityProperty,
  chain: EntityProperty[],
  optionalDueToParentOverride: boolean | null,
): ColumnMetadata {
  const referencePath = baseReferencePath(propertyPath, sourceProperty);
  const prefixes = collectReferencePrefixes(chain);
  const prefixSegment = prefixes.length === 0 ? '' : `${prefixes.join('_')}_`;
  const columnName = `${prefixSegment}${sourceProperty.metaEdName}_Id`;
  const optionalDueToParent =
    optionalDueToParentOverride != null ? optionalDueToParentOverride : isOptionalDueToParent(chain);
  const isCollectionProperty =
    sourceProperty.isCollection || sourceProperty.isOptionalCollection || sourceProperty.isRequiredCollection;

  return {
    columnName,
    columnType: 'bigint',
    fromReferencePath: referencePath,
    isRequired:
      (sourceProperty.isRequired || sourceProperty.isPartOfIdentity || isCollectionProperty) && !optionalDueToParent,
    ...(sourceProperty.isPartOfIdentity ? { isNaturalKey: true } : {}),
  };
}

/**
 * Adds a column to the per-table collection, initialising the entry when necessary.
 */
function pushColumn(columnsByTable: Map<TablePath, ColumnMetadata[]>, tablePath: TablePath, column: ColumnMetadata): void {
  const existing = columnsByTable.get(tablePath);
  if (existing == null) {
    columnsByTable.set(tablePath, [column]);
  } else {
    existing.push(column);
  }
}

/**
 * Derives scalar and reference columns for every table in the flattening hierarchy.
 */
function collectColumns(
  entity: TopLevelEntity,
  apiSchemaData: EntityApiSchemaData,
  tableMap: Map<TablePath, TableMetadata>,
  nodesByKey: Map<MetaEdPropertyPath, FlatteningTableNode>,
): Map<TablePath, ColumnMetadata[]> {
  const columnsByTable: Map<TablePath, ColumnMetadata[]> = new Map();
  const processedKeys: Set<string> = new Set();
  const referencePropertyPaths: Set<MetaEdPropertyPath> = new Set();

  const propertyChains: FlatteningPropertyChain[] = buildFlatteningPropertyChains(entity);
  const chainsByPath: Map<MetaEdPropertyPath, FlatteningPropertyChain> = new Map();
  propertyChains.forEach((chainEntry) => {
    chainsByPath.set(chainEntry.fullPropertyPath, chainEntry);
  });
  const collectedChainsByPath: Map<MetaEdPropertyPath, EntityProperty[]> = new Map();
  const collectedProperties = apiSchemaData.collectedApiProperties;
  collectedProperties.forEach((collected) => {
    const collectedPath = propertyChainPath(collected.propertyChain);
    collectedChainsByPath.set(collectedPath, collected.propertyChain);
  });

  Object.entries(apiSchemaData.allJsonPathsMapping).forEach(([propertyPath, info]) => {
    info.jsonPathPropertyPairs.forEach((pair) => {
      const { sourceProperty, jsonPath } = pair;
      if (isStructuralProperty(sourceProperty)) return;

      const canonicalPath = canonicalPropertyPath(propertyPath, sourceProperty);
      const chainEntry = chainsByPath.get(canonicalPath);

      let chain: EntityProperty[];
      let tablePath: TablePath;

      if (chainEntry != null) {
        chain = chainEntry.propertyChain;
        if (chain.length === 0) return;
        tablePath = determineTablePathForChain(chain, nodesByKey);
        if (!tableMap.has(tablePath)) return;
      } else {
        const fallbackChain = collectedChainsByPath.get(canonicalPath) ?? resolvePropertyChain(entity, canonicalPath);
        if (fallbackChain.length === 0) return;
        chain = fallbackChain;
        tablePath = determineTablePathForChain(chain, nodesByKey);
        if (!tableMap.has(tablePath)) return;
      }

      const chainEntryOptionalDueToParent = chainEntry?.propertyModifier.optionalDueToParent;
      const derivedOptionalDueToParent = isOptionalDueToParent(chain);
      const effectiveOptionalDueToParent =
        chainEntryOptionalDueToParent === undefined
          ? derivedOptionalDueToParent
          : chainEntryOptionalDueToParent && derivedOptionalDueToParent;

      if (isReferenceProperty(sourceProperty)) {
        const referencePath = baseReferencePath(propertyPath, sourceProperty);
        const keySignature = `${tablePath}|ref|${referencePath}`;
        if (processedKeys.has(keySignature)) return;
        processedKeys.add(keySignature);
        const column = buildReferenceColumn(propertyPath, sourceProperty, chain, effectiveOptionalDueToParent);
        pushColumn(columnsByTable, tablePath, column);
        referencePropertyPaths.add(referencePath);
        return;
      }
      const matchesReferencePath = Array.from(referencePropertyPaths).some(
        (referencePath) => canonicalPath === referencePath || canonicalPath.startsWith(`${referencePath}.`),
      );
      if (matchesReferencePath) return;
      const keySignature = `${tablePath}|scalar|${canonicalPath}|${jsonPath}`;
      if (processedKeys.has(keySignature)) return;
      processedKeys.add(keySignature);
      const column = buildScalarColumn(
        jsonPath,
        info.collectionContainerJsonPath ?? null,
        sourceProperty,
        chain,
        effectiveOptionalDueToParent,
      );
      if (
        tablePath === ROOT_TABLE_PATH &&
        sourceProperty.isPartOfIdentity &&
        (sourceProperty.parentEntity !== entity || entity.type === 'domainEntitySubclass') &&
        entity.baseEntity != null
      ) {
        column.isSuperclassIdentity = true;
      }
      pushColumn(columnsByTable, tablePath, column);
    });
  });

  return columnsByTable;
}

/**
 * Rebuilds a table hierarchy by injecting derived columns into each table recursively.
 */
function rebuildTableWithColumns(
  tablePath: TablePath,
  table: TableMetadata,
  tablePathByReference: Map<TableMetadata, TablePath>,
  columnsByTable: Map<TablePath, ColumnMetadata[]>,
): TableMetadata {
  const newColumns = columnsByTable.get(tablePath) ?? [];
  const rebuiltChildren = table.childTables.map((child) => {
    const childPath = tablePathByReference.get(child);
    invariant(childPath != null, `Missing table path mapping for child table "${child.baseName}"`);
    return rebuildTableWithColumns(childPath, child, tablePathByReference, columnsByTable);
  });

  return {
    ...table,
    columns: newColumns,
    childTables: rebuiltChildren,
  };
}

/**
 * Populates flattening tables with column metadata for every eligible MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, ...entityTypesToEnhance).forEach((entity) => {
    const topLevelEntity = entity as TopLevelEntity;
    const apiSchemaData = topLevelEntity.data.edfiApiSchema as EntityApiSchemaData | undefined;
    if (apiSchemaData == null) return;
    const existingMetadata = apiSchemaData.flatteningMetadata;
    if (existingMetadata == null) return;

    const { nodes, nodesByKey, lookup } = tableLookup(topLevelEntity, existingMetadata.table);
    const columnsByTable = collectColumns(topLevelEntity, apiSchemaData, lookup.tableMap, nodesByKey);

    nodes.forEach((node) => {
      const parentTable = lookup.tableMap.get(node.parentPath);
      const childTable = lookup.tableMap.get(node.tablePath);
      if (parentTable == null || childTable == null) return;
      const columns = columnsByTable.get(node.tablePath) ?? [];
      columns.push(buildParentReferenceColumn(parentTable));
      columnsByTable.set(node.tablePath, columns);
    });

    const rebuiltRoot = rebuildTableWithColumns(
      ROOT_TABLE_PATH,
      existingMetadata.table,
      lookup.tablePathByReference,
      columnsByTable,
    );

    apiSchemaData.flatteningMetadata = {
      ...existingMetadata,
      table: rebuiltRoot,
    };
  });

  return {
    enhancerName: 'FlatteningColumnMetadataEnhancer',
    success: true,
  };
}
