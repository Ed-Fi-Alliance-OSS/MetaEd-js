/* eslint-disable no-use-before-define */

import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  ReferentialProperty,
  EntityProperty,
  CommonProperty,
  TopLevelEntity,
  InlineCommonProperty,
  ChoiceProperty,
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

type AppendNextJsonPathNameOptions = { singularizeName: boolean };

function appendNextJsonPathName(
  currentJsonPath: JsonPath,
  apiMappingName: string,
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  { singularizeName }: AppendNextJsonPathNameOptions = { singularizeName: false },
): JsonPath {
  if (property.type === 'inlineCommon' || property.type === 'choice') return currentJsonPath;

  let nextName = prefixedName(apiMappingName, property, propertyModifier);
  if (singularizeName) nextName = singularize(nextName);

  return `${currentJsonPath}.${nextName}` as JsonPath;
}
/**
 * Adds a JsonPath to the JsonPathsMapping for a given list of PropertyPaths. Handles array initialization when needed.
 */
function addJsonPathTo(allJsonPathsMapping: JsonPathsMapping, propertyPaths: PropertyPath[], jsonPath: JsonPath) {
  propertyPaths.forEach((propertyPath) => {
    // initalize if necessary
    if (allJsonPathsMapping[propertyPath] == null) allJsonPathsMapping[propertyPath] = [];
    // Avoid duplicates
    if (allJsonPathsMapping[propertyPath].includes(jsonPath)) return;

    allJsonPathsMapping[propertyPath].push(jsonPath);
  });
}

/**
 * Adds JSON Paths to the allJsonPathsMapping for the API body shape corresponding to the given referential property.
 */
function jsonPathsForReferentialProperty(
  property: ReferentialProperty,
  propertyModifier: PropertyModifier,
  allJsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  const referencedEntityApiMapping = (property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData).apiMapping;

  const jsonPathsMappingForThisProperty: JsonPathsMapping = {};

  referencedEntityApiMapping.flattenedIdentityProperties.forEach((flattenedIdentityProperty: FlattenedIdentityProperty) => {
    const identityPropertyApiMapping = (
      flattenedIdentityProperty.identityProperty.data.edfiApiSchema as EntityPropertyApiSchemaData
    ).apiMapping;

    // Because these are flattened, we know they are non-reference properties
    jsonPathsForNonReference(
      flattenedIdentityProperty.identityProperty,
      jsonPathsMappingForThisProperty,
      flattenedIdentityProperty.propertyPaths.map(
        (propertyPath) => `${currentPropertyPath}.${propertyPath}` as PropertyPath,
      ),
      appendNextJsonPathName(
        currentJsonPath,
        identityPropertyApiMapping.fullName,
        flattenedIdentityProperty.identityProperty,
        propertyModifier,
      ),
    );

    // Take the JsonPaths for entire property and apply to allJsonPathsMapping for the property,
    // then add those collected results individually to allJsonPathsMapping
    Object.values(jsonPathsMappingForThisProperty)
      .flat()
      .forEach((jsonPath: JsonPath) => {
        // This relies on deduping in addJsonPathTo(), because we can expect multiple property paths to a json path
        addJsonPathTo(allJsonPathsMapping, [currentPropertyPath], jsonPath);
      });
    Object.assign(allJsonPathsMapping, jsonPathsMappingForThisProperty);
  });
}

/**
 * Adds JSON Paths to the allJsonPathsMapping for the API body shape corresponding to the given scalar common property.
 */
function jsonPathsForScalarCommonProperty(
  property: CommonProperty,
  propertyModifier: PropertyModifier,
  allJsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  const { collectedApiProperties } = property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData;

  collectedApiProperties.forEach((collectedApiProperty) => {
    const concatenatedPropertyModifier: PropertyModifier = propertyModifierConcat(
      propertyModifier,
      collectedApiProperty.propertyModifier,
    );

    const childPropertyApiMapping = (collectedApiProperty.property.data.edfiApiSchema as EntityPropertyApiSchemaData)
      .apiMapping;

    jsonPathsFor(
      collectedApiProperty.property,
      concatenatedPropertyModifier,
      allJsonPathsMapping,
      `${currentPropertyPath}.${collectedApiProperty.property.fullPropertyName}` as PropertyPath,
      appendNextJsonPathName(
        currentJsonPath,
        childPropertyApiMapping.topLevelName,
        collectedApiProperty.property,
        concatenatedPropertyModifier,
      ),
    );
  });
}

/**
 * Adds JSON Paths to the allJsonPathsMapping for the API body shape corresponding to the given
 * choice or inline common property.
 */
function jsonPathsForChoiceAndInlineCommonProperty(
  property: ChoiceProperty | InlineCommonProperty,
  propertyModifier: PropertyModifier,
  allJsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  // prefixes from choice and inline common that affect child properties
  const parentPrefixes: string[] =
    property.roleName === property.metaEdName
      ? [...propertyModifier.parentPrefixes]
      : [...propertyModifier.parentPrefixes, property.roleName];

  const { allProperties } = property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData;

  allProperties.forEach((allProperty) => {
    const concatenatedPropertyModifier: PropertyModifier = propertyModifierConcat(
      { optionalDueToParent: propertyModifier.optionalDueToParent, parentPrefixes },
      allProperty.propertyModifier,
    );

    const childPropertyApiMapping = (allProperty.property.data.edfiApiSchema as EntityPropertyApiSchemaData).apiMapping;

    jsonPathsFor(
      allProperty.property,
      concatenatedPropertyModifier,
      allJsonPathsMapping,
      `${currentPropertyPath}.${allProperty.property.fullPropertyName}` as PropertyPath,
      appendNextJsonPathName(
        currentJsonPath,
        childPropertyApiMapping.topLevelName,
        allProperty.property,
        concatenatedPropertyModifier,
      ),
    );
  });
}

/**
 * Adds JSON Paths to the allJsonPathsMapping for the API body shape corresponding to the given non-reference property.
 */
function jsonPathsForNonReference(
  property: EntityProperty,
  allJsonPathsMapping: JsonPathsMapping,
  currentPropertyPaths: PropertyPath[],
  currentJsonPath: JsonPath,
) {
  invariant(property.type !== 'association' && property.type !== 'common' && property.type !== 'domainEntity');

  if (property.type === 'schoolYearEnumeration' && property.parentEntity.type === 'common') {
    // For a common, the school year ends up being nested under a reference object
    addJsonPathTo(allJsonPathsMapping, currentPropertyPaths, `${currentJsonPath}.schoolYear` as JsonPath);
  } else {
    addJsonPathTo(allJsonPathsMapping, currentPropertyPaths, currentJsonPath);
  }
}

/**
 * Adds JSON Paths to the allJsonPathsMapping for the API body shape corresponding to the given reference collection property.
 */
function jsonPathsForReferenceCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  allJsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  jsonPathsForReferentialProperty(
    property as ReferentialProperty,
    {
      ...propertyModifier,
      parentPrefixes: [], // reset prefixes inside the reference
    },
    allJsonPathsMapping,
    currentPropertyPath,
    appendNextJsonPathName(
      `${currentJsonPath}[*]` as JsonPath,
      apiMapping.referenceCollectionName,
      property,
      propertyModifier,
    ),
  );
}

/**
 * Adds JSON Paths to the allJsonPathsMapping for the API body shape corresponding to the given descriptor collection property.
 */
function jsonPathsForDescriptorCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  allJsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  addJsonPathTo(
    allJsonPathsMapping,
    [currentPropertyPath],
    appendNextJsonPathName(
      `${currentJsonPath}[*]` as JsonPath,
      apiMapping.descriptorCollectionName,
      property,
      propertyModifier,
    ),
  );
}

/**
 * Adds JSON Paths to the allJsonPathsMapping for the API body shape corresponding to the given non-reference
 * collection property.
 */
function jsonPathsForNonReferenceCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  allJsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  jsonPathsForNonReference(
    property,
    allJsonPathsMapping,
    [currentPropertyPath],
    appendNextJsonPathName(`${currentJsonPath}[*]` as JsonPath, apiMapping.fullName, property, propertyModifier, {
      singularizeName: true,
    }),
  );
}

/**
 * Adds JSON Paths to the allJsonPathsMapping for the API body shape corresponding to a given school year enumeration reference.
 */
function jsonPathsForSchoolYearEnumeration(
  property: EntityProperty,
  allJsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  invariant(property.type === 'schoolYearEnumeration');

  addJsonPathTo(allJsonPathsMapping, [currentPropertyPath], `${currentJsonPath}.schoolYear` as JsonPath);
}

/**
 * Adds JSON Paths to the allJsonPathsMapping for the API body shape corresponding to the given property
 */
function jsonPathsFor(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  allJsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: PropertyPath,
  currentJsonPath: JsonPath,
) {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (apiMapping.isReferenceCollection) {
    jsonPathsForReferenceCollection(property, propertyModifier, allJsonPathsMapping, currentPropertyPath, currentJsonPath);
    return;
  }
  if (apiMapping.isScalarReference) {
    jsonPathsForReferentialProperty(
      property as ReferentialProperty,
      propertyModifier,
      allJsonPathsMapping,
      currentPropertyPath,
      currentJsonPath,
    );
    return;
  }
  if (apiMapping.isDescriptorCollection) {
    jsonPathsForDescriptorCollection(property, propertyModifier, allJsonPathsMapping, currentPropertyPath, currentJsonPath);
    return;
  }
  if (apiMapping.isCommonCollection) {
    jsonPathsForScalarCommonProperty(
      property as CommonProperty,
      propertyModifier,
      allJsonPathsMapping,
      currentPropertyPath,
      `${currentJsonPath}[*]` as JsonPath,
    );
    return;
  }
  if (apiMapping.isScalarCommon) {
    jsonPathsForScalarCommonProperty(
      property as CommonProperty,
      propertyModifier,
      allJsonPathsMapping,
      currentPropertyPath,
      currentJsonPath,
    );
    return;
  }
  if (apiMapping.isChoice || apiMapping.isInlineCommon) {
    jsonPathsForChoiceAndInlineCommonProperty(
      property as ChoiceProperty | InlineCommonProperty,
      propertyModifier,
      allJsonPathsMapping,
      currentPropertyPath,
      currentJsonPath,
    );
    return;
  }
  if (property.isRequiredCollection || property.isOptionalCollection) {
    jsonPathsForNonReferenceCollection(
      property,
      propertyModifier,
      allJsonPathsMapping,
      currentPropertyPath,
      currentJsonPath,
    );
    return;
  }

  jsonPathsForNonReference(property, allJsonPathsMapping, [currentPropertyPath], currentJsonPath);
}

/**
 * Builds the allJsonPathsMapping for an entity.
 */
function buildJsonPathsMapping(entity: TopLevelEntity) {
  const { allProperties, allJsonPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

  allProperties.forEach(({ property, propertyModifier }) => {
    const topLevelName = topLevelApiNameOnEntity(entity, property);
    const schemaObjectBaseName = appendNextJsonPathName('$' as JsonPath, topLevelName, property, propertyModifier);

    if (property.type === 'schoolYearEnumeration')
      jsonPathsForSchoolYearEnumeration(
        property,
        allJsonPathsMapping,
        property.fullPropertyName as PropertyPath,
        schemaObjectBaseName,
      );
    else
      jsonPathsFor(
        property,
        propertyModifier,
        allJsonPathsMapping,
        property.fullPropertyName as PropertyPath,
        schemaObjectBaseName,
      );

    // ensure JsonPaths are in sorted order as the JsonPathsMapping type requires
    Object.values(allJsonPathsMapping).forEach((jsonPaths: JsonPath[]) => {
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
