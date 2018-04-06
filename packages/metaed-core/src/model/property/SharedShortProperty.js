// @flow
import type { ShortProperty } from './ShortProperty';
import { newShortProperty } from './ShortProperty';
import type { EntityProperty } from './EntityProperty';

export type SharedShortProperty = ShortProperty;

export function newSharedShortProperty(): SharedShortProperty {
  return {
    ...newShortProperty(),
    type: 'sharedShort',
    typeHumanizedName: 'Shared Short Property',
  };
}

export const asSharedShortProperty = (x: EntityProperty): SharedShortProperty => ((x: any): SharedShortProperty);
