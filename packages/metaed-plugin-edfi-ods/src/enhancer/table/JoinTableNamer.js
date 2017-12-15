// @flow
import type { EntityProperty } from 'metaed-core';
import { appendOverlapping } from '../../shared/Utility';

export type JoinTableNamer = string;

function getWithContext(property: EntityProperty): string {
  return property.withContext !== property.metaEdName
    ? property.withContext
    : '';
}

export function baseNameCollapsingJoinTableNamer(
  property: EntityProperty,
  parentEntityName: string,
  parentContextName: string,
): string {
  const contextName: string = getWithContext(property);

  if (property.metaEdName.startsWith(parentEntityName)) {
    return appendOverlapping(appendOverlapping(parentContextName, contextName), property.metaEdName);
  }
  return appendOverlapping(appendOverlapping(appendOverlapping(parentEntityName, parentContextName), contextName), property.metaEdName);
}

export function joinTableNamer(property: EntityProperty, parentEntityName: string, parentContextName: string): string {
  const contextName: string = getWithContext(property);
  return parentEntityName + parentContextName + contextName + property.metaEdName;
}
