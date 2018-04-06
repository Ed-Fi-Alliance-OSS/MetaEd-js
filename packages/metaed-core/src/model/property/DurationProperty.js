// @flow
import type { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import type { EntityProperty } from './EntityProperty';

export type DurationPropertySourceMap = SimplePropertySourceMap;

export function newDurationPropertySourceMap(): DurationPropertySourceMap {
  return newSimplePropertySourceMap();
}

export type DurationProperty = {
  sourceMap: DurationPropertySourceMap,
  ...$Exact<SimpleProperty>,
};

export function newDurationProperty(): DurationProperty {
  return {
    ...newSimpleProperty(),
    type: 'duration',
    typeHumanizedName: 'Duration Property',
    sourceMap: newDurationPropertySourceMap(),
  };
}

export const asDurationProperty = (x: EntityProperty): DurationProperty => ((x: any): DurationProperty);
