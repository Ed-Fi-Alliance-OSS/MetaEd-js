import { MetaEdEnvironment, EnhancerResult, CommonExtension } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { typeGroupCommon, createDefaultComplexType } from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddCommonExtensionComplexTypesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'commonExtension') as CommonExtension[]).forEach((commonExtension: CommonExtension) => {
    if (commonExtension.baseEntity == null) return;
    commonExtension.data.edfiXsd.xsdComplexTypes = createDefaultComplexType(
      commonExtension,
      typeGroupCommon,
      commonExtension.baseEntity.data.edfiXsd.xsdMetaEdNameWithExtension(),
    );
  });

  return {
    enhancerName,
    success: true,
  };
}
