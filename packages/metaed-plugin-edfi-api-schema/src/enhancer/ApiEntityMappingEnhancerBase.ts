// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type {
  EntityProperty,
  TopLevelEntity,
  MetaEdPropertyPath,
  MergeDirectiveInfo,
  InlineCommonProperty,
} from '@edfi/metaed-core';
import {
  ReferenceElement,
  ReferenceComponent,
  ReferenceGroup,
  isReferenceGroup,
  isReferenceElement,
} from '../model/ReferenceComponent';
import type { CollectedProperty } from '../model/CollectedProperty';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import type { FlattenedIdentityProperty } from '../model/FlattenedIdentityProperty';

/**
 * A list of property paths along with the chain of properties that make up the path.
 * Includes whether a property is merged away
 */
type PathsAndProperties = {
  propertyPaths: MetaEdPropertyPath[];
  propertyChain: EntityProperty[];
  mergedAwayBy: MergeDirectiveInfo | null;
};

/**
 * A leaf reference element mapped to the property paths and chain of properties that lead to it
 */
type ReferenceElementsWithPaths = Map<ReferenceElement, PathsAndProperties>;

/**
 * All of the reference groups of all of the properties of the given entity, in sorted order
 */
export function referenceGroupsFrom(sortedProperties: EntityProperty[]): ReferenceGroup[] {
  return sortedProperties
    .map((property) => (property.data.edfiApiSchema as EntityPropertyApiSchemaData).referenceComponent)
    .filter((rc) => isReferenceGroup(rc)) as ReferenceGroup[];
}

/**
 * Takes two property paths and joins them, returning a new dot-separated path.
 */
function joinPropertyPaths(
  currentPropertyPath: MetaEdPropertyPath,
  newPropertyPath: MetaEdPropertyPath,
): MetaEdPropertyPath {
  if (currentPropertyPath === '') return newPropertyPath;
  return `${currentPropertyPath}.${newPropertyPath}` as MetaEdPropertyPath;
}

/**
 * Returns the given property if it should be "merged away" due to its being marked as a
 * merge directive source along the given property chain. Otherwise returns null.
 */
function mergedAwayProperty(property: EntityProperty, propertyChain: EntityProperty[]): MergeDirectiveInfo | null {
  // Some property types are never merged away
  if (
    property.type === 'choice' ||
    property.type === 'common' ||
    property.type === 'inlineCommon' ||
    property.type === 'schoolYearEnumeration'
  ) {
    return null;
  }

  let result: MergeDirectiveInfo | null = null;

  property.mergeSourcedBy.forEach((mergeDirectiveInfo) => {
    if (propertyChain.includes(mergeDirectiveInfo.parentProperty)) result = mergeDirectiveInfo;
  });

  return result;
}

/**
 * Flatten a graph of ReferenceComponents into an array of ReferenceElements, discarding any
 * ReferenceGroups that are part of the graph but preserving the property and property path information.
 *
 * Optionally omits properties that have been "merged away", meaning the property is marked as a merge directive source
 * along this property chain.
 */
function flattenReferenceElementsFromComponent({
  referenceComponent,
  currentPropertyPath,
  currentPropertyChain,
  propertyPathAccumulator,
  propertyChainAccumulator,
  referenceElementsAccumulator,
  mergedAwayByDirectiveInfo: mergedAwayByProp,
}: {
  referenceComponent: ReferenceComponent;
  currentPropertyPath: MetaEdPropertyPath;
  currentPropertyChain: EntityProperty[];
  propertyPathAccumulator: MetaEdPropertyPath[];
  propertyChainAccumulator: EntityProperty[];
  referenceElementsAccumulator: ReferenceElementsWithPaths;
  mergedAwayByDirectiveInfo: MergeDirectiveInfo | null;
}) {
  if (isReferenceElement(referenceComponent)) {
    const mergedAwayBy: MergeDirectiveInfo | null =
      mergedAwayByProp == null
        ? mergedAwayProperty(referenceComponent.sourceProperty, currentPropertyChain)
        : mergedAwayByProp;

    referenceElementsAccumulator.set(referenceComponent, {
      propertyPaths: propertyPathAccumulator.concat(
        joinPropertyPaths(currentPropertyPath, referenceComponent.sourceProperty.fullPropertyName as MetaEdPropertyPath),
      ),
      propertyChain: [...currentPropertyChain, referenceComponent.sourceProperty],
      mergedAwayBy,
    });
  } else {
    (referenceComponent as ReferenceGroup).referenceComponents.forEach((subReferenceComponent) => {
      const mergedAwayBy: MergeDirectiveInfo | null =
        mergedAwayByProp == null
          ? mergedAwayProperty(subReferenceComponent.sourceProperty, currentPropertyChain)
          : mergedAwayByProp;

      if (isReferenceElement(subReferenceComponent)) {
        const subReferenceElement: ReferenceElement = subReferenceComponent as ReferenceElement;
        referenceElementsAccumulator.set(subReferenceElement, {
          propertyPaths: propertyPathAccumulator.concat(
            joinPropertyPaths(
              currentPropertyPath,
              subReferenceElement.sourceProperty.fullPropertyName as MetaEdPropertyPath,
            ),
          ),
          propertyChain: [...currentPropertyChain, subReferenceElement.sourceProperty],
          mergedAwayBy,
        });
      } else {
        const nextPropertyPath: MetaEdPropertyPath = joinPropertyPaths(
          currentPropertyPath,
          subReferenceComponent.sourceProperty.fullPropertyName as MetaEdPropertyPath,
        );

        flattenReferenceElementsFromComponent({
          referenceComponent: subReferenceComponent,
          currentPropertyPath: nextPropertyPath,
          currentPropertyChain: [...currentPropertyChain, subReferenceComponent.sourceProperty],
          propertyPathAccumulator: propertyPathAccumulator.concat(nextPropertyPath),
          propertyChainAccumulator,
          referenceElementsAccumulator,
          mergedAwayByDirectiveInfo: mergedAwayBy,
        });
      }
    });
  }
}

function prependInitialPropertyPathPrefix(
  initialPropertyPathPrefix: string,
  identityProperty: EntityProperty,
): MetaEdPropertyPath {
  return (
    initialPropertyPathPrefix === ''
      ? identityProperty.fullPropertyName
      : `${initialPropertyPathPrefix}.${identityProperty.fullPropertyName}`
  ) as MetaEdPropertyPath;
}

/**
 * Converts the given list of identity properties to only the "leaf" non-reference properties, in sorted order.
 * Includes the paths showing how the property came to be part of the identity, if it was via a reference identity
 * property.
 *
 * Omits properties that have been "merged away", meaning the property is marked as a merge directive source
 * along this property chain.
 */
export function flattenIdentityPropertiesFrom(
  identityProperties: EntityProperty[],
  entity: TopLevelEntity,
): FlattenedIdentityProperty[] {
  const referenceElementsWithPaths: ReferenceElementsWithPaths = new Map();

  identityProperties.forEach((identityProperty) => {
    const getsInitialPropertyPathInAccumulator: boolean =
      identityProperty.type === 'association' || identityProperty.type === 'domainEntity';

    // Prefix if this was a pulled-up identity property
    const initialPropertyPathPrefix =
      identityProperty.parentEntity === entity ||
      (entity.baseEntity != null && identityProperty.parentEntity === entity.baseEntity)
        ? ''
        : identityProperty.parentEntity.metaEdName;

    const initialPropertyPath = (
      getsInitialPropertyPathInAccumulator
        ? prependInitialPropertyPathPrefix(initialPropertyPathPrefix, identityProperty)
        : initialPropertyPathPrefix
    ) as MetaEdPropertyPath;

    const initialPropertyChain: EntityProperty[] = getsInitialPropertyPathInAccumulator ? [identityProperty] : [];
    const initialPropertyPathAccumulator: MetaEdPropertyPath[] = getsInitialPropertyPathInAccumulator
      ? [initialPropertyPath]
      : [];

    flattenReferenceElementsFromComponent({
      referenceComponent: identityProperty.data.edfiApiSchema.referenceComponent,
      currentPropertyPath: initialPropertyPath,
      currentPropertyChain: initialPropertyChain,
      propertyPathAccumulator: initialPropertyPathAccumulator,
      propertyChainAccumulator: initialPropertyChain,
      referenceElementsAccumulator: referenceElementsWithPaths,
      mergedAwayByDirectiveInfo: null,
    });
  });

  const result: FlattenedIdentityProperty[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [referenceElement, pathsAndProperties] of referenceElementsWithPaths) {
    result.push({
      identityProperty: referenceElement.sourceProperty,
      propertyPaths: pathsAndProperties.propertyPaths,
      propertyChain: pathsAndProperties.propertyChain,
      mergedAwayBy: pathsAndProperties.mergedAwayBy,
      // These are set by a follow-on enhancer
      mergeCoveredBy: null,
      mergeCovers: null,
    });
  }

  return result;
}

/**
 * CollectedApiProperties of all of the descriptor properties on the entity.
 */
export function descriptorCollectedApiPropertiesFrom(entity: TopLevelEntity): CollectedProperty[] {
  return (entity.data.edfiApiSchema as EntityApiSchemaData).collectedApiProperties.filter(
    (cp) => cp.property.type === 'descriptor',
  );
}

/**
 * If the entity for this mapping is a subclass, returns the superclass entity
 * which it can be assigned to, otherwise null. Note MetaEd only allows a single level of subclassing.
 */
export function superclassFor(entity: TopLevelEntity): TopLevelEntity | null {
  // Specifically exclude Domain Entity/Association Extensions - just to be safe
  if (entity.type === 'domainEntityExtension' || entity.type === 'associationExtension') return null;
  // If it's a subclass, return its superclass
  if (entity.baseEntity != null) return entity.baseEntity;
  return null;
}

/**
 * Collects all identity properties, including those found on inline commons
 * Returns them in sorted order.
 */
export function collectAllIdentityPropertiesFor(entity: TopLevelEntity): EntityProperty[] {
  const result: EntityProperty[] = [...entity.identityProperties];
  const inlineCommonIdentityProperties: EntityProperty[] = entity.properties
    .filter((property) => property.type === 'inlineCommon')
    .flatMap((property) => collectAllIdentityPropertiesFor((property as InlineCommonProperty).referencedEntity));
  result.push(...inlineCommonIdentityProperties);
  return result.sort((a, b) => a.fullPropertyName.localeCompare(b.fullPropertyName));
}
