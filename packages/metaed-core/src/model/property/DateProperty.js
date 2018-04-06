// @flow
import type { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import type { EntityProperty } from './EntityProperty';

export type DatePropertySourceMap = SimplePropertySourceMap;

export function newDatePropertySourceMap(): DatePropertySourceMap {
  return newSimplePropertySourceMap();
}

export type DateProperty = {
  sourceMap: DatePropertySourceMap,
  ...$Exact<SimpleProperty>,
};

export function newDateProperty(): DateProperty {
  return {
    ...newSimpleProperty(),
    type: 'date',
    typeHumanizedName: 'Date Property',
    sourceMap: newDatePropertySourceMap(),
  };
}

export const asDateProperty = (x: EntityProperty): DateProperty => ((x: any): DateProperty);
