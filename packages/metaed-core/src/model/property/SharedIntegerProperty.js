// @flow
import { newIntegerProperty } from './IntegerProperty';
import type { IntegerProperty } from './IntegerProperty';
import type { EntityProperty } from './EntityProperty';

export type SharedIntegerProperty = IntegerProperty;

export function newSharedIntegerProperty(): SharedIntegerProperty {
  return {
    ...newIntegerProperty(),
    type: 'sharedInteger',
    typeHumanizedName: 'Shared Integer Property',
  };
}

export const asSharedIntegerProperty = (x: EntityProperty): SharedIntegerProperty => ((x: any): SharedIntegerProperty);
