// @flow
import type { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import type { EntityProperty } from './EntityProperty';

export type BooleanPropertySourceMap = SimplePropertySourceMap;

export function newBooleanPropertySourceMap(): BooleanPropertySourceMap {
  return newSimplePropertySourceMap();
}

export type BooleanProperty = {
  sourceMap: BooleanPropertySourceMap,
  ...$Exact<SimpleProperty>,
};

export function newBooleanProperty(): BooleanProperty {
  return {
    ...newSimpleProperty(),
    type: 'boolean',
    typeHumanizedName: 'Boolean Property',
    sourceMap: newBooleanPropertySourceMap(),
  };
}

export const asBooleanProperty = (x: EntityProperty): BooleanProperty => ((x: any): BooleanProperty);
