// @flow
import { newStringProperty } from './StringProperty';
import type { StringProperty } from './StringProperty';
import type { EntityProperty } from './EntityProperty';

export type SharedStringProperty = StringProperty;

export function newSharedStringProperty(): SharedStringProperty {
  return {
    ...newStringProperty(),
    type: 'sharedString',
    typeHumanizedName: 'Shared String Property',
  };
}

export const asSharedStringProperty = (x: EntityProperty): SharedStringProperty => ((x: any): SharedStringProperty);
