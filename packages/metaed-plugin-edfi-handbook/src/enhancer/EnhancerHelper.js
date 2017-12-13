// @flow
import type { MetaEdEnvironment, EntityProperty, ReferentialProperty, ModelBase } from 'metaed-core';
import { asReferentialProperty } from 'metaed-core';

export function getAllProperties(metaEd: MetaEdEnvironment): Array<EntityProperty> {
  const results: Array<EntityProperty> = [];
  metaEd.entity.association.forEach(item => results.push(...item.properties));
  metaEd.entity.associationExtension.forEach(item => results.push(...item.properties));
  metaEd.entity.associationSubclass.forEach(item => results.push(...item.properties));
  metaEd.entity.choice.forEach(item => results.push(...item.properties));
  metaEd.entity.common.forEach(item => results.push(...item.properties));
  metaEd.entity.commonExtension.forEach(item => results.push(...item.properties));
  metaEd.entity.descriptor.forEach(item => results.push(...item.properties));
  metaEd.entity.domain.forEach(item => results.push(...item.properties));
  metaEd.entity.domainEntity.forEach(item => results.push(...item.properties));
  metaEd.entity.domainEntityExtension.forEach(item => results.push(...item.properties));
  metaEd.entity.domainEntitySubclass.forEach(item => results.push(...item.properties));
  metaEd.entity.enumeration.forEach(item => results.push(...item.properties));
  metaEd.entity.mapTypeEnumeration.forEach(item => results.push(...item.properties));
  return results;
}

export function getAllReferentialProperties(metaEd: MetaEdEnvironment): Array<ReferentialProperty> {
  const allProperties: Array<EntityProperty> = getAllProperties(metaEd);
  return ((allProperties.filter((x) => asReferentialProperty(x).referencedEntity): any): Array<ReferentialProperty>);
}

export function getAllEntities(metaEd: MetaEdEnvironment): Array<ModelBase> {
  const results: Array<ModelBase> = [];
  if (metaEd) {
    results.push(...metaEd.entity.association.values());
    results.push(...metaEd.entity.associationExtension.values());
    results.push(...metaEd.entity.associationSubclass.values());
    results.push(...metaEd.entity.choice.values());
    results.push(...metaEd.entity.common.values());
    results.push(...metaEd.entity.commonExtension.values());
    results.push(...metaEd.entity.decimalType.values());
    results.push(...metaEd.entity.descriptor.values());
    results.push(...metaEd.entity.domain.values());
    results.push(...metaEd.entity.domainEntity.values());
    results.push(...metaEd.entity.domainEntityExtension.values());
    results.push(...metaEd.entity.domainEntitySubclass.values());
    results.push(...metaEd.entity.enumeration.values());
    results.push(...metaEd.entity.integerType.values());
    results.push(...metaEd.entity.interchange.values());
    results.push(...metaEd.entity.interchangeExtension.values());
    results.push(...metaEd.entity.mapTypeEnumeration.values());
    results.push(...metaEd.entity.schoolYearEnumeration.values());
    results.push(...metaEd.entity.sharedDecimal.values());
    results.push(...metaEd.entity.sharedInteger.values());
    results.push(...metaEd.entity.sharedString.values());
    results.push(...metaEd.entity.stringType.values());
  }
  return results;
}
