import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  EntityProperty,
  ReferentialProperty,
  NoTopLevelEntity,
  asDomainEntity,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { JsonPath } from '../model/api-schema/JsonPath';
import { DocumentObjectKey } from '../model/api-schema/DocumentObjectKey';
import { DocumentPathsMapping } from '../model/api-schema/DocumentPathsMapping';
import { DocumentPaths } from '../model/api-schema/DocumentPaths';
import { prependPrefixWithCollapse } from '../Utility';

function leafOfPath(jsonPath: JsonPath): DocumentObjectKey {
  const keys: DocumentObjectKey[] = jsonPath.split('.') as DocumentObjectKey[];
  return keys[keys.length - 1];
}

/**
 * Takes a MetaEdPropertyPath that is equivalent to a MetaEdPropertyFullname
 */
function buildDocumentPaths(jsonPaths: JsonPath[], property: EntityProperty): DocumentPaths {
  // Gather up the paths and pathOrder
  const listOfKeys: DocumentObjectKey[] = [];
  const paths: { [key: DocumentObjectKey]: JsonPath } = {};
  jsonPaths.forEach((jsonPath: JsonPath) => {
    const keyName =
      property.parentEntity !== NoTopLevelEntity && asDomainEntity(property.parentEntity).isAbstract
        ? prependPrefixWithCollapse(leafOfPath(jsonPath), property.roleName)
        : leafOfPath(jsonPath);
    listOfKeys.push(keyName as DocumentObjectKey);
    paths[keyName] = jsonPath;
  });

  if (property.type === 'association' || property.type === 'domainEntity' || property.type === 'descriptor') {
    const { referencedEntity } = property as ReferentialProperty;
    const referencedEntityApiSchemaData = referencedEntity.data.edfiApiSchema as EntityApiSchemaData;
    return {
      paths,
      pathOrder: listOfKeys.sort(),
      isReference: true,
      projectName: property.namespace.projectName,
      isDescriptor: property.type === 'descriptor',
      resourceName: referencedEntityApiSchemaData.resourceName,
    };
  }

  return {
    paths,
    pathOrder: listOfKeys.sort(),
    isReference: false,
  };
}

/**
 * Copies a mapping of PropertyPaths to JsonPaths, filtering out PropertyPaths beyond a depth of one
 */
function documentPathsMappingFor(entity: TopLevelEntity): DocumentPathsMapping {
  const result: DocumentPathsMapping = {};

  const edfiApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  const { allJsonPathsMapping } = edfiApiSchemaData;

  Object.entries(allJsonPathsMapping).forEach(([propertyPath, jsonPathsInfo]) => {
    // Only want paths at the top level
    if (jsonPathsInfo.isTopLevel) {
      result[propertyPath] = buildDocumentPaths(
        jsonPathsInfo.jsonPathPropertyPairs.map((jppp) => jppp.jsonPath),
        jsonPathsInfo.terminalProperty,
      );
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
