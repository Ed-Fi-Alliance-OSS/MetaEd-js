// @flow
import type { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import type { EntityProperty } from './EntityProperty';
import type { SourceMap } from './../SourceMap';
import { NoSourceMap } from './../SourceMap';

export type IntegerPropertySourceMap = {
  ...$Exact<SimplePropertySourceMap>,
  minValue: SourceMap,
  maxValue: SourceMap,
};

export function newIntegerPropertySourceMap(): IntegerPropertySourceMap {
  return {
    ...newSimplePropertySourceMap(),
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
  };
}

export type IntegerProperty = {
  sourceMap: IntegerPropertySourceMap,
  ...$Exact<SimpleProperty>,
  minValue: ?string,
  maxValue: ?string,
};

export function newIntegerProperty(): IntegerProperty {
  return {
    ...newSimpleProperty(),
    type: 'integer',
    typeHumanizedName: 'Integer Property',
    minValue: null,
    maxValue: null,
    sourceMap: newIntegerPropertySourceMap(),
  };
}

export const asIntegerProperty = (x: EntityProperty): IntegerProperty => ((x: any): IntegerProperty);
