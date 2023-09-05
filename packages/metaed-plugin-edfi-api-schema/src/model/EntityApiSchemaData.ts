import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType, ModelBase } from '@edfi/metaed-core';
import { ApiEntityMapping, NoApiEntityMapping } from './ApiEntityMapping';
import type { CollectedProperty } from './CollectedProperty';
import { SchemaRoot, NoSchemaRoot } from './JsonSchema';
import type { EqualityConstraint } from './EqualityConstraint';
import type { JsonPathsMapping } from './JsonPathsMapping';
import { ResourceName } from './api-schema/ResourceName';
import { EndpointName } from './api-schema/EndpointName';
import { PropertyFullName } from './api-schema/PropertyFullName';

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
  resourceName: ResourceName;

  /**
   * The property fullnames for every identity property on this entity, in sorted order
   */
  identityFullnames: PropertyFullName[];

  /**
   * A mapping of MetaEd property full names to corresponding JsonPaths to data elements
   * in the API document. This is a subset of allJsonPathsMapping, omitting property paths
   * of referenced entities. Like allJsonPathsMapping, a scalar property will have a single
   * JsonPath, while reference properties may have multiple JsonPaths.
   *
   * The JsonPaths array is always is sorted order.
   */
  documentPathsMapping: JsonPathsMapping;
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
    resourceName: '' as ResourceName,
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
