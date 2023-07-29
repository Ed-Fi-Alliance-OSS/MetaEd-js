/* eslint-disable no-use-before-define */

import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  ReferentialProperty,
  EntityProperty,
  CommonProperty,
  TopLevelEntity,
} from '@edfi/metaed-core';
import { invariant } from 'ts-invariant';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { JsonPathsMapping } from '../model/JsonPathsMapping';
import type { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import { PropertyModifier, prefixedName, propertyModifierConcat } from '../model/PropertyModifier';
import { singularize, topLevelApiNameOnEntity } from '../Utility';
import type { JsonPath, PropertyPath } from '../model/PathTypes';
import { FlattenedIdentityProperty } from '../model/FlattenedIdentityProperty';

const enhancerName = 'JsonPathsMappingEnhancer';

/**
 * Adds a JsonPath to the JsonPathsMapping for a given list of PropertyPaths. Handles array initialization when needed.
 */
function addJsonPathTo(jsonPathsMapping: JsonPathsMapping, propertyPaths: PropertyPath[], jsonPath: JsonPath) {
  propertyPaths.forEach((propertyPath) => {
    // initalize if necessary
    if (jsonPathsMapping[propertyPath] == null) jsonPathsMapping[propertyPath] = [];
    // Avoid duplicates
    if (jsonPathsMapping[propertyPath].includes(jsonPath)) return;

    jsonPathsMapping[propertyPath].push(jsonPath);
  });
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given referential property.
 */
function jsonPathsForReferentialProperty(
  property: ReferentialProperty,
  propertyModifier: PropertyModifier,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  const referencedEntityApiMapping = (property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData).apiMapping;

  const jsonPathsMappingForThisProperty: JsonPathsMapping = {};

  referencedEntityApiMapping.flattenedIdentityProperties.forEach((flattenedIdentityProperty: FlattenedIdentityProperty) => {
    const identityPropertyApiMapping = (
      flattenedIdentityProperty.identityProperty.data.edfiApiSchema as EntityPropertyApiSchemaData
    ).apiMapping;
    const schemaPropertyName: string = prefixedName(
      identityPropertyApiMapping.fullName,
      flattenedIdentityProperty.identityProperty,
      propertyModifier,
    );

    // Because these are flattened, we know they are non-reference properties
    jsonPathsForNonReference(
      flattenedIdentityProperty.identityProperty,
      jsonPathsMappingForThisProperty,
      flattenedIdentityProperty.propertyPaths.map(
        (propertyPath) => `${currentPropertyPath}.${propertyPath}` as PropertyPath,
      ),
      `${currentJsonPath}.${schemaPropertyName}` as JsonPath,
    );

    // Take the JsonPaths for entire property and apply to jsonPathsMapping for the property,
    // then add those collected results individually to jsonPathsMapping
    Object.values(jsonPathsMappingForThisProperty)
      .flat()
      .forEach((jsonPath: JsonPath) => {
        // This relies on deduping in addJsonPathTo(), because we can expect multiple property paths to a json path
        addJsonPathTo(jsonPathsMapping, [currentPropertyPath], jsonPath);
      });
    Object.assign(jsonPathsMapping, jsonPathsMappingForThisProperty);
  });
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given scalar common property.
 */
function jsonPathsForScalarCommonProperty(
  property: CommonProperty,
  propertyModifier: PropertyModifier,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  const { collectedApiProperties } = property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData;

  collectedApiProperties.forEach((collectedApiProperty) => {
    const concatenatedPropertyModifier: PropertyModifier = propertyModifierConcat(
      propertyModifier,
      collectedApiProperty.propertyModifier,
    );

    const referencePropertyApiMapping = (collectedApiProperty.property.data.edfiApiSchema as EntityPropertyApiSchemaData)
      .apiMapping;
    const schemaPropertyName: string = prefixedName(
      referencePropertyApiMapping.topLevelName,
      collectedApiProperty.property,
      concatenatedPropertyModifier,
    );

    jsonPathsFor(
      collectedApiProperty.property,
      concatenatedPropertyModifier,
      jsonPathsMapping,
      `${currentPropertyPath}.${collectedApiProperty.property.fullPropertyName}` as PropertyPath,
      `${currentJsonPath}.${schemaPropertyName}` as JsonPath,
    );
  });
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given non-reference property.
 */
function jsonPathsForNonReference(
  property: EntityProperty,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPaths: PropertyPath[],
  currentJsonPath: JsonPath,
) {
  invariant(property.type !== 'association' && property.type !== 'common' && property.type !== 'domainEntity');

  if (property.type === 'schoolYearEnumeration' && property.parentEntity.type === 'common') {
    // For a common, the school year ends up being nested under a reference object
    addJsonPathTo(jsonPathsMapping, currentPropertyPaths, `${currentJsonPath}.schoolYear` as JsonPath);
  } else {
    addJsonPathTo(jsonPathsMapping, currentPropertyPaths, currentJsonPath);
  }
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given reference collection property.
 */
function jsonPathsForReferenceCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const referenceName = prefixedName(apiMapping.referenceCollectionName, property, propertyModifier);

  jsonPathsForReferentialProperty(
    property as ReferentialProperty,
    {
      ...propertyModifier,
      parentPrefixes: [], // reset prefixes inside the reference
    },
    jsonPathsMapping,
    currentPropertyPath,
    `${currentJsonPath}[*].${referenceName}` as JsonPath,
  );
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given descriptor collection property.
 */
function jsonPathsForDescriptorCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const descriptorName = prefixedName(apiMapping.descriptorCollectionName, property, propertyModifier);

  addJsonPathTo(jsonPathsMapping, [currentPropertyPath], `${currentJsonPath}[*].${descriptorName}` as JsonPath);
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given non-reference
 * collection property.
 */
function jsonPathsForNonReferenceCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const propertyName = singularize(prefixedName(apiMapping.fullName, property, propertyModifier));

  jsonPathsForNonReference(
    property,
    jsonPathsMapping,
    [currentPropertyPath],
    `${currentJsonPath}[*].${propertyName}` as JsonPath,
  );
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to a given school year enumeration reference.
 */
function jsonPathsForSchoolYearEnumeration(
  property: EntityProperty,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  invariant(property.type === 'schoolYearEnumeration');

  addJsonPathTo(jsonPathsMapping, [currentPropertyPath], `${currentJsonPath}.schoolYear` as JsonPath);
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given property
 */
function jsonPathsFor(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (apiMapping.isReferenceCollection) {
    jsonPathsForReferenceCollection(property, propertyModifier, jsonPathsMapping, currentPropertyPath, currentJsonPath);
    return;
  }
  if (apiMapping.isScalarReference) {
    jsonPathsForReferentialProperty(
      property as ReferentialProperty,
      propertyModifier,
      jsonPathsMapping,
      currentPropertyPath,
      currentJsonPath,
    );
    return;
  }
  if (apiMapping.isDescriptorCollection) {
    jsonPathsForDescriptorCollection(property, propertyModifier, jsonPathsMapping, currentPropertyPath, currentJsonPath);
    return;
  }
  if (apiMapping.isCommonCollection) {
    jsonPathsForScalarCommonProperty(
      property as CommonProperty,
      propertyModifier,
      jsonPathsMapping,
      currentPropertyPath,
      `${currentJsonPath}[*]` as JsonPath,
    );
    return;
  }

  // TODO: temporary to have this be multiples
  if (apiMapping.isScalarCommon || apiMapping.isChoice || apiMapping.isInlineCommon) {
    jsonPathsForScalarCommonProperty(
      property as CommonProperty,
      propertyModifier,
      jsonPathsMapping,
      currentPropertyPath,
      currentJsonPath,
    );
    return;
  }
  if (property.isRequiredCollection || property.isOptionalCollection) {
    jsonPathsForNonReferenceCollection(property, propertyModifier, jsonPathsMapping, currentPropertyPath, currentJsonPath);
    return;
  }

  jsonPathsForNonReference(property, jsonPathsMapping, [currentPropertyPath], currentJsonPath);
}

/**
 * Builds the jsonPathsMapping for an entity.
 */
function buildJsonPathsMapping(entity: TopLevelEntity) {
  const { allProperties, jsonPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

  allProperties.forEach(({ property, propertyModifier }) => {
    const topLevelName = topLevelApiNameOnEntity(entity, property);
    const schemaObjectBaseName = prefixedName(topLevelName, property, propertyModifier);

    if (property.type === 'schoolYearEnumeration')
      jsonPathsForSchoolYearEnumeration(
        property,
        jsonPathsMapping,
        property.fullPropertyName as PropertyPath,
        `$.${schemaObjectBaseName}` as JsonPath,
      );
    else
      jsonPathsFor(
        property,
        propertyModifier,
        jsonPathsMapping,
        property.fullPropertyName as PropertyPath,
        `$.${schemaObjectBaseName}` as JsonPath,
      );

    // ensure JsonPaths are in sorted order as the JsonPathsMapping type requires
    Object.values(jsonPathsMapping).forEach((jsonPaths: JsonPath[]) => {
      jsonPaths.sort();
    });
  });
}

/**
 * This enhancer uses the results of the ApiMappingEnhancer to build a JsonPathsMapping
 * for each MetaEd entity that expresses as a resource in the API. This is a mapping from
 * dot-separated MetaEd property paths to corresponding JsonPaths to data elements in the API document.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Build schemas for each domain entity and association
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      buildJsonPathsMapping(entity as TopLevelEntity);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
