// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type {
  EnhancerResult,
  EntityProperty,
  MetaEdEnvironment,
  MetaEdPropertyPath,
  TopLevelEntity,
} from '@edfi/metaed-core';
import { getAllEntitiesOfType, scalarPropertyTypes } from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import type { EntityPropertyApiSchemaData } from '../../model/EntityPropertyApiSchemaData';
import { prefixedName, type PropertyModifier } from '../../model/PropertyModifier';
import type { JsonPath } from '../../model/api-schema/JsonPath';
import type { RelationalBaseName } from '../../model/api-schema/RelationalBaseName';
import type { JsonPathsInfo } from '../../model/JsonPathsMapping';
import type { RelationalPropertyChain } from '../../model/relational/RelationalPropertyChain';
import { isTopLevelReference, singularize, topLevelApiNameOnEntity } from '../../Utility';
import { buildRelationalPropertyChains } from './RelationalPropertyChainBuilder';

const enhancerName = 'RelationalJsonPathNamingPlanEnhancer';

/**
 * Map of JsonPath keys to JSON-derived base names.
 */
type JsonBaseNameMapping = { [key: JsonPath]: RelationalBaseName };

/**
 * Determines whether the supplied property path is a top-level property on the resource.
 */
function isTopLevelPropertyPath(propertyPath: MetaEdPropertyPath, jsonPathsInfo: JsonPathsInfo | undefined): boolean {
  if (jsonPathsInfo == null) return false;
  return jsonPathsInfo.initialPropertyPath === propertyPath;
}

/**
 * Builds the JSON property name in PascalCase for the supplied property and modifier.
 */
function jsonPropertyNameFor(
  entity: TopLevelEntity,
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  isTopLevelProperty: boolean,
): string {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const apiName: string = isTopLevelProperty ? topLevelApiNameOnEntity(entity, property) : apiMapping.topLevelName;
  return prefixedName(apiName, propertyModifier);
}

/**
 * Determines the JSON base name for scalar property paths.
 */
function jsonScalarBaseNameFor(
  entity: TopLevelEntity,
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  isTopLevelProperty: boolean,
): RelationalBaseName {
  if (property.type === 'schoolYearEnumeration') {
    return 'SchoolYear' as RelationalBaseName;
  }

  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  let apiName: string;
  if (apiMapping.isDescriptorCollection) {
    apiName = apiMapping.descriptorCollectionName;
  } else if (property.isCollection) {
    apiName = apiMapping.fullNamePreservingPrefix;
  } else {
    apiName = isTopLevelProperty ? topLevelApiNameOnEntity(entity, property) : apiMapping.topLevelName;
  }

  return prefixedName(apiName, propertyModifier) as RelationalBaseName;
}

/**
 * Determines the JSON base name for reference object paths.
 */
function jsonReferenceBaseNameFor(
  entity: TopLevelEntity,
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  isTopLevelProperty: boolean,
): RelationalBaseName {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  // The JSON reference object property name before role prefixes and suffix removal.
  let apiName: string;
  if (apiMapping.isReferenceCollection) {
    apiName = apiMapping.referenceCollectionName;
  } else if (isTopLevelProperty) {
    apiName = topLevelApiNameOnEntity(entity, property);
  } else {
    apiName = apiMapping.topLevelName;
  }
  const prefixedApiName = prefixedName(apiName, propertyModifier);
  const suffix = 'Reference';

  if (!prefixedApiName.endsWith(suffix)) {
    return prefixedApiName as RelationalBaseName;
  }

  return prefixedApiName.slice(0, prefixedApiName.length - suffix.length) as RelationalBaseName;
}

/**
 * Determines the JSON base name for collection table paths.
 */
function jsonCollectionBaseNameFor(
  entity: TopLevelEntity,
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  isTopLevelProperty: boolean,
): RelationalBaseName {
  const apiName: string = jsonPropertyNameFor(entity, property, propertyModifier, isTopLevelProperty);
  return singularize(apiName) as RelationalBaseName;
}

/**
 * Adds a JSON base name to the mapping if the JsonPath key is not already defined.
 */
function addJsonBaseName(mapping: JsonBaseNameMapping, jsonPath: JsonPath, baseName: RelationalBaseName): void {
  if (mapping[jsonPath] != null) return;
  mapping[jsonPath] = baseName;
}

/**
 * Builds a lookup for relational property chains keyed by MetaEd property path.
 */
function buildPropertyChainLookup(chains: RelationalPropertyChain[]): Map<MetaEdPropertyPath, RelationalPropertyChain> {
  const lookup: Map<MetaEdPropertyPath, RelationalPropertyChain> = new Map();
  chains.forEach((chain) => {
    if (!lookup.has(chain.fullPropertyPath)) {
      lookup.set(chain.fullPropertyPath, chain);
    }
  });
  return lookup;
}

/**
 * Builds JSON-derived base names keyed by JsonPath for the supplied entity.
 *
 * A “base name” is the stable PascalCase token we align between JSON paths
 * and relational names before any additional suffixing/combining happens.
 *
 * - For tables: it’s the base table suffix derived from a collection path
 *   (e.g. $.identificationCodes[*] -> IdentificationCode), before it gets
 *   concatenated with the parent table name.
 *
 * - For reference columns: it’s the reference object name without the
 *   Reference suffix (e.g., $.balanceSheetDimensionReference -> BalanceSheetDimension),
 *   before _Id is added.
 *
 * - For scalar columns: it’s the JSON property name (PascalCase) before any
 *   DB suffix rules (like _DescriptorId for descriptors).
 */
function buildJsonBaseNames(entity: TopLevelEntity, apiSchemaData: EntityApiSchemaData): JsonBaseNameMapping {
  // Accumulate JsonPath-derived base names for tables, references, and scalars.
  const jsonBaseNames: JsonBaseNameMapping = {};
  const relationalPropertyChains: RelationalPropertyChain[] = buildRelationalPropertyChains(entity);
  const propertyChainLookup: Map<MetaEdPropertyPath, RelationalPropertyChain> =
    buildPropertyChainLookup(relationalPropertyChains);

  // Collection tables contribute base names from their collection container paths.
  apiSchemaData.relationalTableNodes.forEach((node) => {
    if (node.collectionJsonPath == null) return;

    const chain: RelationalPropertyChain | undefined = propertyChainLookup.get(node.tablePath);
    if (chain == null) return;

    const jsonPathsInfo: JsonPathsInfo = apiSchemaData.allJsonPathsMapping[node.tablePath];
    const isTopLevelProperty = isTopLevelPropertyPath(node.tablePath, jsonPathsInfo);

    // Use the singularized collection name as the table suffix base.
    const baseName = jsonCollectionBaseNameFor(entity, chain.property, chain.propertyModifier, isTopLevelProperty);
    addJsonBaseName(jsonBaseNames, node.collectionJsonPath, baseName);
  });

  // Property chains supply base names for reference objects and scalar leaf nodes.
  propertyChainLookup.forEach((chain, propertyPath) => {
    const jsonPathsInfo = apiSchemaData.allJsonPathsMapping[propertyPath];
    if (jsonPathsInfo == null) return;

    const isTopLevelProperty = isTopLevelPropertyPath(propertyPath, jsonPathsInfo);

    // Reference properties key off the reference object path (minus the "Reference" suffix).
    if (isTopLevelReference(chain.property)) {
      if (jsonPathsInfo.referenceObjectJsonPath == null) return;
      const baseName = jsonReferenceBaseNameFor(entity, chain.property, chain.propertyModifier, isTopLevelProperty);
      addJsonBaseName(jsonBaseNames, jsonPathsInfo.referenceObjectJsonPath, baseName);
      return;
    }

    // Only scalar properties map to column base names.
    if (!scalarPropertyTypes.includes(chain.property.type)) return;

    // Apply the same scalar base name to each JsonPath for the property.
    const baseName = jsonScalarBaseNameFor(entity, chain.property, chain.propertyModifier, isTopLevelProperty);
    jsonPathsInfo.jsonPathPropertyPairs.forEach((pair) => {
      addJsonBaseName(jsonBaseNames, pair.jsonPath, baseName);
    });
  });

  return jsonBaseNames;
}

const entityTypesToEnhance = [
  'association',
  'associationSubclass',
  'associationExtension',
  'domainEntity',
  'domainEntitySubclass',
  'domainEntityExtension',
] as const;

/**
 * Populates JSON-derived naming plans for every eligible MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, ...entityTypesToEnhance).forEach((entity) => {
    const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    apiSchemaData.relationalNamingPlan = { jsonBaseNames: buildJsonBaseNames(entity as TopLevelEntity, apiSchemaData) };
  });

  return {
    enhancerName,
    success: true,
  };
}
