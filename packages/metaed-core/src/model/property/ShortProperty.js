// @flow
import type { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import type { EntityProperty } from './EntityProperty';
import type { SourceMap } from './../SourceMap';
import { NoSourceMap } from './../SourceMap';

export type ShortPropertySourceMap = {
  ...$Exact<SimplePropertySourceMap>,
  minValue: SourceMap,
  maxValue: SourceMap,
};

export function newShortPropertySourceMap(): ShortPropertySourceMap {
  return {
    ...newSimplePropertySourceMap(),
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
  };
}

export type ShortProperty = {
  sourceMap: ShortPropertySourceMap,
  ...$Exact<SimpleProperty>,
  minValue: ?string,
  maxValue: ?string,
};

export function newShortProperty(): ShortProperty {
  return {
    ...newSimpleProperty(),
    type: 'short',
    typeHumanizedName: 'Short Property',
    minValue: null,
    maxValue: null,
    sourceMap: newShortPropertySourceMap(),
  };
}

export const asShortProperty = (x: EntityProperty): ShortProperty => ((x: any): ShortProperty);
