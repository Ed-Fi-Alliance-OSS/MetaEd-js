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
import type { JsonPathsInfo, JsonPathsMapping } from '../../model/JsonPathsMapping';
import type { EntityPropertyApiSchemaData } from '../../model/EntityPropertyApiSchemaData';
import type { RelationalPropertyChain } from '../../model/relational/RelationalPropertyChain';
import type { RelationalCollectionTableSource } from '../../model/relational/RelationalCollectionTableSource';

/**
 * Converts the provided property chain into a MetaEd dot-separated property path.
 * Returns an empty branded string when the chain is empty.
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
 * Returns null if there is no collection in the chain.
 */
function findCollectionSource(propertyChain: EntityProperty[]): RelationalCollectionTableSource | null {
  for (let index = propertyChain.length - 1; index >= 0; index -= 1) {
    const candidate: EntityProperty = propertyChain[index];
    const isCollection: boolean = candidate.isCollection || candidate.isOptionalCollection || candidate.isRequiredCollection;
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
  const jsonPathsInfo: JsonPathsInfo | undefined = allJsonPathsMapping[propertyPath];

  // Some property chains do not receive their own JsonPaths entry, so jsonPathsInfo can be undefined.
  // Examples:
  // - Merge directives can "merge away" a reference identity path, so the JSONPath is emitted under a
  //   covering path instead of the original reference path.
  // - Descriptor normalization can move a path under the "...Descriptor" variant rather than the raw
  //   property path, so the base path lookup misses and we must check the normalized form.
  // - Inline common and choice wrappers can also hide direct mapping entries because they are not
  //   represented as objects in the JSON document; only their descendants surface paths.
  if (jsonPathsInfo?.collectionContainerJsonPath != null) {
    return jsonPathsInfo.collectionContainerJsonPath;
  }

  const propertyApiSchemaData = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  // In the case of descriptor collections, ensure the descriptor suffix.
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
 * Builds the relational property chain descriptor for a collected property.
 *
 * This attaches three related pieces of information:
 * - The full MetaEd property chain and path (used to align with JsonPathsMapping keys)
 * - The owning collection, if any, that materializes into a child table
 * - The relative property chain inside that collection
 */
function buildRelationalPropertyChain(
  collectedProperty: CollectedProperty,
  allJsonPathsMapping: JsonPathsMapping,
): RelationalPropertyChain {
  // Clone the chain to avoid mutating shared enhancer data.
  const propertyChain: EntityProperty[] = [...collectedProperty.propertyChain];
  const fullPropertyPath: MetaEdPropertyPath = propertyChainPath(propertyChain);

  // Identify the nearest collection in the chain that should materialize into a child table.
  const owningCollectionSource: RelationalCollectionTableSource | null = findCollectionSource(propertyChain);

  if (owningCollectionSource == null) {
    // No collection anchor: the property belongs to the root table.
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

  // Drop the collection segment so the relative path starts at the child table.
  const relativePropertyChain: EntityProperty[] = propertyChain.slice(
    lastIndexOf(propertyChain, owningCollectionSource.property) + 1,
  );
  const relativePropertyPath: MetaEdPropertyPath =
    relativePropertyChain.length === 0 ? ('' as MetaEdPropertyPath) : propertyChainPath(relativePropertyChain);

  // Attach the JsonPath to the owning collection when available. The owning collection exists here,
  // but its JsonPath can still be null for merge-involved references, descriptor normalization,
  // or inline/choice wrapper cases.
  const owningCollection: RelationalCollectionTableSource = {
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
 * Recursively collects relational-aware property chains for the supplied entity and its nested commons.
 */
function collectRelationalCollectedPropertiesForEntity(
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

    // Recurse into common properties to pull in nested properties once per unique path.
    if (property.type === 'common') {
      const path: MetaEdPropertyPath = propertyChainPath(combinedChain);
      if (visitedPaths.has(path)) return;
      visitedPaths.add(path);
      const { referencedEntity } = property as CommonProperty;
      collectRelationalCollectedPropertiesForEntity(
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
 * Builds relational-aware property chains for the given top-level entity.
 */
export function buildRelationalPropertyChains(entity: TopLevelEntity): RelationalPropertyChain[] {
  const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  const { allJsonPathsMapping } = apiSchemaData;
  const collectedProperties: CollectedProperty[] = [];
  collectRelationalCollectedPropertiesForEntity(
    entity,
    [],
    defaultPropertyModifier,
    collectedProperties,
    new Set<MetaEdPropertyPath>(),
  );

  return collectedProperties.map((collectedProperty) =>
    buildRelationalPropertyChain(collectedProperty, allJsonPathsMapping),
  );
}
