import invariant from 'ts-invariant';
import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  EntityProperty,
  ReferentialProperty,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { MetaEdPropertyPath } from '../model/api-schema/MetaEdPropertyPath';
import { MetaEdPropertyFullName } from '../model/api-schema/MetaEdPropertyFullName';
import { JsonPath } from '../model/api-schema/JsonPath';
import { DocumentObjectKey } from '../model/api-schema/DocumentObjectKey';
import { DocumentPathsMapping } from '../model/api-schema/DocumentPathsMapping';
import { DocumentPaths } from '../model/api-schema/DocumentPaths';

function findProperty(entity: TopLevelEntity, propertyFullName: MetaEdPropertyFullName): EntityProperty {
  // Need to match up with the property
  const property: EntityProperty | undefined = entity.properties.find((p) => p.fullPropertyName === propertyFullName);
  if (property != null) return property;

  // If not found, check superclass
  const superclassProperty: EntityProperty | undefined = entity.baseEntity?.properties.find(
    (p) => p.fullPropertyName === propertyFullName,
  );
  invariant(superclassProperty != null, `Property ${propertyFullName} must exist`);
  return superclassProperty;
}

function leafOfPath(jsonPath: JsonPath): DocumentObjectKey {
  const keys: DocumentObjectKey[] = jsonPath.split('.') as DocumentObjectKey[];
  return keys[keys.length - 1];
}

/**
 * Takes a MetaEdPropertyPath that is equivalent to a MetaEdPropertyFullname
 */
function buildDocumentPaths(entity: TopLevelEntity, propertyPath: MetaEdPropertyPath, jsonPaths: JsonPath[]): DocumentPaths {
  const propertyFullName: MetaEdPropertyFullName = propertyPath as unknown as MetaEdPropertyFullName;
  const property: EntityProperty = findProperty(entity, propertyFullName);

  // Gather up the paths and pathOrder
  const listOfKeys: DocumentObjectKey[] = [];
  const paths: { [key: DocumentObjectKey]: JsonPath } = {};
  jsonPaths.forEach((jsonPath: JsonPath) => {
    listOfKeys.push(leafOfPath(jsonPath));
    paths[leafOfPath(jsonPath)] = jsonPath;
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

  Object.keys(allJsonPathsMapping)
    // Only want paths at the top level, which are equivalent to a MetaEdPropertyFullName
    .filter((propertyPath) => !propertyPath.includes('.'))
    .forEach((propertyPath: MetaEdPropertyPath) => {
      result[propertyPath] = buildDocumentPaths(entity, propertyPath, allJsonPathsMapping[propertyPath]);
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

  return {
    enhancerName: 'DocumentPathsMappingEnhancer',
    success: true,
  };
}
