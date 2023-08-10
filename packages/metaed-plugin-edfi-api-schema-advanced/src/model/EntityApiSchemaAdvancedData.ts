import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType, ModelBase } from '@edfi/metaed-core';
import type { EqualityConstraint } from './EqualityConstraint';

export type EntityApiSchemaAdvancedData = {
  /**
   * A list of EqualityConstraints to be applied to an Ed-Fi API document. An EqualityConstraint
   * is a source/target JsonPath pair.
   */
  equalityConstraints: EqualityConstraint[];
};

/**
 * Initialize entity with ApiSchema data placeholder.
 */
export function addEntityApiSchemaAdvancedDataTo(entity: ModelBase) {
  if (entity.data.edfiApiSchema == null) entity.data.edfiApiSchemaAdvanced = {};

  Object.assign(entity.data.edfiApiSchemaAdvanced, {
    equalityConstraints: [],
  });
}

/**
 * Initialize all properties with ApiSchemaAdvanced data placeholder.
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
    if (entity.data.edfiApiSchemaAdvanced == null) entity.data.edfiApiSchemaAdvanced = {};
    addEntityApiSchemaAdvancedDataTo(entity);
  });

  return {
    enhancerName: 'EntityApiSchemaDataSetupEnhancer',
    success: true,
  };
}
