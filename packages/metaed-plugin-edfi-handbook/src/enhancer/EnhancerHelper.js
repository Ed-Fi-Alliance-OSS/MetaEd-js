// @flow
import type { MetaEdEnvironment, EntityProperty } from 'metaed-core';

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
  metaEd.entity.subdomain.forEach(item => results.push(...item.properties));
  return results;
}
