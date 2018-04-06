// @flow
import type { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import type { EntityProperty } from './EntityProperty';

export type CurrencyPropertySourceMap = SimplePropertySourceMap;

export function newCurrencyPropertySourceMap(): CurrencyPropertySourceMap {
  return newSimplePropertySourceMap();
}

export type CurrencyProperty = {
  sourceMap: CurrencyPropertySourceMap,
  ...$Exact<SimpleProperty>,
};

export function newCurrencyProperty(): CurrencyProperty {
  return {
    ...newSimpleProperty(),
    type: 'currency',
    typeHumanizedName: 'Currency Property',
    sourceMap: newCurrencyPropertySourceMap(),
  };
}

export const asCurrencyProperty = (x: EntityProperty): CurrencyProperty => ((x: any): CurrencyProperty);
