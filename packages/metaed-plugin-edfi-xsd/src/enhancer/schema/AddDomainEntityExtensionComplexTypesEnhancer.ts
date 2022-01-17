import { MetaEdEnvironment, EnhancerResult, DomainEntityExtension } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { TopLevelEntityEdfiXsd } from '../../model/TopLevelEntity';
import {
  typeGroupDomainEntity,
  createDefaultComplexType,
  createCoreRestrictionForExtensionParent,
  restrictionName,
} from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddDomainEntityExtensionComplexTypesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'domainEntityExtension') as DomainEntityExtension[]).forEach(
    (domainEntityExtension: DomainEntityExtension) => {
      if (domainEntityExtension.data.edfiXsd.xsdHasExtensionOverrideProperties()) {
        const domainEntityExtensionEdfiXsd: TopLevelEntityEdfiXsd = domainEntityExtension.data.edfiXsd;
        domainEntityExtensionEdfiXsd.xsdComplexTypes = [createCoreRestrictionForExtensionParent(domainEntityExtension)];
        domainEntityExtensionEdfiXsd.xsdComplexTypes.push(
          ...createDefaultComplexType(domainEntityExtension, typeGroupDomainEntity, restrictionName(domainEntityExtension)),
        );
      } else {
        if (domainEntityExtension.baseEntity == null) return;
        domainEntityExtension.data.edfiXsd.xsdComplexTypes = createDefaultComplexType(
          domainEntityExtension,
          typeGroupDomainEntity,
          domainEntityExtension.baseEntity.data.edfiXsd.xsdMetaEdNameWithExtension(),
        );
      }
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
