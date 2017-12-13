// @flow
import type { MetaEdEnvironment, EntityProperty, ReferentialProperty } from 'metaed-core';
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
