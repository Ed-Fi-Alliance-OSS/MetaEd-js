import invariant from 'ts-invariant';
import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  EntityProperty,
  ReferentialProperty,
  scalarPropertyTypes,
  PropertyType,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { DocumentPathsMapping } from '../model/api-schema/DocumentPathsMapping';
import { DescriptorReferencePath, DocumentReferencePaths, ScalarPath } from '../model/api-schema/DocumentPaths';
import { ReferenceJsonPaths } from '../model/api-schema/ReferenceJsonPaths';
import { JsonPathPropertyPair, JsonPathsInfo, JsonPathsMapping } from '../model/JsonPathsMapping';
import { PathType } from '../model/api-schema/PathType';

/**
 * Returns a stripped down copy of the given mergeJsonPathsMapping, with the only properties being those
 * property paths that descend below the given starting path and end at a single scalar value.
 *
 * Note this can return entries that are effectively duplicates. For example, both
 * CourseOffering.School and CourseOffering.School.SchoolId, which both resolve to the same
 * JsonPath and same terminalProperty of School.SchoolId
 */
function findDeepScalarPaths(mergeJsonPathsMapping: JsonPathsMapping, startOfPropertyPath: string): JsonPathsMapping {
  const result: JsonPathsMapping = {};

  Object.entries(mergeJsonPathsMapping).forEach(([k, v]) => {
    if (k === startOfPropertyPath) return;
    if (!k.startsWith(`${startOfPropertyPath}.`)) return;
    if (v.jsonPathPropertyPairs.length !== 1) return;
    if (!scalarPropertyTypes.includes(v.jsonPathPropertyPairs[0].sourceProperty.type)) return;

    result[k] = v;
  });

  return result;
}

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

function allJsonPathsMappingFor(entity: TopLevelEntity): JsonPathsMapping {
  const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  return edfiApiSchemaData.allJsonPathsMapping;
}

function getPathType(propertyType: PropertyType): PathType {
  switch (propertyType) {
    case 'boolean':
      return 'boolean';
    case 'currency':
    case 'decimal':
    case 'duration':
    case 'percent':
    case 'sharedDecimal':
    case 'integer':
    case 'sharedInteger':
    case 'short':
    case 'sharedShort':
    case 'year':
      return 'number';
    case 'date':
      return 'date';
    case 'datetime':
      return 'date-time';
    case 'descriptor':
    case 'enumeration':
    case 'sharedString':
    case 'string':
      return 'string';
    case 'time':
      return 'time';
    case 'choice':
    case 'inlineCommon':
    default:
      return 'string';
  }
}

/**
 * If the path is being merged away, we need to use the covering reference path instead
 */
function adjustForMerges(referencingJsonPathsInfo: JsonPathsInfo, fromReferencingEntity: JsonPathsMapping): JsonPathsInfo {
  const { mergeCoveredBy } = referencingJsonPathsInfo.jsonPathPropertyPairs[0].flattenedIdentityProperty;

  // If not being merged away, nothing to do
  if (mergeCoveredBy == null) {
    return referencingJsonPathsInfo;
  }

  // If merged away, find the JsonPathsInfo representing the covering merge path, because the
  // original doesn't exist in the document reference. Instead, the same path as the covering
  // path will be used, as it actually exists and obviously must have the same value.
  //
  // Take the last property path, as it is the deepest level path for the property
  // (e.g. Session.School.SchoolId as opposed to Session at the first level)
  let coveringMergePropertyPath: string | undefined = mergeCoveredBy.propertyPaths.at(-1);

  // There should always be a property path, but need to handle for TypeScript
  if (coveringMergePropertyPath == null) return referencingJsonPathsInfo;

  // Append "Descriptor" to propertyPath if terminal property is a descriptor, to match descriptor paths
  // in fromReferencingEntity, which derives from an allJsonPathsMapping
  if (mergeCoveredBy.propertyChain.at(-1)?.type === 'descriptor') {
    coveringMergePropertyPath += 'Descriptor';
  }

  invariant(
    fromReferencingEntity[coveringMergePropertyPath] != null,
    `coveringMergePropertyPath "${coveringMergePropertyPath}" not found in fromReferencingEntity JsonPathsMapping`,
  );
  return fromReferencingEntity[coveringMergePropertyPath];
}

function matchupJsonPaths(
  fromReferencingEntity: JsonPathsMapping,
  fromReferencedEntity: JsonPathsMapping,
): ReferenceJsonPaths[] {
  const result: ReferenceJsonPaths[] = [];

  Object.entries(fromReferencingEntity).forEach(([referencingPropertyPath, referencingJsonPathsInfo]) => {
    invariant(
      fromReferencedEntity[referencingPropertyPath] != null,
      `referencingPropertyPath "${referencingPropertyPath}" not found in fromReferencedEntity JsonPathsMapping`,
    );
    invariant(
      referencingJsonPathsInfo.jsonPathPropertyPairs.length === 1,
      `referencingJsonPathsInfo.jsonPathPropertyPairs should have a single entry but had ${referencingJsonPathsInfo.jsonPathPropertyPairs.length}`,
    );

    const mergeAdjustedReferencingJsonPathsInfo: JsonPathsInfo = adjustForMerges(
      referencingJsonPathsInfo,
      fromReferencingEntity,
    );

    const matchingJsonPathsInfo: JsonPathsInfo = fromReferencedEntity[referencingPropertyPath];

    // Only scalar paths are relevant
    if (
      matchingJsonPathsInfo.jsonPathPropertyPairs.length === 1 &&
      scalarPropertyTypes.includes(matchingJsonPathsInfo.jsonPathPropertyPairs[0].sourceProperty.type)
    ) {
      result.push({
        referenceJsonPath: mergeAdjustedReferencingJsonPathsInfo.jsonPathPropertyPairs[0].jsonPath,
        identityJsonPath: matchingJsonPathsInfo.jsonPathPropertyPairs[0].jsonPath,
        type: getPathType(mergeAdjustedReferencingJsonPathsInfo.jsonPathPropertyPairs[0].sourceProperty.type),
      });
    }
  });

  return result;
}

/**
 * Returns a new ReferenceJsonPaths[] with any duplicate entries in the ReferenceJsonPaths
 * array removed.
 */
function dedupeReferenceJsonPaths(referenceJsonPathsArray: ReferenceJsonPaths[]): ReferenceJsonPaths[] {
  const duplicateReferenceJsonPathTracker: Set<string> = new Set();

  return referenceJsonPathsArray.filter((paths: ReferenceJsonPaths) => {
    const pathKey: string = `${paths.identityJsonPath}-${paths.referenceJsonPath}`;
    const duplicate: boolean = duplicateReferenceJsonPathTracker.has(pathKey);
    duplicateReferenceJsonPathTracker.add(pathKey);
    return !duplicate;
  });
}

function buildReferenceJsonPaths(
  startOfPropertyPath: string,
  referencedEntity: TopLevelEntity,
  allJsonPathsMapping: JsonPathsMapping,
): ReferenceJsonPaths[] {
  const deepScalarPaths: JsonPathsMapping = findDeepScalarPaths(allJsonPathsMapping, startOfPropertyPath);
  const propertyPathsLikeReferencedEntity: JsonPathsMapping = removePropertyPathPrefixes(
    deepScalarPaths,
    startOfPropertyPath,
  );
  const referencedEntityAllJsonPathsMapping: JsonPathsMapping = allJsonPathsMappingFor(referencedEntity);

  const matchedReferenceJsonPathsArray: ReferenceJsonPaths[] = matchupJsonPaths(
    propertyPathsLikeReferencedEntity,
    referencedEntityAllJsonPathsMapping,
  );

  const dedupedReferenceJsonPathsArray: ReferenceJsonPaths[] = dedupeReferenceJsonPaths(matchedReferenceJsonPathsArray);

  // Sort result by identityJsonPath
  return dedupedReferenceJsonPathsArray.sort((a, b) => a.identityJsonPath.localeCompare(b.identityJsonPath));
}

/**
 * Takes a MetaEdPropertyPath that is equivalent to a MetaEdPropertyFullname
 */
function buildDocumentReferencePaths(
  startOfPropertyPath: string,
  referenceProperty: ReferentialProperty,
  allJsonPathsMapping: JsonPathsMapping,
): DocumentReferencePaths {
  const { referencedEntity } = referenceProperty;
  const referencedEntityApiSchemaData = referencedEntity.data.edfiApiSchema as EntityApiSchemaData;

  return {
    isReference: true,
    projectName: referenceProperty.namespace.projectName,
    isDescriptor: false,
    resourceName: referencedEntityApiSchemaData.resourceName,
    referenceJsonPaths: buildReferenceJsonPaths(
      startOfPropertyPath,
      referenceProperty.referencedEntity,
      allJsonPathsMapping,
    ),
  };
}

function buildDescriptorPath(
  jsonPathPropertyPairs: JsonPathPropertyPair[],
  property: EntityProperty,
): DescriptorReferencePath {
  invariant(jsonPathPropertyPairs.length === 1, 'Descriptor should only have one path');

  const { referencedEntity } = property as ReferentialProperty;
  const referencedEntityApiSchemaData = referencedEntity.data.edfiApiSchema as EntityApiSchemaData;

  return {
    isReference: true,
    isDescriptor: true,
    projectName: property.namespace.projectName,
    resourceName: referencedEntityApiSchemaData.resourceName,
    path: jsonPathPropertyPairs[0].jsonPath,
    type: getPathType(jsonPathPropertyPairs[0].sourceProperty.type),
  };
}

function buildSchoolYearEnumerationPath(jsonPathPropertyPairs: JsonPathPropertyPair[]): DocumentReferencePaths {
  invariant(jsonPathPropertyPairs.length === 1, 'SchoolYear should only have one path');

  return {
    isReference: true,
    isDescriptor: false,
    projectName: 'Ed-Fi',
    resourceName: 'SchoolYearType',
    referenceJsonPaths: [
      {
        referenceJsonPath: jsonPathPropertyPairs[0].jsonPath,
        identityJsonPath: '$.schoolYear' as JsonPath,
        type: getPathType(jsonPathPropertyPairs[0].sourceProperty.type),
      },
    ],
  };
}

function buildScalarPath(jsonPathPropertyPairs: JsonPathPropertyPair[]): ScalarPath {
  invariant(jsonPathPropertyPairs.length === 1, 'Scalar should only have one path');
  return {
    path: jsonPathPropertyPairs[0].jsonPath,
    isReference: false,
    type: getPathType(jsonPathPropertyPairs[0].sourceProperty.type),
  };
}

/**
 * Creates a mapping of PropertyPaths to JsonPaths, filtering out PropertyPaths beyond a depth of one
 */
function documentPathsMappingFor(entity: TopLevelEntity): DocumentPathsMapping {
  const result: DocumentPathsMapping = {};

  const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  const { allJsonPathsMapping } = edfiApiSchemaData;

  Object.entries(allJsonPathsMapping).forEach(([propertyPath, jsonPathsInfo]) => {
    // Only want paths at the top level
    if (!jsonPathsInfo.isTopLevel) return;

    const { jsonPathPropertyPairs } = jsonPathsInfo;
    const property: EntityProperty = jsonPathsInfo.terminalProperty;

    if (property.type === 'association' || property.type === 'domainEntity') {
      const referenceProperty: ReferentialProperty = property as ReferentialProperty;
      result[propertyPath] = buildDocumentReferencePaths(propertyPath, referenceProperty, allJsonPathsMapping);
    } else if (property.type === 'descriptor') {
      result[propertyPath] = buildDescriptorPath(jsonPathPropertyPairs, property);
    } else if (property.type === 'schoolYearEnumeration') {
      result[propertyPath] = buildSchoolYearEnumerationPath(jsonPathPropertyPairs);
    } else {
      result[propertyPath] = buildScalarPath(jsonPathPropertyPairs);
    }
  });

  return result;
}

/**
 * Derives a documentPathsMapping for each entity by taking the allJsonPathsMapping and omitting property paths
 * that follow references.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
      edfiApiSchemaData.documentPathsMapping = documentPathsMappingFor(entity as TopLevelEntity);
    },
  );

  // Descriptors have no document paths
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((entity) => {
    const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    edfiApiSchemaData.documentPathsMapping = {};
  });

  return {
    enhancerName: 'DocumentPathsMappingEnhancer',
    success: true,
  };
}
