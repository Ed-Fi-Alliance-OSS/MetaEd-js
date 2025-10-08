// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { CommonProperty, EntityProperty, MetaEdPropertyPath, TopLevelEntity } from '@edfi/metaed-core';
import { normalizeDescriptorSuffix } from '@edfi/metaed-core';
import { invariant } from 'ts-invariant';
import type { CollectedProperty } from '../../model/CollectedProperty';
import type { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import { defaultPropertyModifier, propertyModifierConcat, type PropertyModifier } from '../../model/PropertyModifier';
import type { JsonPath } from '../../model/api-schema/JsonPath';
import type { JsonPathsMapping } from '../../model/JsonPathsMapping';
import type { EntityPropertyApiSchemaData } from '../../model/EntityPropertyApiSchemaData';
import { FlatteningPropertyChain } from '../../model/flattening/FlatteningPropertyChain';
import { CollectionTableSource } from '../../model/flattening/CollectionTableSource';

/**
 * Converts the provided property chain into a MetaEd dot-separated property path.
 * Returns an empty branded string when the chain is empty (root-level table).
 */
function propertyChainPath(chain: EntityProperty[]): MetaEdPropertyPath {
  if (chain.length === 0) return '' as MetaEdPropertyPath;
  return chain.map((property) => property.fullPropertyName).join('.') as MetaEdPropertyPath;
}

/**
 * Finds the last occurrence of the target property within the chain, asserting presence.
 */
function lastIndexOf(propertyChain: EntityProperty[], target: EntityProperty): number {
  const index: number = propertyChain.lastIndexOf(target);
  invariant(index !== -1, 'Expected target property to exist in property chain');
  return index;
}

/**
 * Scans a property chain from leaf to root to locate the collection that materializes into a child table.
 * Inline commons and choices are skipped because they do not materialize tables.
 * Returns null if there is no collection in the chain
 */
function findCollectionSource(propertyChain: EntityProperty[]): CollectionTableSource | null {
  for (let index = propertyChain.length - 1; index >= 0; index -= 1) {
    const candidate: EntityProperty = propertyChain[index];
    const isCollection: boolean = candidate.isCollection || candidate.isOptionalCollection;
    const isInlineContainer: boolean = candidate.type === 'inlineCommon' || candidate.type === 'choice';
    if (isCollection && !isInlineContainer) {
      return {
        property: candidate,
        propertyPath: propertyChainPath(propertyChain.slice(0, index + 1)),
        collectionJsonPath: null,
      };
    }
  }

  return null;
}

/**
 * Resolves the canonical JsonPath for the supplied collection property path using the available schema mappings.
 */
function collectionContainerPathFor(
  propertyPath: MetaEdPropertyPath,
  property: EntityProperty,
  allJsonPathsMapping: JsonPathsMapping,
): JsonPath | null {
  const jsonPathsInfo = allJsonPathsMapping[propertyPath];

  // Some property chains (e.g., inline commons, alias-backed references, or extension overrides) do not
  // receive their own JsonPaths entry, so jsonPathsInfo can be undefined.
  if (jsonPathsInfo?.collectionContainerJsonPath != null) {
    return jsonPathsInfo.collectionContainerJsonPath;
  }

  const propertyApiSchemaData = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  // In the case of descriptor collections, ensure the descriptor suffix
  if (propertyApiSchemaData.apiMapping.isDescriptorCollection) {
    const descriptorPropertyPath = normalizeDescriptorSuffix(propertyPath) as MetaEdPropertyPath;
    const descriptorJsonPathsInfo = allJsonPathsMapping[descriptorPropertyPath];

    if (descriptorJsonPathsInfo.collectionContainerJsonPath != null) {
      return descriptorJsonPathsInfo.collectionContainerJsonPath;
    }
  }

  return null;
}

/**
 * Builds the flattening metadata descriptor for a collected property, enriching the shared cache
 * with any new collection container JsonPaths discovered while traversing the chain.
 */
function buildFlatteningPropertyChain(
  collectedProperty: CollectedProperty,
  allJsonPathsMapping: JsonPathsMapping,
): FlatteningPropertyChain {
  // Copy chains to avoid mutating shared enhancer data.
  const propertyChain: EntityProperty[] = [...collectedProperty.propertyChain];
  const fullPropertyPath: MetaEdPropertyPath = propertyChainPath(propertyChain);

  // Identify the collection (if any) that introduces a child table for this property.
  const owningCollectionSource: CollectionTableSource | null = findCollectionSource(propertyChain);

  if (owningCollectionSource == null) {
    // Root-level properties map directly to the collected chain; relative chain/path mirrors the full chain.
    return {
      property: collectedProperty.property,
      propertyModifier: collectedProperty.propertyModifier,
      propertyChain,
      fullPropertyPath,
      owningCollection: null,
      relativePropertyChain: [...propertyChain],
      relativePropertyPath: fullPropertyPath,
    };
  }

  // For collection-owned properties, drop the collection segment so relative paths start at the child table.
  const relativePropertyChain: EntityProperty[] = propertyChain.slice(
    lastIndexOf(propertyChain, owningCollectionSource.property) + 1,
  );
  const relativePropertyPath: MetaEdPropertyPath =
    relativePropertyChain.length === 0 ? ('' as MetaEdPropertyPath) : propertyChainPath(relativePropertyChain);

  // Enrich the source with the actual container JsonPath, leveraging the existing mapping (may still be null).
  const owningCollection: CollectionTableSource = {
    ...owningCollectionSource,
    collectionJsonPath: collectionContainerPathFor(
      owningCollectionSource.propertyPath,
      owningCollectionSource.property,
      allJsonPathsMapping,
    ),
  };

  return {
    property: collectedProperty.property,
    propertyModifier: collectedProperty.propertyModifier,
    propertyChain,
    fullPropertyPath,
    owningCollection,
    relativePropertyChain,
    relativePropertyPath,
  };
}

/**
 * Recursively collects flattening-aware property chain metadata for the supplied entity and its nested commons.
 */
function collectFlatteningCollectedPropertiesForEntity(
  entity: TopLevelEntity,
  propertyChainPrefix: EntityProperty[],
  inheritedModifier: PropertyModifier,
  accumulator: CollectedProperty[],
  visitedPaths: Set<MetaEdPropertyPath>,
): void {
  const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;

  apiSchemaData.collectedApiProperties.forEach((collectedProperty: CollectedProperty) => {
    const { property, propertyModifier, propertyChain } = collectedProperty;
    const combinedModifier: PropertyModifier = propertyModifierConcat(inheritedModifier, propertyModifier);
    const combinedChain: EntityProperty[] = [...propertyChainPrefix, ...propertyChain];

    accumulator.push({
      property,
      propertyModifier: combinedModifier,
      propertyChain: combinedChain,
    });

    if (property.type === 'common') {
      const path: MetaEdPropertyPath = propertyChainPath(combinedChain);
      if (visitedPaths.has(path)) return;
      visitedPaths.add(path);
      const { referencedEntity } = property as CommonProperty;
      collectFlatteningCollectedPropertiesForEntity(
        referencedEntity,
        combinedChain,
        defaultPropertyModifier,
        accumulator,
        visitedPaths,
      );
    }
  });
}

/**
 * Builds flattening-aware property chains for the given top-level entity while caching container
 * JsonPaths so repeated lookups do not re-traverse metadata collections.
 */
export function buildFlatteningPropertyChains(entity: TopLevelEntity): FlatteningPropertyChain[] {
  const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  const { allJsonPathsMapping } = apiSchemaData;
  const collectedProperties: CollectedProperty[] = [];
  collectFlatteningCollectedPropertiesForEntity(
    entity,
    [],
    defaultPropertyModifier,
    collectedProperties,
    new Set<MetaEdPropertyPath>(),
  );

  return collectedProperties.map((collectedProperty) =>
    buildFlatteningPropertyChain(collectedProperty, allJsonPathsMapping),
  );
}
