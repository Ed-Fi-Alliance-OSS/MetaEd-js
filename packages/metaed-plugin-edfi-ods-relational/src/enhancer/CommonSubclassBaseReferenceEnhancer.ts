import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, CommonSubclass } from '@edfi/metaed-core';

const enhancerName = 'CommonSubclassBaseReferenceEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'commonSubclass').forEach((entity) => {
    const commonSubclass = entity as CommonSubclass;
    if (commonSubclass.baseEntity == null) return;
    commonSubclass.data.edfiOdsRelational.odsProperties.push(
      ...commonSubclass.baseEntity.data.edfiOdsRelational.odsProperties,
    );
    commonSubclass.data.edfiOdsRelational.odsIdentityProperties.push(
      ...commonSubclass.baseEntity.data.edfiOdsRelational.odsIdentityProperties,
    );
  });

  return {
    enhancerName,
    success: true,
  };
}
