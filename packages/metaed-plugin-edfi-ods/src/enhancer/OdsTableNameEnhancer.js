// @flow
import { allTopLevelEntityModelTypes, getEntitiesOfType, normalizeEnumerationSuffix } from 'metaed-core';
import type { EnhancerResult, MetaEdEnvironment, ModelBase } from 'metaed-core';
import type { DescriptorEdfiOds } from '../model/Descriptor';

const enhancerName: string = 'OdsTableNameEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(metaEd.entity, ...allTopLevelEntityModelTypes).forEach((entity: ModelBase) => {
    if (entity.type === 'descriptor') {
      entity.data.edfiOds.ods_TableName = ((entity.data.edfiOds: any): DescriptorEdfiOds).ods_DescriptorName;
    } else if (entity.type === 'enumeration' || entity.type === 'schoolYearEnumeration') {
      entity.data.edfiOds.ods_TableName = normalizeEnumerationSuffix(entity.metaEdName);
    } else {
      entity.data.edfiOds.ods_TableName = entity.metaEdName;
    }
  });

  return {
    enhancerName,
    success: true,
  };
}
