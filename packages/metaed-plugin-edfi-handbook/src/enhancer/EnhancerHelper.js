// @flow
import type { MetaEdEnvironment, EntityProperty, ReferentialProperty } from 'metaed-core';
import { isReferenceProperty, getAllProperties } from 'metaed-core';

export function getAllReferentialProperties(metaEd: MetaEdEnvironment): Array<ReferentialProperty> {
  const allProperties: Array<EntityProperty> = getAllProperties(metaEd.propertyIndex);
  return ((allProperties.filter(isReferenceProperty): any): Array<ReferentialProperty>);
}
