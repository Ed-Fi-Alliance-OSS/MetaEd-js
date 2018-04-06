// @flow
import type { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import type { EntityProperty } from './EntityProperty';

export type TimePropertySourceMap = SimplePropertySourceMap;

export function newTimePropertySourceMap(): TimePropertySourceMap {
  return newSimplePropertySourceMap();
}

export type TimeProperty = {
  sourceMap: TimePropertySourceMap,
  ...$Exact<SimpleProperty>,
};

export function newTimeProperty(): TimeProperty {
  return {
    ...newSimpleProperty(),
    type: 'time',
    typeHumanizedName: 'Time Property',
    sourceMap: newTimePropertySourceMap(),
  };
}

export const asTimeProperty = (x: EntityProperty): TimeProperty => ((x: any): TimeProperty);
