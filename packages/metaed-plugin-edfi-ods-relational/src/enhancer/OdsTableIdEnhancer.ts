import { getAllTopLevelEntitiesForNamespaces, normalizeEnumerationSuffix } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, ModelBase } from '@edfi/metaed-core';
import { DescriptorEdfiOds } from '../model/Descriptor';

const enhancerName = 'OdsTableIdEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllTopLevelEntitiesForNamespaces(Array.from(metaEd.namespace.values())).forEach((entity: ModelBase) => {
    if (entity.type === 'descriptor') {
      entity.data.edfiOdsRelational.odsTableId = (entity.data.edfiOdsRelational as DescriptorEdfiOds).odsDescriptorName;
    } else if (entity.type === 'enumeration' || entity.type === 'schoolYearEnumeration') {
      entity.data.edfiOdsRelational.odsTableId = normalizeEnumerationSuffix(entity.metaEdName);
    } else {
      entity.data.edfiOdsRelational.odsTableId = entity.metaEdName;
    }
  });

  return {
    enhancerName,
    success: true,
  };
}
