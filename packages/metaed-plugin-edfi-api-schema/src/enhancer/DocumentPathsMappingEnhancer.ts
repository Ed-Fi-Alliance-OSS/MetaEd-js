import invariant from 'ts-invariant';
import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  EntityProperty,
  ReferentialProperty,
  scalarPropertyTypes,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { DocumentPathsMapping } from '../model/api-schema/DocumentPathsMapping';
import { DescriptorReferencePath, DocumentReferencePaths, ScalarPath } from '../model/api-schema/DocumentPaths';
import { ReferenceJsonPaths } from '../model/api-schema/ReferenceJsonPaths';
import { JsonPathsInfo, JsonPathsMapping } from '../model/JsonPathsMapping';

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

function matchupJsonPaths(
  fromReferencingEntity: JsonPathsMapping,
  fromReferencedEntity: JsonPathsMapping,
): ReferenceJsonPaths[] {
  const result: ReferenceJsonPaths[] = [];

  Object.entries(fromReferencingEntity).forEach(([referencingPropertyPath, referencingJsonPathsInfo]) => {
    invariant(fromReferencedEntity[referencingPropertyPath] != null);
    invariant(referencingJsonPathsInfo.jsonPathPropertyPairs.length === 1);

    const matchingJsonPathsInfo: JsonPathsInfo = fromReferencedEntity[referencingPropertyPath];

    // Only scalar paths are relevant
    if (
      matchingJsonPathsInfo.jsonPathPropertyPairs.length === 1 &&
      scalarPropertyTypes.includes(matchingJsonPathsInfo.jsonPathPropertyPairs[0].sourceProperty.type)
    ) {
      result.push({
        referenceJsonPath: referencingJsonPathsInfo.jsonPathPropertyPairs[0].jsonPath,
        identityJsonPath: matchingJsonPathsInfo.jsonPathPropertyPairs[0].jsonPath,
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

function buildDescriptorPath(jsonPaths: JsonPath[], property: EntityProperty): DescriptorReferencePath {
  invariant(jsonPaths.length === 1, 'Descriptor should only have one path');

  const { referencedEntity } = property as ReferentialProperty;
  const referencedEntityApiSchemaData = referencedEntity.data.edfiApiSchema as EntityApiSchemaData;

  return {
    isReference: true,
    isDescriptor: true,
    projectName: property.namespace.projectName,
    resourceName: referencedEntityApiSchemaData.resourceName,
    path: jsonPaths[0],
  };
}

function buildSchoolYearEnumerationPath(jsonPaths: JsonPath[]): DocumentReferencePaths {
  invariant(jsonPaths.length === 1, 'SchoolYear should only have one path');

  return {
    isReference: true,
    isDescriptor: false,
    projectName: 'Ed-Fi',
    resourceName: 'SchoolYearType',
    referenceJsonPaths: [
      {
        referenceJsonPath: jsonPaths[0],
        identityJsonPath: '$.schoolYear' as JsonPath,
      },
    ],
  };
}

function buildScalarPath(jsonPaths: JsonPath[]): ScalarPath {
  invariant(jsonPaths.length === 1, 'Scalar should only have one path');
  return {
    path: jsonPaths[0],
    isReference: false,
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

    const jsonPaths: JsonPath[] = jsonPathsInfo.jsonPathPropertyPairs.map((jppp) => jppp.jsonPath);
    const property: EntityProperty = jsonPathsInfo.terminalProperty;

    if (property.type === 'association' || property.type === 'domainEntity') {
      const referenceProperty: ReferentialProperty = property as ReferentialProperty;
      result[propertyPath] = buildDocumentReferencePaths(propertyPath, referenceProperty, allJsonPathsMapping);
    } else if (property.type === 'descriptor') {
      result[propertyPath] = buildDescriptorPath(jsonPaths, property);
    } else if (property.type === 'schoolYearEnumeration') {
      result[propertyPath] = buildSchoolYearEnumerationPath(jsonPaths);
    } else {
      result[propertyPath] = buildScalarPath(jsonPaths);
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
