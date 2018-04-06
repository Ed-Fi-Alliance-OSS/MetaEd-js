// @flow
import type { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import type { EntityProperty } from './EntityProperty';

export type PercentPropertySourceMap = SimplePropertySourceMap;

export function newPercentPropertySourceMap(): PercentPropertySourceMap {
  return newSimplePropertySourceMap();
}

export type PercentProperty = {
  sourceMap: PercentPropertySourceMap,
  ...$Exact<SimpleProperty>,
};

export function newPercentProperty(): PercentProperty {
  return {
    ...newSimpleProperty(),
    type: 'percent',
    typeHumanizedName: 'Percent Property',
    sourceMap: newPercentPropertySourceMap(),
  };
}

export const asPercentProperty = (x: EntityProperty): PercentProperty => ((x: any): PercentProperty);
