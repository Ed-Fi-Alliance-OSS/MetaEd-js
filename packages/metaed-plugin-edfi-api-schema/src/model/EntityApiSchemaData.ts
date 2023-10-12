import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType, ModelBase } from '@edfi/metaed-core';
import { ApiEntityMapping, NoApiEntityMapping } from './ApiEntityMapping';
import type { CollectedProperty } from './CollectedProperty';
import { SchemaRoot, NoSchemaRoot } from './JsonSchema';
import type { EqualityConstraint } from './EqualityConstraint';
import type { JsonPathsMapping } from './JsonPathsMapping';
import { MetaEdResourceName } from './api-schema/MetaEdResourceName';
import { EndpointName } from './api-schema/EndpointName';
import { MetaEdPropertyFullName } from './api-schema/MetaEdPropertyFullName';
import { DocumentPathsMapping } from './api-schema/DocumentPathsMapping';
import { DocumentObjectKey } from './api-schema/DocumentObjectKey';

export type EntityApiSchemaData = {
  /**
   * API shape metadata for this entity.
   */
  apiMapping: ApiEntityMapping;
  /**
   * The API document JSON schema that corresponds to this MetaEd entity.
   */
  jsonSchemaForInsert: SchemaRoot;

  /**
   * The API document JSON schema that corresponds to this MetaEd entity on update.
   */
  jsonSchemaForUpdate: SchemaRoot;

  /**
   * The API document JSON schema that corresponds to valid query strings as objects for this MetaEd entity.
   */
  jsonSchemaForQuery: SchemaRoot;

  /**
   * Properties that belong under this entity in the API body. Excludes Choice and Inline Common properties
   * as they have no expression in API body. Instead, the properties on the Choice and Inline Common referenced
   * entities are "pulled-up" to this entity.
   */
  collectedApiProperties: CollectedProperty[];

  /**
   * All the properties that belong under this entity, including superclass properties if the entity is a subclass.
   */
  allProperties: CollectedProperty[];

  /**
   * A mapping of dot-separated MetaEd property paths to corresponding JsonPaths to data elements
   * in the API document.
   *
   * Includes both paths ending in references and paths ending in scalars. PropertyPaths ending in
   * scalars have a single JsonPath, while PropertyPaths ending in references may have multiple
   * JsonPaths, as document references are often composed of multiple elements.
   *
   * The JsonPaths array is always is sorted order.
   */
  allJsonPathsMapping: JsonPathsMapping;

  /**
   * A list of EqualityConstraints to be applied to an Ed-Fi API document. An EqualityConstraint
   * is a source/target JsonPath pair.
   */
  equalityConstraints: EqualityConstraint[];

  /**
   * The API resource endpoint name for this entity, if it is a TopLevelEntity.
   */
  endpointName: EndpointName;

  /**
   * The API resource name for this entity, if it is a TopLevelEntity.
   */
  resourceName: MetaEdResourceName;

  /**
   * The property fullnames for every identity property on this entity, in sorted order
   */
  identityFullnames: MetaEdPropertyFullName[];

  /**
   * A list of the DocumentObjectKey paths that are part of the identity for this resource, in sorted order.
   * Duplicates due to key unification are removed.
   */
  identityPathOrder: DocumentObjectKey[];

  /**
   * A mapping of PropertyFullNames to DocumentPaths, which are JsonPaths in an API document for a specific MetaEd
   * property.
   */
  documentPathsMapping: DocumentPathsMapping;
};

/**
 * Initialize entity with ApiSchema data placeholder.
 */
export function addEntityApiSchemaDataTo(entity: ModelBase) {
  if (entity.data.edfiApiSchema == null) entity.data.edfiApiSchema = {};

  Object.assign(entity.data.edfiApiSchema, {
    apiMapping: NoApiEntityMapping,
    jsonSchemaForInsert: NoSchemaRoot,
    collectedApiProperties: [],
    allJsonPathsMapping: {},
    equalityConstraints: [],
    endpointName: '' as EndpointName,
    resourceName: '' as MetaEdResourceName,
    identityFullnames: [],
  });
}

/**
 * Initialize all properties with ApiSchema data placeholder.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'descriptor',
    'common',
    'choice',
    'schoolYearEnumeration',
  ).forEach((entity) => {
    if (entity.data.edfiApiSchema == null) entity.data.edfiApiSchema = {};
    addEntityApiSchemaDataTo(entity);
  });

  return {
    enhancerName: 'EntityApiSchemaDataSetupEnhancer',
    success: true,
  };
}
