import { MetaEdEnvironment, EnhancerResult, DomainEntity } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import {
  typeGroupDomainEntity,
  baseTypeTopLevelEntity,
  createDefaultComplexType,
  createIdentityType,
  createReferenceType,
} from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddDomainEntityComplexTypesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'domainEntity') as DomainEntity[]).forEach((domainEntity: DomainEntity) => {
    domainEntity.data.edfiXsd.xsdComplexTypes = createDefaultComplexType(
      domainEntity,
      typeGroupDomainEntity,
      baseTypeTopLevelEntity,
      domainEntity.isAbstract,
    );
    domainEntity.data.edfiXsd.xsdIdentityType = createIdentityType(domainEntity);
    domainEntity.data.edfiXsd.xsdReferenceType = createReferenceType(domainEntity);
  });

  return {
    enhancerName,
    success: true,
  };
}
