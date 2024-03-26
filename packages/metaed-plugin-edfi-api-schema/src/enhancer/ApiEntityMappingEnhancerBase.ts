import type { EntityProperty, TopLevelEntity, MetaEdPropertyPath } from '@edfi/metaed-core';
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
 * A list of property paths along with the chain of properties that make up the path
 */
type PathsAndPropertiesPair = { propertyPaths: MetaEdPropertyPath[]; propertyChain: EntityProperty[] };

/**
 * A leaf reference element mapped to the property paths and chain of properties that lead to it
 */
type ReferenceElementsWithPaths = Map<ReferenceElement, PathsAndPropertiesPair>;

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
 * Returns true if the given property should be "merged away" due to its being marked as a
 * merge directive source along the given property chain.
 */
function isMergedAway(property: EntityProperty, propertyChain: EntityProperty[]): boolean {
  // Some property types are never merged away
  if (
    property.type === 'choice' ||
    property.type === 'common' ||
    property.type === 'inlineCommon' ||
    property.type === 'schoolYearEnumeration'
  ) {
    return false;
  }
  return propertyChain.some((propertyAlongChain) => property.mergeSourcedBy.includes(propertyAlongChain));
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
  omitMergedAwayProperties,
}: {
  referenceComponent: ReferenceComponent;
  currentPropertyPath: MetaEdPropertyPath;
  currentPropertyChain: EntityProperty[];
  propertyPathAccumulator: MetaEdPropertyPath[];
  propertyChainAccumulator: EntityProperty[];
  referenceElementsAccumulator: ReferenceElementsWithPaths;
  omitMergedAwayProperties: boolean;
}) {
  if (isReferenceElement(referenceComponent)) {
    if (omitMergedAwayProperties && isMergedAway(referenceComponent.sourceProperty, currentPropertyChain)) return;

    referenceElementsAccumulator.set(referenceComponent, {
      propertyPaths: propertyPathAccumulator.concat(
        joinPropertyPaths(currentPropertyPath, referenceComponent.sourceProperty.fullPropertyName as MetaEdPropertyPath),
      ),
      propertyChain: [...currentPropertyChain, referenceComponent.sourceProperty],
    });
  } else {
    (referenceComponent as ReferenceGroup).referenceComponents.forEach((subReferenceComponent) => {
      if (omitMergedAwayProperties && isMergedAway(subReferenceComponent.sourceProperty, currentPropertyChain)) return;

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
          omitMergedAwayProperties,
        });
      }
    });
  }
}

/**
 * Converts the given list of identity properties to only the "leaf" non-reference properties, in sorted order.
 * Includes the paths showing how the property came to be part of the identity, if it was via a reference identity
 * property.
 *
 * Omits properties that have been "merged away", meaning the property is marked as a merge directive source
 * along this property chain.
 */
export function flattenIdentityPropertiesFrom({
  identityProperties,
  omitMergedAwayProperties,
}: {
  identityProperties: EntityProperty[];
  omitMergedAwayProperties: boolean;
}): FlattenedIdentityProperty[] {
  const referenceElementsWithPaths: ReferenceElementsWithPaths = new Map();

  identityProperties.forEach((identityProperty) => {
    const initialPropertyPath = (
      identityProperty.type === 'association' || identityProperty.type === 'domainEntity'
        ? identityProperty.fullPropertyName
        : ''
    ) as MetaEdPropertyPath;

    const initialPropertyChain: EntityProperty[] =
      identityProperty.type === 'association' || identityProperty.type === 'domainEntity' ? [identityProperty] : [];

    flattenReferenceElementsFromComponent({
      referenceComponent: identityProperty.data.edfiApiSchema.referenceComponent,
      currentPropertyPath: initialPropertyPath,
      currentPropertyChain: initialPropertyChain,
      propertyPathAccumulator: initialPropertyPath === '' ? [] : [initialPropertyPath],
      propertyChainAccumulator: initialPropertyChain,
      referenceElementsAccumulator: referenceElementsWithPaths,
      omitMergedAwayProperties,
    });
  });

  const result: FlattenedIdentityProperty[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [referenceElement, pathsAndPropertiesPair] of referenceElementsWithPaths) {
    result.push({
      identityProperty: referenceElement.sourceProperty,
      propertyPaths: pathsAndPropertiesPair.propertyPaths,
      propertyChain: pathsAndPropertiesPair.propertyChain,
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
