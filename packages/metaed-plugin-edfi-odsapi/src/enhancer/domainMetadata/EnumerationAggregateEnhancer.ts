import { getAllEntitiesOfType, asTopLevelEntity } from 'metaed-core';
import { MetaEdEnvironment, ModelBase, EnhancerResult } from 'metaed-core';
import { enhanceSingleEntity } from './AggregateEnhancerBase';

const enhancerName = 'EnumerationAggregateEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'enumeration').forEach((modelBase: ModelBase) => {
    enhanceSingleEntity(asTopLevelEntity(modelBase), metaEd.namespace);
  });

  return {
    enhancerName,
    success: true,
  };
}
