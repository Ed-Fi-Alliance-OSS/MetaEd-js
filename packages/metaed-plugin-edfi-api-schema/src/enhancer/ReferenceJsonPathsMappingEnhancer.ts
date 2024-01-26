import invariant from 'ts-invariant';
import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  scalarPropertyTypes,
  ReferentialProperty,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { ReferenceJsonPathsMapping } from '../model/api-schema/ReferenceJsonPathsMapping';
import { JsonPathsInfo, JsonPathsMapping } from '../model/JsonPathsMapping';
import { ReferenceJsonPaths } from '../model/api-schema/ReferenceJsonPaths';
import { JsonPath } from '../model/api-schema/JsonPath';

/**
 * Returns a copy of the given jsonPathsMapping, with the property keys modified by removing the start of the property path.
 */
function removePropertyPathPrefixes(jsonPathsMapping: JsonPathsMapping, startOfPropertyPath: string): JsonPathsMapping {
  const result: JsonPathsMapping = {};
  const prefixToRemove: string = `${startOfPropertyPath}.`;

  Object.entries(jsonPathsMapping).forEach(([propertyPath, jsonPathsInfo]) => {
    invariant(propertyPath.startsWith(prefixToRemove));

    result[propertyPath.slice(prefixToRemove.length)] = jsonPathsInfo;
  });

  return result;
}

/**
 * Returns a stripped down copy of the given allJsonPathsMapping, with the only properties being those
 * property paths that descend below the given starting path and end at a single scalar value.
 *
 * Note this can return entries that are effectively duplicates. For example, both
 * CourseOffering.School and CourseOffering.School.SchoolId, which both resolve to the same
 * JsonPath and same terminalProperty of School.SchoolId
 */
function findDeepScalarPaths(allJsonPathsMapping: JsonPathsMapping, startOfPropertyPath: string): JsonPathsMapping {
  const result: JsonPathsMapping = {};

  Object.entries(allJsonPathsMapping).forEach(([k, v]) => {
    if (k === startOfPropertyPath) return;
    if (!k.startsWith(`${startOfPropertyPath}.`)) return;
    if (v.jsonPathPropertyPairs.length !== 1) return;
    if (!scalarPropertyTypes.includes(v.jsonPathPropertyPairs[0].sourceProperty.type)) return;

    result[k] = v;
  });

  return result;
}

function allJsonPathsMappingFor(entity: TopLevelEntity): JsonPathsMapping {
  const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  return edfiApiSchemaData.allJsonPathsMapping;
}

function addNewReferenceJsonPathsTo(
  mapping: ReferenceJsonPathsMapping,
  startOfPropertyPath: string,
  newReferenceJsonPaths: ReferenceJsonPaths,
) {
  if (mapping[startOfPropertyPath] == null) mapping[startOfPropertyPath] = [];
  mapping[startOfPropertyPath].push(newReferenceJsonPaths);
}

function matchupJsonPaths(
  startOfPropertyPath: string,
  fromReferencingEntity: JsonPathsMapping,
  fromReferencedEntity: JsonPathsMapping,
): ReferenceJsonPathsMapping {
  const result: ReferenceJsonPathsMapping = {};

  Object.entries(fromReferencingEntity).forEach(([referencingPropertyPath, referencingJsonPathsInfo]) => {
    invariant(fromReferencedEntity[referencingPropertyPath] != null);
    invariant(referencingJsonPathsInfo.jsonPathPropertyPairs.length === 1);

    const matchingJsonPathsInfo: JsonPathsInfo = fromReferencedEntity[referencingPropertyPath];

    // Only scalar paths are relevant
    if (
      matchingJsonPathsInfo.jsonPathPropertyPairs.length === 1 &&
      scalarPropertyTypes.includes(matchingJsonPathsInfo.jsonPathPropertyPairs[0].sourceProperty.type)
    ) {
      addNewReferenceJsonPathsTo(result, startOfPropertyPath, {
        referenceJsonPath: referencingJsonPathsInfo.jsonPathPropertyPairs[0].jsonPath,
        identityJsonPath: matchingJsonPathsInfo.jsonPathPropertyPairs[0].jsonPath,
      });
    }
  });

  return result;
}

/**
 * Returns a new ReferenceJsonPathsMapping with any duplicate entries in the ReferenceJsonPaths
 * array removed.
 */
function dedupeReferenceJsonPathsMapping(mapping: ReferenceJsonPathsMapping): ReferenceJsonPathsMapping {
  const result: ReferenceJsonPathsMapping = {};

  Object.entries(mapping).forEach(([propertyPath, referenceJsonPaths]) => {
    const duplicateReferenceJsonPathTracker: Set<JsonPath> = new Set();

    result[propertyPath] = referenceJsonPaths.filter((paths: ReferenceJsonPaths) => {
      const duplicate: boolean = duplicateReferenceJsonPathTracker.has(paths.referenceJsonPath);
      duplicateReferenceJsonPathTracker.add(paths.referenceJsonPath);
      return !duplicate;
    });
  });

  return result;
}

function addReferenceJsonPath(
  startOfPropertyPath: string,
  jsonPathsInfo: JsonPathsInfo,
  allJsonPathsMapping: JsonPathsMapping,
  result: ReferenceJsonPathsMapping,
) {
  // Only want paths at the top level
  if (!jsonPathsInfo.isTopLevel) return;

  // Only domain entity/association references
  if (jsonPathsInfo.terminalProperty.type === 'association' || jsonPathsInfo.terminalProperty.type === 'domainEntity') {
    const referenceProperty: ReferentialProperty = jsonPathsInfo.terminalProperty as ReferentialProperty;

    const deepScalarPaths: JsonPathsMapping = findDeepScalarPaths(allJsonPathsMapping, startOfPropertyPath);
    const propertyPathsLikeReferencedEntity: JsonPathsMapping = removePropertyPathPrefixes(
      deepScalarPaths,
      startOfPropertyPath,
    );
    const referencedEntityAllJsonPathsMapping: JsonPathsMapping = allJsonPathsMappingFor(referenceProperty.referencedEntity);

    const matchedReferenceJsonPathsMapping: ReferenceJsonPathsMapping = matchupJsonPaths(
      startOfPropertyPath,
      propertyPathsLikeReferencedEntity,
      referencedEntityAllJsonPathsMapping,
    );

    const dedupedReferenceJsonPathsMapping: ReferenceJsonPathsMapping = dedupeReferenceJsonPathsMapping(
      matchedReferenceJsonPathsMapping,
    );

    Object.assign(result, dedupedReferenceJsonPathsMapping);
  }
}

function referenceJsonPathsMappingFor(entity: TopLevelEntity): ReferenceJsonPathsMapping {
  const result: ReferenceJsonPathsMapping = {};

  const allJsonPathsMapping: JsonPathsMapping = allJsonPathsMappingFor(entity);

  Object.entries(allJsonPathsMapping).forEach(([propertyPath, jsonPathsInfo]) => {
    addReferenceJsonPath(propertyPath, jsonPathsInfo, allJsonPathsMapping, result);
  });

  return result;
}

/**
 * Derives a ReferenceJsonPathsMapping for each entity by taking the allJsonPathsMapping and matching reference
 * JsonPaths for a document to the identity JsonPaths for the document being referenced.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
      edfiApiSchemaData.referenceJsonPathsMapping = referenceJsonPathsMappingFor(entity as TopLevelEntity);
    },
  );

  return {
    enhancerName: 'ReferenceJsonPathsMappingEnhancer',
    success: true,
  };
}
