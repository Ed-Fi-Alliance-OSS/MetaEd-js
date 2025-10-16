// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DecimalProperty,
  EntityProperty,
  MetaEdEnvironment,
  MetaEdPropertyPath,
  ReferentialProperty,
  StringProperty,
  TopLevelEntity,
  getAllEntitiesOfType,
  type AssociationProperty,
  type ChoiceProperty,
  type CommonProperty,
  type DomainEntityProperty,
  type EnhancerResult,
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
 * Captures a table definition along with helper state used while populating column metadata.
 */
type TableAssembly = {
  /**
   * Path that identifies the table within the flattening hierarchy.
   */
  tablePath: TablePath;
  /**
   * Assembled table metadata that will be attached to the ApiSchema.
   */
  metadata: TableMetadata;
  /**
   * Tracks emitted column signatures to avoid duplicate scalar/reference columns.
   */
  processedKeys: Set<string>;
  /**
   * Synthetic parent reference column that should be appended after all data columns.
   */
  parentReferenceColumn?: ColumnMetadata;
};

/**
 * Represents the outcome of building the table hierarchy, including lookup structures.
 */
type TablePreparation = {
  /**
   * Root table assembly that anchors the hierarchy.
   */
  rootAssembly: TableAssembly;
  /**
   * Lookup from table path to the working assembly used while building columns.
   */
  assembliesByPath: Map<TablePath, TableAssembly>;
  /**
   * Table nodes keyed by MetaEd property path for quick traversal.
   */
  nodesByPath: Map<MetaEdPropertyPath, FlatteningTableNode>;
};

/**
 * Captures precomputed property chains used while resolving canonical property paths.
 */
type ChainLookup = {
  /**
   * Canonical property chains derived from the flattening property chain builder.
   */
  chainsByPath: Map<MetaEdPropertyPath, FlatteningPropertyChain>;
  /**
   * Property chains collected from ApiSchema.
   */
  collectedChainsByPath: Map<MetaEdPropertyPath, EntityProperty[]>;
};

/**
 * Represents the outcome of mapping a canonical property path to a table and property chain.
 */
type ChainResolution = {
  /**
   * Entity property chain that leads to the resolved table.
   */
  chain: EntityProperty[];
  /**
   * Flattening table path that owns the chain's terminal property.
   */
  tablePath: TablePath;
  /**
   * Optional modifier hint indicating if ancestors mark the property as optional.
   */
  modifierOptionalDueToParent: boolean | undefined;
};

/**
 * Aggregates state used while emitting column metadata.
 */
type ColumnProcessingContext = {
  /**
   * Assemblies keyed by table path for in-place column accumulation.
   */
  assembliesByPath: Map<TablePath, TableAssembly>;
  /**
   * Canonical reference paths already processed, preventing duplicate scalar emissions.
   */
  referencePropertyPaths: Set<MetaEdPropertyPath>;
};

const ROOT_JSON_PATH = '$' as JsonPath;
const MISSING_TABLE_JSON_PATH = '###' as JsonPath;

const entityTypesToEnhance = [
  'association',
  'associationSubclass',
  'associationExtension',
  'domainEntity',
  'domainEntitySubclass',
  'domainEntityExtension',
] as const;

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

  let jsonPath: JsonPath = ROOT_JSON_PATH;
  if (isExtensionEntity) {
    invariant(
      entity.baseEntity != null,
      `Extension entity "${entity.namespace.projectName}.${entity.metaEdName}" is missing its base entity`,
    );

    jsonPath = `$._ext.${entity.namespace.projectName.toLowerCase()}` as JsonPath;
  }

  return {
    baseName,
    jsonPath,
    columns: [],
    childTables: [],
    ...(isExtensionEntity ? { isExtensionTable: true } : {}),
    ...(isSubclassEntity ? { discriminatorValue: baseName } : {}),
  };
}

/**
 * Determines whether a child table should be marked as part of an extension payload.
 * DMS-832 will provide more robust extension support.
 */
function derivesExtensionTable(property: EntityProperty, parentTable: TableMetadata): boolean {
  if (parentTable.isExtensionTable === true) return true;

  if (property.type === 'common') {
    const commonProperty = property as CommonProperty;
    if (commonProperty.isExtensionOverride) return true;
  }

  const { referencedEntity } = property as ReferentialProperty;
  if (referencedEntity?.namespace.isExtension === true) {
    return true;
  }

  return false;
}

/**
 * Builds an assembly for the root table and initializes lookup structures for additional tables.
 */
function initializeTablePreparation(entity: TopLevelEntity): TablePreparation {
  const nodesByPath = collectTableNodes(entity);
  const orderedNodes = sortTableNodes(nodesByPath);
  const rootMetadata = createRootTable(entity);
  const rootAssembly: TableAssembly = {
    tablePath: ROOT_TABLE_PATH,
    metadata: rootMetadata,
    processedKeys: new Set(),
  };
  if (entity.type === 'domainEntityExtension' || entity.type === 'associationExtension') {
    invariant(
      entity.baseEntity != null,
      `Extension entity "${entity.namespace.projectName}.${entity.metaEdName}" is missing its base entity`,
    );
    const parentBaseName = createRootTable(entity.baseEntity).baseName;
    rootAssembly.parentReferenceColumn = {
      columnName: `${parentBaseName}_Id`,
      columnType: 'bigint',
      isParentReference: true,
      isRequired: true,
    };
  }
  const assembliesByPath: Map<TablePath, TableAssembly> = new Map([[ROOT_TABLE_PATH, rootAssembly]]);

  orderedNodes.forEach((node) => {
    const parentAssembly = assembliesByPath.get(node.parentPath);
    invariant(parentAssembly != null, `Parent table "${node.parentPath}" was not initialized for "${node.tablePath}"`);

    const childJsonPath = node.collectionJsonPath ?? MISSING_TABLE_JSON_PATH;

    const childMetadata: TableMetadata = {
      baseName: `${parentAssembly.metadata.baseName}${deriveTableSuffix(node)}`,
      jsonPath: childJsonPath,
      columns: [],
      childTables: [],
    };

    if (derivesExtensionTable(node.property, parentAssembly.metadata)) {
      childMetadata.isExtensionTable = true;
    }

    parentAssembly.metadata.childTables.push(childMetadata);

    const childAssembly: TableAssembly = {
      tablePath: node.tablePath,
      metadata: childMetadata,
      processedKeys: new Set(),
      parentReferenceColumn: {
        columnName: `${parentAssembly.metadata.baseName}_Id`,
        columnType: 'bigint',
        isParentReference: true,
        isRequired: true,
      },
    };

    assembliesByPath.set(node.tablePath, childAssembly);
  });

  return {
    rootAssembly,
    assembliesByPath,
    nodesByPath,
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
  return chain.slice(0, -1).some((property) => {
    if (property.type === 'choice') {
      // Only one branch of a choice can be populated, so descendant columns must be nullable.
      return true;
    }
    if (property.type === 'common') {
      // Commons materialize into their own tables; if the row exists, the property values must follow original cardinality.
      return false;
    }
    return property.isOptional || property.isOptionalCollection;
  });
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
  const { optionalDueToParent } = modifier;

  const column: ColumnMetadata = {
    columnName: prefixedName(sourceProperty.metaEdName, modifier),
    columnType: columnTypeFor(sourceProperty),
    jsonPath: effectiveJsonPath,
    isRequired: (sourceProperty.isRequired || sourceProperty.isPartOfIdentity) && !optionalDueToParent,
  };

  if (column.columnType === 'descriptor') {
    if (column.columnName.endsWith('DescriptorId')) {
      // already correctly suffixed
    } else if (column.columnName.endsWith('Descriptor')) {
      column.columnName = `${column.columnName}Id`;
    } else {
      column.columnName = `${column.columnName}DescriptorId`;
    }
  }

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
  assembliesByPath: Map<TablePath, TableAssembly>,
): ChainResolution | null {
  const chainEntry = lookup.chainsByPath.get(canonicalPath);
  if (chainEntry != null) {
    const tablePath = determineTablePathForChain(chainEntry.propertyChain, nodesByPath);
    if (!assembliesByPath.has(tablePath) || chainEntry.propertyChain.length === 0) return null;
    return {
      chain: chainEntry.propertyChain,
      tablePath,
      modifierOptionalDueToParent: chainEntry.propertyModifier.optionalDueToParent,
    };
  }

  const propertyChainFromLookup: EntityProperty[] =
    lookup.collectedChainsByPath.get(canonicalPath) ?? resolvePropertyChain(entity, canonicalPath as string);
  if (propertyChainFromLookup.length === 0) return null;
  const tablePath = determineTablePathForChain(propertyChainFromLookup, nodesByPath);
  if (!assembliesByPath.has(tablePath)) return null;
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

  return modifierOptionalDueToParent || derivedOptionalDueToParent;
}

/**
 * Adds a reference column for the supplied property if an equivalent column has not already been processed.
 */
function processReferenceProperty(
  context: ColumnProcessingContext,
  tableAssembly: TableAssembly,
  referenceInfo: {
    propertyPath: string;
    sourceProperty: EntityProperty;
    chain: EntityProperty[];
    optionalDueToParent: boolean;
  },
): void {
  const referencePath = baseReferencePath(referenceInfo.propertyPath, referenceInfo.sourceProperty);
  const keySignature = `ref|${referencePath}`;
  // Multiple identity pairs surface the same reference; guard with processedKeys so we emit one FK per table.
  if (tableAssembly.processedKeys.has(keySignature)) return;
  tableAssembly.processedKeys.add(keySignature);

  const column = buildReferenceColumn(
    referenceInfo.propertyPath,
    referenceInfo.sourceProperty,
    referenceInfo.chain,
    referenceInfo.optionalDueToParent,
  );
  tableAssembly.metadata.columns.push(column);
  context.referencePropertyPaths.add(referencePath);
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
  tableAssembly: TableAssembly,
  scalarInfo: {
    canonicalPath: MetaEdPropertyPath;
    jsonPath: JsonPath;
    collectionContainerJsonPath: JsonPath | null;
    sourceProperty: EntityProperty;
    chain: EntityProperty[];
    optionalDueToParent: boolean;
    entity: TopLevelEntity;
    tablePath: TablePath;
  },
): void {
  const keySignature = `scalar|${scalarInfo.canonicalPath}|${scalarInfo.jsonPath}`;
  // Descriptor aliases and merged JsonPaths can re-visit the same scalar path; dedupe with processedKeys.
  if (tableAssembly.processedKeys.has(keySignature)) return;
  tableAssembly.processedKeys.add(keySignature);

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

  tableAssembly.metadata.columns.push(column);
}

/**
 * Locate a scalar column with a JsonPath and peel off the terminal segment to
 * recover the object-level JsonPath for its owning table.
 */
function deriveJsonPathFromScalarColumns(columns: ColumnMetadata[]): JsonPath | null {
  const candidate = columns.find((column) => column.jsonPath != null && column.fromReferencePath == null);
  if (candidate?.jsonPath == null) return null;

  const lastDot = candidate.jsonPath.lastIndexOf('.');
  if (lastDot <= 0) return null;

  return candidate.jsonPath.slice(0, lastDot) as JsonPath;
}

/**
 * For tables that still carry the placeholder jsonPath, attempt to derive the
 * correct anchor from existing metadata for singleton commons
 */
function finalizeMissingTableJsonPaths(preparation: TablePreparation): void {
  preparation.assembliesByPath.forEach((assembly: TableAssembly, tablePath: TablePath) => {
    if (assembly.metadata.jsonPath !== MISSING_TABLE_JSON_PATH) return;

    if (tablePath === ROOT_TABLE_PATH) return;

    const node: FlatteningTableNode | undefined = preparation.nodesByPath.get(tablePath as MetaEdPropertyPath);
    if (node == null) return;

    const { property } = node;
    if (property.type !== 'common') return;

    const isCollection = property.isCollection || property.isOptionalCollection || property.isRequiredCollection;
    if (isCollection) return;

    const derivedPath: JsonPath | null = deriveJsonPathFromScalarColumns(assembly.metadata.columns);
    if (derivedPath != null) {
      assembly.metadata.jsonPath = derivedPath;
    }
  });
}

function assertAllTableJsonPathsResolved(entity: TopLevelEntity, preparation: TablePreparation): void {
  preparation.assembliesByPath.forEach((assembly, tablePath) => {
    invariant(
      assembly.metadata.jsonPath !== MISSING_TABLE_JSON_PATH,
      `Flattening table "${assembly.metadata.baseName}" (MetaEd path "${
        tablePath === ROOT_TABLE_PATH ? '<root>' : tablePath
      }") on "${entity.namespace.projectName}.${entity.metaEdName}" is missing a jsonPath.`,
    );
  });
}

/**
 * Populates scalar and reference columns for every table in the hierarchy.
 */
function populateColumns(entity: TopLevelEntity, apiSchemaData: EntityApiSchemaData, preparation: TablePreparation): void {
  // Precompute chain metadata so property paths can be mapped to their owning table without repeated traversal.
  const chainLookup: ChainLookup = buildChainLookup(entity, apiSchemaData);
  // Track assembled tables and the reference paths already emitted while iterating the JsonPath mapping.
  const context: ColumnProcessingContext = {
    assembliesByPath: preparation.assembliesByPath,
    referencePropertyPaths: new Set(),
  };

  Object.entries(apiSchemaData.allJsonPathsMapping).forEach(([propertyPath, info]) => {
    // Each JsonPath pair represents a potential column; resolve it to a table.
    info.jsonPathPropertyPairs.forEach((pair) => {
      const { sourceProperty, jsonPath } = pair;
      if (isStructuralProperty(sourceProperty)) return;

      const canonicalPath: MetaEdPropertyPath = canonicalPropertyPath(propertyPath, sourceProperty);
      const chainResolution: ChainResolution | null = resolveChainForProperty(
        entity,
        canonicalPath,
        chainLookup,
        preparation.nodesByPath,
        preparation.assembliesByPath,
      );
      if (chainResolution == null) return;

      const optionalDueToParent = computeEffectiveOptionalDueToParent(chainResolution, chainResolution.chain);
      const tableAssembly = preparation.assembliesByPath.get(chainResolution.tablePath);
      if (tableAssembly == null) return;

      if (isReferenceProperty(sourceProperty)) {
        // Reference columns are emitted once per owning table and remembered so scalar descendants are not duplicated.
        processReferenceProperty(context, tableAssembly, {
          propertyPath,
          sourceProperty,
          chain: chainResolution.chain,
          optionalDueToParent,
        });
        return;
      }

      if (isCoveredByReference(canonicalPath, context.referencePropertyPaths)) return;

      // At this point the property represents a scalar value; emit a column when no prior column covered the same source.
      processScalarProperty(tableAssembly, {
        canonicalPath,
        jsonPath,
        collectionContainerJsonPath: info.collectionContainerJsonPath ?? null,
        sourceProperty,
        chain: chainResolution.chain,
        optionalDueToParent,
        entity,
        tablePath: chainResolution.tablePath,
      });
    });
  });

  preparation.assembliesByPath.forEach((assembly) => {
    if (assembly.parentReferenceColumn != null) {
      // Parent references are appended after data columns so foreign keys appear in a consistent position.
      assembly.metadata.columns.push(assembly.parentReferenceColumn);
    }
  });

  finalizeMissingTableJsonPaths(preparation);
  assertAllTableJsonPathsResolved(entity, preparation);
}

/**
 * Populates flattening tables with column metadata for every eligible MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, ...entityTypesToEnhance).forEach((entity) => {
    const topLevelEntity = entity as TopLevelEntity;
    const apiSchemaData = topLevelEntity.data.edfiApiSchema as EntityApiSchemaData | undefined;
    if (apiSchemaData == null) return;

    const preparation = initializeTablePreparation(topLevelEntity);

    populateColumns(topLevelEntity, apiSchemaData, preparation);

    apiSchemaData.flatteningMetadata = {
      table: preparation.rootAssembly.metadata,
    };
  });

  return {
    enhancerName: 'FlatteningTableMetadataEnhancer',
    success: true,
  };
}
