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
 * All of the identity properties of the given entity, in sorted order
 */
export function identityReferenceComponentsFrom(identityProperties: EntityProperty[]): ReferenceComponent[] {
  return identityProperties.map(
    (property) => (property.data.edfiApiSchema as EntityPropertyApiSchemaData).referenceComponent,
  );
}

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
 * Flatten a graph of ReferenceComponents into an array of ReferenceElements, discarding any
 * ReferenceGroups that are part of the graph but preserving the property and property path information.
 */
function flattenReferenceElementsFromComponent(
  referenceComponent: ReferenceComponent,
  currentPropertyPath: MetaEdPropertyPath,
  currentPropertyChain: EntityProperty[],
  propertyPathAccumulator: MetaEdPropertyPath[],
  propertyChainAccumulator: EntityProperty[],
  referenceElementsAccumulator: ReferenceElementsWithPaths,
) {
  if (isReferenceElement(referenceComponent)) {
    referenceElementsAccumulator.set(referenceComponent, {
      propertyPaths: propertyPathAccumulator.concat(
        joinPropertyPaths(currentPropertyPath, referenceComponent.sourceProperty.fullPropertyName as MetaEdPropertyPath),
      ),
      propertyChain: [...currentPropertyChain, referenceComponent.sourceProperty],
    });
  } else {
    (referenceComponent as ReferenceGroup).referenceComponents.forEach((subReferenceComponent) => {
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

        flattenReferenceElementsFromComponent(
          subReferenceComponent,
          nextPropertyPath,
          [...currentPropertyChain, subReferenceComponent.sourceProperty],
          propertyPathAccumulator.concat(nextPropertyPath),
          propertyChainAccumulator,
          referenceElementsAccumulator,
        );
      }
    });
  }
}

/**
 * Converts the given list of identity properties to only the "leaf" non-reference properties, in sorted order.
 * Includes the paths showing how the property came to be part of the identity, if it was via a reference identity
 * property.
 */
export function flattenedIdentityPropertiesFrom(identityProperties: EntityProperty[]): FlattenedIdentityProperty[] {
  const referenceElementsWithPaths: ReferenceElementsWithPaths = new Map();

  identityProperties.forEach((identityProperty) => {
    const initialPropertyPath = (
      identityProperty.type === 'association' || identityProperty.type === 'domainEntity'
        ? identityProperty.fullPropertyName
        : ''
    ) as MetaEdPropertyPath;

    const initialPropertyChain: EntityProperty[] =
      identityProperty.type === 'association' || identityProperty.type === 'domainEntity' ? [identityProperty] : [];

    flattenReferenceElementsFromComponent(
      identityProperty.data.edfiApiSchema.referenceComponent,
      initialPropertyPath,
      initialPropertyChain,
      initialPropertyPath === '' ? [] : [initialPropertyPath],
      initialPropertyChain,
      referenceElementsWithPaths,
    );
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
