import { EntityProperty, TopLevelEntity, isReferentialProperty } from '@edfi/metaed-core';
import {
  ReferenceElement,
  ReferenceComponent,
  ReferenceGroup,
  isReferenceGroup,
  isReferenceElement,
} from '../model/ReferenceComponent';
import { CollectedProperty } from '../model/CollectedProperty';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import { FlattenedIdentityProperty } from '../model/FlattenedIdentityProperty';
import { PropertyPath } from '../model/BrandedTypes';

type ReferenceElementsWithPaths = Map<ReferenceElement, PropertyPath[]>;

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
function joinPropertyPaths(currentPropertyPath: PropertyPath, newPropertyPath: PropertyPath): PropertyPath {
  if (currentPropertyPath === '') return newPropertyPath;
  return `${currentPropertyPath}.${newPropertyPath}` as PropertyPath;
}

/**
 * Flatten a graph of ReferenceComponents into an array of ReferenceElements, discarding any
 * ReferenceGroups that are part of the graph but preserving the path information.
 */
function flattenReferenceElementsFromComponent(
  referenceComponent: ReferenceComponent,
  currentPropertyPath: PropertyPath,
  propertyPathAccumulator: PropertyPath[],
  referenceElementsAccumulator: ReferenceElementsWithPaths,
) {
  if (isReferenceElement(referenceComponent)) {
    referenceElementsAccumulator.set(
      referenceComponent,
      propertyPathAccumulator.concat(
        joinPropertyPaths(currentPropertyPath, referenceComponent.sourceProperty.fullPropertyName as PropertyPath),
      ),
    );
  } else {
    (referenceComponent as ReferenceGroup).referenceComponents.forEach((subReferenceComponent) => {
      if (isReferenceElement(subReferenceComponent)) {
        const subReferenceElement: ReferenceElement = subReferenceComponent as ReferenceElement;
        referenceElementsAccumulator.set(
          subReferenceElement,
          propertyPathAccumulator.concat(
            joinPropertyPaths(currentPropertyPath, subReferenceElement.sourceProperty.fullPropertyName as PropertyPath),
          ),
        );
      } else {
        const nextPropertyPath: PropertyPath = joinPropertyPaths(
          currentPropertyPath,
          subReferenceComponent.sourceProperty.fullPropertyName as PropertyPath,
        );

        flattenReferenceElementsFromComponent(
          subReferenceComponent,
          nextPropertyPath,
          propertyPathAccumulator.concat(nextPropertyPath),
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
      isReferentialProperty(identityProperty) ? identityProperty.fullPropertyName : ''
    ) as PropertyPath;

    flattenReferenceElementsFromComponent(
      identityProperty.data.edfiApiSchema.referenceComponent,
      initialPropertyPath,
      initialPropertyPath === '' ? [] : [initialPropertyPath],
      referenceElementsWithPaths,
    );
  });

  const result: FlattenedIdentityProperty[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [referenceElement, propertyPaths] of referenceElementsWithPaths) {
    result.push({ identityProperty: referenceElement.sourceProperty, propertyPaths });
  }

  return result;
}

/**
 * CollectedProperties of all of the descriptor properties on the entity.
 */
export function descriptorCollectedPropertiesFrom(entity: TopLevelEntity): CollectedProperty[] {
  return (entity.data.edfiApiSchema as EntityApiSchemaData).collectedProperties.filter(
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
