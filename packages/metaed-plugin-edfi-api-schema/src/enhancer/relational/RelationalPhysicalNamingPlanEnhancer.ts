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
import type { RelationalBaseName } from '../../model/api-schema/RelationalBaseName';
import type { RelationalPropertyChain } from '../../model/relational/RelationalPropertyChain';
import type { JsonPath } from '../../model/api-schema/JsonPath';
import { prefixedName, type PropertyModifier } from '../../model/PropertyModifier';
import { isTopLevelReference } from '../../Utility';
import { collectReferencePrefixes, collectScalarPrefixes, deriveRelationalTableSuffix } from './RelationalNamingConventions';
import { buildRelationalPropertyChains } from './RelationalPropertyChainBuilder';

const enhancerName = 'RelationalPhysicalNamingPlanEnhancer';

/**
 * Map of JsonPath keys to relational base names.
 */
type RelationalBaseNameMapping = { [key: JsonPath]: RelationalBaseName };

/**
 * Adds a relational base name to the mapping if the JsonPath key is not already defined.
 */
function addRelationalBaseName(mapping: RelationalBaseNameMapping, jsonPath: JsonPath, baseName: RelationalBaseName): void {
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
 * Determines the relational base name for scalar properties.
 */
function relationalScalarBaseNameFor(propertyChain: EntityProperty[], property: EntityProperty): RelationalBaseName {
  const modifier: PropertyModifier = {
    optionalDueToParent: false,
    parentPrefixes: collectScalarPrefixes(propertyChain),
  };
  return prefixedName(property.metaEdName, modifier) as RelationalBaseName;
}

/**
 * Determines the relational base name for reference properties.
 */
function relationalReferenceBaseNameFor(propertyChain: EntityProperty[], property: EntityProperty): RelationalBaseName {
  const prefixes = collectReferencePrefixes(propertyChain);
  const prefixSegment = prefixes.length === 0 ? '' : `${prefixes.join('_')}_`;
  return `${prefixSegment}${property.metaEdName}` as RelationalBaseName;
}

/**
 * Builds relational base names keyed by JsonPath for the supplied entity.
 */
function buildRelationalBaseNames(entity: TopLevelEntity, apiSchemaData: EntityApiSchemaData): RelationalBaseNameMapping {
  const relationalBaseNames: RelationalBaseNameMapping = {};
  const relationalPropertyChains: RelationalPropertyChain[] = buildRelationalPropertyChains(entity);
  const propertyChainLookup: Map<MetaEdPropertyPath, RelationalPropertyChain> =
    buildPropertyChainLookup(relationalPropertyChains);

  // Collection tables contribute base names from their collection container paths.
  apiSchemaData.relationalTableNodes.forEach((node) => {
    if (node.collectionJsonPath == null) return;
    const baseName = deriveRelationalTableSuffix(node) as RelationalBaseName;
    addRelationalBaseName(relationalBaseNames, node.collectionJsonPath, baseName);
  });

  // Property chains supply base names for reference objects and scalar leaf nodes.
  propertyChainLookup.forEach((chain, propertyPath) => {
    const jsonPathsInfo = apiSchemaData.allJsonPathsMapping[propertyPath];
    if (jsonPathsInfo == null) return;

    if (isTopLevelReference(chain.property)) {
      if (jsonPathsInfo.referenceObjectJsonPath == null) return;
      const baseName = relationalReferenceBaseNameFor(chain.propertyChain, chain.property);
      addRelationalBaseName(relationalBaseNames, jsonPathsInfo.referenceObjectJsonPath, baseName);
      return;
    }

    // Only scalar properties map to column base names.
    if (!scalarPropertyTypes.includes(chain.property.type)) return;

    // Apply the same scalar base name to each JsonPath for the property.
    const baseName = relationalScalarBaseNameFor(chain.propertyChain, chain.property);
    jsonPathsInfo.jsonPathPropertyPairs.forEach((pair) => {
      addRelationalBaseName(relationalBaseNames, pair.jsonPath, baseName);
    });
  });

  return relationalBaseNames;
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
 * Populates relational naming plans for every eligible MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, ...entityTypesToEnhance).forEach((entity) => {
    const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    const relationalBaseNames = buildRelationalBaseNames(entity as TopLevelEntity, apiSchemaData);
    // Preserve JSON naming plan data when this enhancer runs after the JSON plan enhancer.
    const existingPlan = apiSchemaData.relationalNamingPlan ?? { jsonBaseNames: {} };
    apiSchemaData.relationalNamingPlan = {
      ...existingPlan,
      relationalBaseNames,
    };
  });

  return {
    enhancerName,
    success: true,
  };
}
