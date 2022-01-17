import { MetaEdEnvironment, EnhancerResult, CommonSubclass } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { typeGroupCommon, createDefaultComplexType } from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddCommonSubclassComplexTypesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'commonSubclass') as CommonSubclass[]).forEach((commonSubclass: CommonSubclass) => {
    commonSubclass.data.edfiXsd.xsdComplexTypes = createDefaultComplexType(commonSubclass, typeGroupCommon);
  });

  return {
    enhancerName,
    success: true,
  };
}
