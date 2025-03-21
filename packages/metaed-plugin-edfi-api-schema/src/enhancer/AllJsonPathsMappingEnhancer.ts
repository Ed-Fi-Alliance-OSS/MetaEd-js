// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
  MetaEdPropertyPath,
} from '@edfi/metaed-core';
import { invariant } from 'ts-invariant';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { JsonPathsInfo, JsonPathsMapping } from '../model/JsonPathsMapping';
import type { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import { PropertyModifier, prefixedName, propertyModifierConcat } from '../model/PropertyModifier';
import {
  prependPrefixWithCollapse,
  findIdenticalRoleNamePatternPrefix,
  topLevelApiNameOnEntity,
  uncapitalize,
} from '../Utility';
import { FlattenedIdentityProperty, NoFlattenedIdentityProperty } from '../model/FlattenedIdentityProperty';
import { JsonPath } from '../model/api-schema/JsonPath';

const enhancerName = 'AllJsonPathsMappingEnhancer';

type AppendNextJsonPathNameOptions = { specialPrefix: string };

function appendNextJsonPathName(
  currentJsonPath: JsonPath,
  apiMappingName: string,
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  { specialPrefix }: AppendNextJsonPathNameOptions = { specialPrefix: '' },
): JsonPath {
  if (property.type === 'inlineCommon' || property.type === 'choice') return currentJsonPath;

  let nextName = prefixedName(apiMappingName, propertyModifier);

  if (specialPrefix !== '') {
    nextName = prependPrefixWithCollapse(nextName, specialPrefix);
  }

  return `${currentJsonPath}.${uncapitalize(nextName)}` as JsonPath;
}

/**
 * Adds a JsonPath to the JsonPathsMapping for a given list of PropertyPaths. Handles array initialization when needed.
 */
function addJsonPathTo(
  jsonPathsMapping: JsonPathsMapping,
  propertyPaths: MetaEdPropertyPath[],
  jsonPath: JsonPath,
  isTopLevel: boolean,
  terminalProperty: EntityProperty,
  flattenedIdentityProperty: FlattenedIdentityProperty,
) {
  propertyPaths.forEach((propertyPath) => {
    // initialize if necessary
    if (jsonPathsMapping[propertyPath] == null) {
      const initialJsonPathsInfo: JsonPathsInfo = isTopLevel
        ? { jsonPathPropertyPairs: [], isTopLevel, terminalProperty }
        : { jsonPathPropertyPairs: [], isTopLevel };
      jsonPathsMapping[propertyPath] = initialJsonPathsInfo;
    }

    // Avoid duplicates
    if (jsonPathsMapping[propertyPath].jsonPathPropertyPairs.map((jppp) => jppp.jsonPath).includes(jsonPath)) return;

    jsonPathsMapping[propertyPath].jsonPathPropertyPairs.push({
      jsonPath,
      sourceProperty: terminalProperty,
      flattenedIdentityProperty,
    });
  });
}

/**
 * Builds new property paths from the current path and the new identities. Adjusts for descriptor suffix if needed.
 */
function propertyPathsFromIdentityProperty(
  currentPropertyPath: MetaEdPropertyPath,
  flattenedIdentityProperty: FlattenedIdentityProperty,
): MetaEdPropertyPath[] {
  const result: MetaEdPropertyPath[] = flattenedIdentityProperty.propertyPaths.map(
    (propertyPath) => `${currentPropertyPath}.${propertyPath}` as MetaEdPropertyPath,
  );

  if (flattenedIdentityProperty.identityProperty.type !== 'descriptor') {
    return result;
  }

  // Append descriptor suffix to end of last path
  const lastPath: MetaEdPropertyPath | undefined = result.pop();
  invariant(lastPath != null, 'The path array should not be empty');
  result.push(`${lastPath}Descriptor` as MetaEdPropertyPath);
  return result;
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given referential property.
 */
function jsonPathsForReferentialProperty(
  property: ReferentialProperty,
  propertyModifier: PropertyModifier,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: MetaEdPropertyPath,
  currentJsonPath: JsonPath,
  isTopLevel: boolean,
) {
  const referencedEntityApiMapping = (property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData).apiMapping;

  const jsonPathsMappingForThisProperty: JsonPathsMapping = {};

  referencedEntityApiMapping.flattenedIdentityProperties.forEach((flattenedIdentityProperty: FlattenedIdentityProperty) => {
    const identityPropertyApiMapping = (
      flattenedIdentityProperty.identityProperty.data.edfiApiSchema as EntityPropertyApiSchemaData
    ).apiMapping;

    const specialPrefix: string = findIdenticalRoleNamePatternPrefix(flattenedIdentityProperty);

    // Because these are flattened, we know they are non-reference properties
    jsonPathsForNonReference(
      flattenedIdentityProperty.identityProperty,
      jsonPathsMappingForThisProperty,
      propertyPathsFromIdentityProperty(currentPropertyPath, flattenedIdentityProperty),
      appendNextJsonPathName(
        currentJsonPath,
        identityPropertyApiMapping.fullName,
        flattenedIdentityProperty.identityProperty,
        propertyModifier,
        { specialPrefix },
      ),
      false,
      flattenedIdentityProperty,
    );

    // Take the JsonPaths for entire property and apply to jsonPathsMapping for the property,
    // then add those collected results individually to jsonPathsMapping
    Object.values(jsonPathsMappingForThisProperty)
      .flat()
      .forEach((jsonPathsInfo: JsonPathsInfo) => {
        jsonPathsInfo.jsonPathPropertyPairs
          .map((jppp) => jppp.jsonPath)
          .forEach((jsonPath: JsonPath) => {
            // This relies on deduping in addJsonPathTo(), because we can expect multiple property paths to a json path
            addJsonPathTo(
              jsonPathsMapping,
              [currentPropertyPath],
              jsonPath,
              isTopLevel,
              property,
              flattenedIdentityProperty,
            );
          });
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
  currentPropertyPath: MetaEdPropertyPath,
  currentJsonPath: JsonPath,
  isTopLevel: boolean,
) {
  const { allProperties } = property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData;

  allProperties.forEach((allProperty) => {
    const concatenatedPropertyModifier: PropertyModifier = propertyModifierConcat(
      propertyModifier,
      allProperty.propertyModifier,
    );

    const childPropertyApiMapping = (allProperty.property.data.edfiApiSchema as EntityPropertyApiSchemaData).apiMapping;

    jsonPathsFor(
      allProperty.property,
      concatenatedPropertyModifier,
      jsonPathsMapping,
      `${currentPropertyPath}.${allProperty.property.fullPropertyName}` as MetaEdPropertyPath,
      appendNextJsonPathName(
        currentJsonPath,
        childPropertyApiMapping.topLevelName,
        allProperty.property,
        concatenatedPropertyModifier,
      ),
      isTopLevel,
    );
  });
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given
 * choice or inline common property.
 */
function jsonPathsForChoiceAndInlineCommonProperty(
  property: ChoiceProperty | InlineCommonProperty,
  propertyModifier: PropertyModifier,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: MetaEdPropertyPath,
  currentJsonPath: JsonPath,
  isTopLevel: boolean,
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
      jsonPathsMapping,
      `${currentPropertyPath}.${allProperty.property.fullPropertyName}` as MetaEdPropertyPath,
      appendNextJsonPathName(
        currentJsonPath,
        childPropertyApiMapping.topLevelName,
        allProperty.property,
        concatenatedPropertyModifier,
      ),
      isTopLevel,
    );
  });
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given non-reference property.
 */
function jsonPathsForNonReference(
  property: EntityProperty,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPaths: MetaEdPropertyPath[],
  currentJsonPath: JsonPath,
  isTopLevel: boolean,
  flattenedIdentityProperty: FlattenedIdentityProperty,
) {
  invariant(property.type !== 'association' && property.type !== 'common' && property.type !== 'domainEntity');

  if (property.type === 'schoolYearEnumeration' && property.parentEntity.type === 'common') {
    // For a common, the school year ends up being nested under a reference object
    addJsonPathTo(
      jsonPathsMapping,
      currentPropertyPaths,
      `${currentJsonPath}.schoolYear` as JsonPath,
      isTopLevel,
      property,
      flattenedIdentityProperty,
    );
  } else {
    addJsonPathTo(jsonPathsMapping, currentPropertyPaths, currentJsonPath, isTopLevel, property, flattenedIdentityProperty);
  }
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given reference collection property.
 */
function jsonPathsForReferenceCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: MetaEdPropertyPath,
  currentJsonPath: JsonPath,
  isTopLevel: boolean,
) {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  jsonPathsForReferentialProperty(
    property as ReferentialProperty,
    {
      ...propertyModifier,
      parentPrefixes: [], // reset prefixes inside the reference
    },
    jsonPathsMapping,
    currentPropertyPath,
    appendNextJsonPathName(
      `${currentJsonPath}[*]` as JsonPath,
      apiMapping.referenceCollectionName,
      property,
      propertyModifier,
    ),
    isTopLevel,
  );
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given descriptor collection property.
 */
function jsonPathsForDescriptorCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: MetaEdPropertyPath,
  currentJsonPath: JsonPath,
  isTopLevel: boolean,
) {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  addJsonPathTo(
    jsonPathsMapping,
    [currentPropertyPath],
    appendNextJsonPathName(
      `${currentJsonPath}[*]` as JsonPath,
      apiMapping.descriptorCollectionName,
      property,
      propertyModifier,
    ),
    isTopLevel,
    property,
    NoFlattenedIdentityProperty,
  );
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given non-reference
 * collection property.
 */
function jsonPathsForNonReferenceCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: MetaEdPropertyPath,
  currentJsonPath: JsonPath,
  isTopLevel: boolean,
) {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  jsonPathsForNonReference(
    property,
    jsonPathsMapping,
    [currentPropertyPath],
    appendNextJsonPathName(`${currentJsonPath}[*]` as JsonPath, apiMapping.fullName, property, propertyModifier),
    isTopLevel,
    NoFlattenedIdentityProperty,
  );
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to a given school year enumeration reference.
 */
function jsonPathsForSchoolYearEnumeration(
  property: EntityProperty,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: MetaEdPropertyPath,
  currentJsonPath: JsonPath,
  isTopLevel: boolean,
) {
  invariant(property.type === 'schoolYearEnumeration');

  addJsonPathTo(
    jsonPathsMapping,
    [currentPropertyPath],
    `${currentJsonPath}.schoolYear` as JsonPath,
    isTopLevel,
    property,
    NoFlattenedIdentityProperty,
  );
}

/**
 * Adds JSON Paths to the jsonPathsMapping for the API body shape corresponding to the given property
 */
function jsonPathsFor(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  jsonPathsMapping: JsonPathsMapping,
  currentPropertyPath: MetaEdPropertyPath,
  currentJsonPath: JsonPath,
  isTopLevel: boolean,
) {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (apiMapping.isReferenceCollection) {
    jsonPathsForReferenceCollection(
      property,
      propertyModifier,
      jsonPathsMapping,
      currentPropertyPath,
      currentJsonPath,
      isTopLevel,
    );
    return;
  }
  if (apiMapping.isScalarReference) {
    jsonPathsForReferentialProperty(
      property as ReferentialProperty,
      propertyModifier,
      jsonPathsMapping,
      currentPropertyPath,
      currentJsonPath,
      isTopLevel,
    );
    return;
  }
  if (apiMapping.isDescriptorCollection) {
    jsonPathsForDescriptorCollection(
      property,
      propertyModifier,
      jsonPathsMapping,
      `${currentPropertyPath}Descriptor` as MetaEdPropertyPath,
      currentJsonPath,
      isTopLevel,
    );
    return;
  }
  if (apiMapping.isCommonCollection) {
    jsonPathsForScalarCommonProperty(
      property as CommonProperty,
      propertyModifier,
      jsonPathsMapping,
      currentPropertyPath,
      `${currentJsonPath}[*]` as JsonPath,
      isTopLevel,
    );
    return;
  }
  if (apiMapping.isScalarCommon) {
    jsonPathsForScalarCommonProperty(
      property as CommonProperty,
      propertyModifier,
      jsonPathsMapping,
      currentPropertyPath,
      currentJsonPath,
      isTopLevel,
    );
    return;
  }
  if (apiMapping.isChoice || apiMapping.isInlineCommon) {
    jsonPathsForChoiceAndInlineCommonProperty(
      property as ChoiceProperty | InlineCommonProperty,
      propertyModifier,
      jsonPathsMapping,
      currentPropertyPath,
      currentJsonPath,
      isTopLevel,
    );
    return;
  }
  if (property.isRequiredCollection || property.isOptionalCollection) {
    jsonPathsForNonReferenceCollection(
      property,
      propertyModifier,
      jsonPathsMapping,
      currentPropertyPath,
      currentJsonPath,
      isTopLevel,
    );
    return;
  }
  if (property.type === 'descriptor') {
    jsonPathsForNonReference(
      property,
      jsonPathsMapping,
      [`${currentPropertyPath}Descriptor` as MetaEdPropertyPath],
      currentJsonPath,
      isTopLevel,
      NoFlattenedIdentityProperty,
    );
    return;
  }

  jsonPathsForNonReference(
    property,
    jsonPathsMapping,
    [currentPropertyPath],
    currentJsonPath,
    isTopLevel,
    NoFlattenedIdentityProperty,
  );
}

/**
 * Builds the jsonPathsMapping for an entity.
 */
function buildJsonPathsMapping(entity: TopLevelEntity) {
  const { allProperties, allJsonPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

  allProperties.forEach(({ property, propertyModifier }) => {
    const topLevelName = topLevelApiNameOnEntity(entity, property);
    let jsonPathRootString = '$';
    const referenceProperty: ReferentialProperty = property as ReferentialProperty;

    if (entity.type === 'associationExtension' || entity.type === 'domainEntityExtension') {
      const endpointName = referenceProperty.namespace.projectName.toLocaleLowerCase() as string;
      jsonPathRootString += `._ext.${endpointName}`;
    }

    const schemaObjectBaseName = appendNextJsonPathName(
      jsonPathRootString as JsonPath,
      topLevelName,
      property,
      propertyModifier,
    );

    if (property.type === 'schoolYearEnumeration')
      jsonPathsForSchoolYearEnumeration(
        property,
        allJsonPathsMapping,
        property.fullPropertyName as MetaEdPropertyPath,
        schemaObjectBaseName,
        true,
      );
    else
      jsonPathsFor(
        property,
        propertyModifier,
        allJsonPathsMapping,
        property.fullPropertyName as MetaEdPropertyPath,
        schemaObjectBaseName,
        true,
      );

    // ensure JsonPathPropertyPairs are in sorted order by JsonPath as the JsonPathsMapping type requires
    Object.values(allJsonPathsMapping).forEach((jsonPathsInfo: JsonPathsInfo) => {
      jsonPathsInfo.jsonPathPropertyPairs.sort((a, b) => a.jsonPath.localeCompare(b.jsonPath));
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
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'associationExtension',
    'domainEntityExtension',
  ).forEach((entity) => {
    buildJsonPathsMapping(entity as TopLevelEntity);
  });

  return {
    enhancerName,
    success: true,
  };
}
