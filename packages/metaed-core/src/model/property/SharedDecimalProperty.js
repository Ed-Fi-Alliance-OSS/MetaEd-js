// @flow
import type { DecimalProperty } from './DecimalProperty';
import { newDecimalProperty } from './DecimalProperty';
import type { EntityProperty } from './EntityProperty';

export type SharedDecimalProperty = DecimalProperty;

export function newSharedDecimalProperty(): SharedDecimalProperty {
  return {
    ...newDecimalProperty(),
    type: 'sharedDecimal',
    typeHumanizedName: 'Shared Decimal Property',
  };
}

export const asSharedDecimalProperty = (x: EntityProperty): SharedDecimalProperty => ((x: any): SharedDecimalProperty);
