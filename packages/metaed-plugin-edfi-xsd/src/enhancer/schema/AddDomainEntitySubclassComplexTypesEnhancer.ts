import { MetaEdEnvironment, EnhancerResult, DomainEntitySubclass } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import {
  typeGroupDomainEntity,
  createDefaultComplexType,
  createIdentityType,
  createReferenceType,
} from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddDomainEntitySubclassComplexTypesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'domainEntitySubclass') as DomainEntitySubclass[]).forEach(
    (domainEntitySubclass: DomainEntitySubclass) => {
      if (domainEntitySubclass.baseEntity == null) return;
      domainEntitySubclass.data.edfiXsd.xsdComplexTypes = createDefaultComplexType(
        domainEntitySubclass,
        typeGroupDomainEntity,
        domainEntitySubclass.baseEntity.data.edfiXsd.xsdMetaEdNameWithExtension(),
      );
      domainEntitySubclass.data.edfiXsd.xsdIdentityType = createIdentityType(domainEntitySubclass);
      domainEntitySubclass.data.edfiXsd.xsdReferenceType = createReferenceType(domainEntitySubclass);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
