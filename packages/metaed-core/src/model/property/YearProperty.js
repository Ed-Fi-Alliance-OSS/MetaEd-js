// @flow
import type { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import type { EntityProperty } from './EntityProperty';

export type YearPropertySourceMap = SimplePropertySourceMap;

export function newYearPropertySourceMap(): YearPropertySourceMap {
  return newSimplePropertySourceMap();
}

export type YearProperty = {
  sourceMap: YearPropertySourceMap,
  ...$Exact<SimpleProperty>,
};

export function newYearProperty(): YearProperty {
  return {
    ...newSimpleProperty(),
    type: 'year',
    typeHumanizedName: 'Year Property',
    sourceMap: newYearPropertySourceMap(),
  };
}

export const asYearProperty = (x: EntityProperty): YearProperty => ((x: any): YearProperty);
