import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType, ModelBase } from '@edfi/metaed-core';
import { ApiEntityMapping, NoApiEntityMapping } from './ApiEntityMapping';
import type { CollectedProperty } from './CollectedProperty';
import { SchemaRoot, NoSchemaRoot } from './JsonSchema';
import type { EqualityConstraint } from './EqualityConstraint';
import type { JsonPathsMapping } from './JsonPathsMapping';

export type EntityApiSchemaData = {
  /**
   * API shape metadata for this entity.
   */
  apiMapping: ApiEntityMapping;
  /**
   * The API document JSON schema that corresponds to this MetaEd entity.
   */
  jsonSchema: SchemaRoot;

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
  jsonPathsMapping: JsonPathsMapping;

  /**
   * A list of EqualityConstraints to be applied to an Ed-Fi API document. An EqualityConstraint
   * is a source/target JsonPath pair.
   */
  equalityConstraints: EqualityConstraint[];
};

/**
 * Initialize entity with ApiSchema data placeholder.
 */
export function addEntityApiSchemaDataTo(entity: ModelBase) {
  if (entity.data.edfiApiSchema == null) entity.data.edfiApiSchema = {};

  Object.assign(entity.data.edfiApiSchema, {
    apiMapping: NoApiEntityMapping,
    jsonSchema: NoSchemaRoot,
    collectedApiProperties: [],
    jsonPathsMapping: {},
    equalityConstraints: [],
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
