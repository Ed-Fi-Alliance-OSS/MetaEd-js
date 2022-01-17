import { MetaEdEnvironment, EnhancerResult, DomainEntity, EntityProperty } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';

export interface DomainEntityEdfiXsd {
  xsdProperties: () => EntityProperty[];
}

const enhancerName = 'DomainEntitySetupEnhancer';

// note this is an override of xsdProperties in TopLevelEntity
function xsdProperties(domainEntity: DomainEntity): () => EntityProperty[] {
  return () =>
    domainEntity.isAbstract ? domainEntity.properties.filter((p) => !p.isPartOfIdentity) : domainEntity.properties;
}

export function addDomainEntityEdfiXsdTo(domainEntity: DomainEntity) {
  if (domainEntity.data.edfiXsd == null) domainEntity.data.edfiXsd = {};

  Object.assign(domainEntity.data.edfiXsd, {
    xsdProperties: xsdProperties(domainEntity),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'domainEntity') as DomainEntity[]).forEach((domainEntity: DomainEntity) => {
    addDomainEntityEdfiXsdTo(domainEntity);
  });

  return {
    enhancerName,
    success: true,
  };
}
