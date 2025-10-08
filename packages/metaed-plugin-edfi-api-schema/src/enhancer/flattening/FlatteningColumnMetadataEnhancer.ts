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
import { canonicalRoleNamePrefix, uncapitalize } from '../../Utility';
import type { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import type { JsonPath } from '../../model/api-schema/JsonPath';
import type { EntityPropertyApiSchemaData } from '../../model/EntityPropertyApiSchemaData';
import type { ColumnMetadata } from '../../model/flattening/ColumnMetadata';
import type { TableMetadata } from '../../model/flattening/TableMetadata';
import type { FlatteningTableNode, TablePath } from '../../model/flattening/FlatteningTableNode';
import { ROOT_TABLE_PATH, collectTableNodes, deriveTableSuffix, sortTableNodes } from './FlatteningTableHelper';
import { buildFlatteningPropertyChains } from './FlatteningPropertyChainBuilder';
import { FlatteningPropertyChain } from '../../model/flattening/FlatteningPropertyChain';

/**
 * Aggregated lookup structures tying MetaEd property paths to their concrete flattening tables.
 */
type TableLookupResult = {
  orderedNodes: FlatteningTableNode[];
  nodesByPath: Map<MetaEdPropertyPath, FlatteningTableNode>;
  tablesByPath: Map<TablePath, TableMetadata>;
  pathByTable: Map<TableMetadata, TablePath>;
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
 * Resolves the ordered table nodes and builds forward/backward lookup maps so column derivation
 * can jump from a MetaEd property path straight to the corresponding TableMetadata entry.
 */
function buildFlatteningTableLookup(entity: TopLevelEntity, flatteningRoot: TableMetadata): TableLookupResult {
  const nodesByPath = collectTableNodes(entity);
  const orderedNodes = sortTableNodes(nodesByPath);
  const tablesByPath: Map<TablePath, TableMetadata> = new Map([[ROOT_TABLE_PATH, flatteningRoot]]);
  const pathByTable: Map<TableMetadata, TablePath> = new Map([[flatteningRoot, ROOT_TABLE_PATH]]);

  orderedNodes.forEach((node) => {
    // Every non-root node must have a previously registered parent table.
    const parentTable = tablesByPath.get(node.parentPath);
    invariant(
      parentTable != null,
      `Parent table "${node.parentPath}" not found while preparing column derivation for "${node.tablePath}"`,
    );

    // Identify the child table by combining the parent's base name with the computed suffix.
    const expectedChildBaseName = `${parentTable.baseName}${deriveTableSuffix(node)}`;
    const childTable = parentTable.childTables.find((table) => table.baseName === expectedChildBaseName);
    invariant(
      childTable != null,
      `Unable to locate table "${expectedChildBaseName}" under parent "${parentTable.baseName}"`,
    );

    // Register the table for path-based lookup and, reciprocally, allow metadata → path lookups.
    tablesByPath.set(node.tablePath, childTable);
    pathByTable.set(childTable, node.tablePath);
  });

  return {
    orderedNodes,
    nodesByPath,
    tablesByPath,
    pathByTable,
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
 * Appends the prefix to the collection if it is non-empty and not already present.
 */
function appendUniquePrefix(prefixes: string[], prefix: string): void {
  if (prefix !== '' && !prefixes.includes(prefix)) {
    prefixes.push(prefix);
  }
}

/**
 * Collects naming prefixes that should be applied to scalar columns based on the property chain.
 */
function collectScalarPrefixes(propertyChain: EntityProperty[]): string[] {
  const prefixes: string[] = [];
  propertyChain.forEach((property) => {
    const candidate = canonicalRoleNamePrefix(property);
    const prefix = candidate === property.metaEdName ? '' : candidate;
    appendUniquePrefix(prefixes, prefix);
  });
  return prefixes;
}

/**
 * Collects naming prefixes that should be applied to reference columns based on the property chain.
 */
function collectReferencePrefixes(propertyChain: EntityProperty[]): string[] {
  const prefixes: string[] = [];
  propertyChain.forEach((property) => {
    const prefix = canonicalRoleNamePrefix(property);
    appendUniquePrefix(prefixes, prefix);
  });
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
  nodesByPath: Map<MetaEdPropertyPath, FlatteningTableNode>,
): TablePath {
  for (let index = chain.length - 1; index >= 0; index -= 1) {
    const candidatePath = propertyChainPath(chain.slice(0, index + 1));
    if (nodesByPath.has(candidatePath)) return candidatePath;
  }

  return ROOT_TABLE_PATH;
}

/**
 * Normalizes descriptor property paths so related scalar properties share the same canonical key.
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
 * Adds a column to the per-table collection, initializing the entry when necessary.
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
 * Captures precomputed property chain information keyed by canonical property path.
 */
type ChainLookup = {
  chainsByPath: Map<MetaEdPropertyPath, FlatteningPropertyChain>;
  collectedChainsByPath: Map<MetaEdPropertyPath, EntityProperty[]>;
};

/**
 * Tracks mutable state while accumulating columns to avoid duplicates and record reference paths.
 */
type ColumnProcessingState = {
  columnsByTable: Map<TablePath, ColumnMetadata[]>;
  processedKeys: Set<string>;
  referencePropertyPaths: Set<MetaEdPropertyPath>;
};

/**
 * Represents the outcome of mapping a canonical property path to its owning table and chain metadata.
 */
type ChainResolution = {
  chain: EntityProperty[];
  tablePath: TablePath;
  modifierOptionalDueToParent: boolean | undefined;
};

/**
 * Builds lookup maps to translate canonical property paths into the corresponding property chains.
 */
function buildChainLookup(entity: TopLevelEntity, apiSchemaData: EntityApiSchemaData): ChainLookup {
  const chainsByPath: Map<MetaEdPropertyPath, FlatteningPropertyChain> = new Map();
  buildFlatteningPropertyChains(entity).forEach((chainEntry) => {
    chainsByPath.set(chainEntry.fullPropertyPath, chainEntry);
  });

  const collectedChainsByPath: Map<MetaEdPropertyPath, EntityProperty[]> = new Map();
  apiSchemaData.collectedApiProperties.forEach((collected) => {
    const collectedPath = propertyChainPath(collected.propertyChain);
    collectedChainsByPath.set(collectedPath, collected.propertyChain);
  });

  return { chainsByPath, collectedChainsByPath };
}

/**
 * Resolves the property chain and table path associated with the supplied canonical property path.
 */
function resolveChainForProperty(
  entity: TopLevelEntity,
  canonicalPath: MetaEdPropertyPath,
  lookup: ChainLookup,
  nodesByPath: Map<MetaEdPropertyPath, FlatteningTableNode>,
  tablesByPath: Map<TablePath, TableMetadata>,
): ChainResolution | null {
  // Get the chain assembled during primary flattening when available
  const chainEntry = lookup.chainsByPath.get(canonicalPath);
  if (chainEntry != null) {
    const tablePath = determineTablePathForChain(chainEntry.propertyChain, nodesByPath);
    if (!tablesByPath.has(tablePath) || chainEntry.propertyChain.length === 0) return null;
    return {
      chain: chainEntry.propertyChain,
      tablePath,
      modifierOptionalDueToParent: chainEntry.propertyModifier.optionalDueToParent,
    };
  }

  // Otherwise get the chain collected from API properties or find directly
  const propertyChainFromLookup: EntityProperty[] =
    lookup.collectedChainsByPath.get(canonicalPath) ?? resolvePropertyChain(entity, canonicalPath as string);
  if (propertyChainFromLookup.length === 0) return null;
  const tablePath = determineTablePathForChain(propertyChainFromLookup, nodesByPath);
  if (!tablesByPath.has(tablePath)) return null;
  return { chain: propertyChainFromLookup, tablePath, modifierOptionalDueToParent: undefined };
}

/**
 * Determines whether a property should be treated as optional because any parent in its chain is optional.
 */
function computeEffectiveOptionalDueToParent(chainResolution: ChainResolution, chain: EntityProperty[]): boolean {
  const derivedOptionalDueToParent = isOptionalDueToParent(chain);
  const { modifierOptionalDueToParent } = chainResolution;

  if (modifierOptionalDueToParent === undefined) {
    return derivedOptionalDueToParent;
  }

  return modifierOptionalDueToParent && derivedOptionalDueToParent;
}

/**
 * Adds a reference column for the supplied property if an equivalent column has not already been processed.
 */
function processReferenceProperty(
  state: ColumnProcessingState,
  referenceInfo: {
    propertyPath: string;
    tablePath: TablePath;
    sourceProperty: EntityProperty;
    chain: EntityProperty[];
    optionalDueToParent: boolean;
  },
): void {
  const referencePath = baseReferencePath(referenceInfo.propertyPath, referenceInfo.sourceProperty);
  // Avoid duplicate reference columns introduced through multiple mapping paths.
  const keySignature = `${referenceInfo.tablePath}|ref|${referencePath}`;
  if (state.processedKeys.has(keySignature)) return;
  state.processedKeys.add(keySignature);

  const column = buildReferenceColumn(
    referenceInfo.propertyPath,
    referenceInfo.sourceProperty,
    referenceInfo.chain,
    referenceInfo.optionalDueToParent,
  );
  pushColumn(state.columnsByTable, referenceInfo.tablePath, column);
  state.referencePropertyPaths.add(referencePath);
}

/**
 * Indicates whether a canonical property path is covered by a previously processed reference.
 */
function isCoveredByReference(canonicalPath: MetaEdPropertyPath, referencePropertyPaths: Set<MetaEdPropertyPath>): boolean {
  return Array.from(referencePropertyPaths).some(
    (referencePath) => canonicalPath === referencePath || canonicalPath.startsWith(`${referencePath}.`),
  );
}

/**
 * Adds a scalar column for the supplied property when no prior column covers the same source path.
 */
function processScalarProperty(
  state: ColumnProcessingState,
  scalarInfo: {
    tablePath: TablePath;
    canonicalPath: MetaEdPropertyPath;
    jsonPath: JsonPath;
    collectionContainerJsonPath: JsonPath | null;
    sourceProperty: EntityProperty;
    chain: EntityProperty[];
    optionalDueToParent: boolean;
    entity: TopLevelEntity;
  },
): void {
  // Avoid duplicate scalar columns that originate from the same canonical path/JsonPath pair.
  const keySignature = `${scalarInfo.tablePath}|scalar|${scalarInfo.canonicalPath}|${scalarInfo.jsonPath}`;
  if (state.processedKeys.has(keySignature)) return;
  state.processedKeys.add(keySignature);

  const column = buildScalarColumn(
    scalarInfo.jsonPath,
    scalarInfo.collectionContainerJsonPath,
    scalarInfo.sourceProperty,
    scalarInfo.chain,
    scalarInfo.optionalDueToParent,
  );

  if (
    scalarInfo.tablePath === ROOT_TABLE_PATH &&
    scalarInfo.sourceProperty.isPartOfIdentity &&
    (scalarInfo.sourceProperty.parentEntity !== scalarInfo.entity ||
      scalarInfo.entity.type === 'domainEntitySubclass' ||
      scalarInfo.entity.type === 'associationSubclass') &&
    scalarInfo.entity.baseEntity != null
  ) {
    column.isSuperclassIdentity = true;
  }

  pushColumn(state.columnsByTable, scalarInfo.tablePath, column);
}

/**
 * Aggregates all scalar and reference columns for each table discovered in the flattening hierarchy.
 */
function collectColumns(
  entity: TopLevelEntity,
  apiSchemaData: EntityApiSchemaData,
  tablesByPath: Map<TablePath, TableMetadata>,
  nodesByPath: Map<MetaEdPropertyPath, FlatteningTableNode>,
): Map<TablePath, ColumnMetadata[]> {
  // Shared state keeps track of emitted columns and avoids duplicates across merge paths.
  const state: ColumnProcessingState = {
    columnsByTable: new Map(),
    processedKeys: new Set(),
    referencePropertyPaths: new Set(),
  };
  const chainLookup: ChainLookup = buildChainLookup(entity, apiSchemaData);

  Object.entries(apiSchemaData.allJsonPathsMapping).forEach(([propertyPath, info]) => {
    info.jsonPathPropertyPairs.forEach((pair) => {
      const { sourceProperty, jsonPath } = pair;
      if (isStructuralProperty(sourceProperty)) return;

      const canonicalPath: MetaEdPropertyPath = canonicalPropertyPath(propertyPath, sourceProperty);
      const chainResolution: ChainResolution | null = resolveChainForProperty(
        entity,
        canonicalPath,
        chainLookup,
        nodesByPath,
        tablesByPath,
      );
      if (chainResolution == null) return;

      const optionalDueToParent = computeEffectiveOptionalDueToParent(chainResolution, chainResolution.chain);

      if (isReferenceProperty(sourceProperty)) {
        // Each reference path yields at most one column; duplicates are skipped by processReferenceProperty.
        processReferenceProperty(state, {
          propertyPath,
          tablePath: chainResolution.tablePath,
          sourceProperty,
          chain: chainResolution.chain,
          optionalDueToParent,
        });
        return;
      }

      if (isCoveredByReference(canonicalPath, state.referencePropertyPaths)) return;

      // Scalar processing mirrors the reference flow, adding dedupe and optionality handling.
      processScalarProperty(state, {
        tablePath: chainResolution.tablePath,
        canonicalPath,
        jsonPath,
        collectionContainerJsonPath: info.collectionContainerJsonPath ?? null,
        sourceProperty,
        chain: chainResolution.chain,
        optionalDueToParent,
        entity,
      });
    });
  });

  return state.columnsByTable;
}

/**
 * Adds columns into each TableMetadata recursively.
 */
function addColumnsToHierarchy(
  tablePath: TablePath,
  table: TableMetadata,
  pathByTable: Map<TableMetadata, TablePath>,
  columnsByTable: Map<TablePath, ColumnMetadata[]>,
): TableMetadata {
  const newColumns = columnsByTable.get(tablePath) ?? [];
  const updatedChildTables = table.childTables.map((childTable: TableMetadata) => {
    const childPath = pathByTable.get(childTable);
    invariant(childPath != null, `Missing table path mapping for child table "${childTable.baseName}"`);
    return addColumnsToHierarchy(childPath, childTable, pathByTable, columnsByTable);
  });

  return {
    ...table,
    columns: newColumns,
    childTables: updatedChildTables,
  };
}

/**
 * Populates flattening tables with column metadata for every eligible MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, ...entityTypesToEnhance).forEach((entity) => {
    const topLevelEntity = entity as TopLevelEntity;
    const apiSchemaData = topLevelEntity.data.edfiApiSchema as EntityApiSchemaData;
    const existingMetadata = apiSchemaData.flatteningMetadata;
    if (existingMetadata == null) return;

    const { orderedNodes, nodesByPath, tablesByPath, pathByTable } = buildFlatteningTableLookup(
      topLevelEntity,
      existingMetadata.table,
    );

    const columnsByTablePath: Map<TablePath, ColumnMetadata[]> = collectColumns(
      topLevelEntity,
      apiSchemaData,
      tablesByPath,
      nodesByPath,
    );

    // Ensure every child table can be joined back to its parent by injecting a synthetic FK column.
    orderedNodes.forEach((node) => {
      const parentTable: TableMetadata | undefined = tablesByPath.get(node.parentPath);
      const childTable: TableMetadata | undefined = tablesByPath.get(node.tablePath);
      if (parentTable == null || childTable == null) return;

      const columns: ColumnMetadata[] = columnsByTablePath.get(node.tablePath) ?? [];
      columns.push(buildParentReferenceColumn(parentTable));
      columnsByTablePath.set(node.tablePath, columns);
    });

    const table: TableMetadata = addColumnsToHierarchy(
      ROOT_TABLE_PATH,
      existingMetadata.table,
      pathByTable,
      columnsByTablePath,
    );

    apiSchemaData.flatteningMetadata = {
      ...existingMetadata,
      table,
    };
  });

  return {
    enhancerName: 'FlatteningColumnMetadataEnhancer',
    success: true,
  };
}
