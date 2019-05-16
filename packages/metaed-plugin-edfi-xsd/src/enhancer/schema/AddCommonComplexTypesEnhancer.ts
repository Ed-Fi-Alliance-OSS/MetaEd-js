import { MetaEdEnvironment, EnhancerResult, Common } from 'metaed-core';
import { getAllEntitiesOfType } from 'metaed-core';
import { typeGroupCommon, createDefaultComplexType } from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddCommonComplexTypesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'common') as Common[]).forEach((common: Common) => {
    common.data.edfiXsd.xsdComplexTypes = createDefaultComplexType(common, typeGroupCommon);
  });

  return {
    enhancerName,
    success: true,
  };
}
