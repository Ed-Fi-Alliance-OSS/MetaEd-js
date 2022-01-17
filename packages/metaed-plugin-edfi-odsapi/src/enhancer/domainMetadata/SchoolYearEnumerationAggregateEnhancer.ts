import { getAllEntitiesOfType, asTopLevelEntity } from '@edfi/metaed-core';
import { MetaEdEnvironment, ModelBase, EnhancerResult } from '@edfi/metaed-core';
import { enhanceSingleEntity } from './AggregateEnhancerBase';

const enhancerName = 'SchoolYearEnumerationAggregateEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'schoolYearEnumeration').forEach((modelBase: ModelBase) => {
    enhanceSingleEntity(metaEd, asTopLevelEntity(modelBase), metaEd.namespace);
  });

  return {
    enhancerName,
    success: true,
  };
}
