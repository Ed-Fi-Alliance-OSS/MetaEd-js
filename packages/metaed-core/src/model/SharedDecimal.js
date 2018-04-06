// @flow
import type { SharedSimple, SharedSimpleSourceMap } from './SharedSimple';
import { newSharedSimpleSourceMap, newSharedSimple } from './SharedSimple';
import type { ModelBase } from './ModelBase';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export type SharedDecimalSourceMap = {
  ...$Exact<SharedSimpleSourceMap>,
  totalDigits: SourceMap,
  decimalPlaces: SourceMap,
  minValue: SourceMap,
  maxValue: SourceMap,
};

export function newSharedDecimalSourceMap(): SharedDecimalSourceMap {
  return {
    ...newSharedSimpleSourceMap(),
    totalDigits: NoSourceMap,
    decimalPlaces: NoSourceMap,
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
  };
}

export type SharedDecimal = {
  sourceMap: SharedDecimalSourceMap,
  ...$Exact<SharedSimple>,
  totalDigits: string,
  decimalPlaces: string,
  minValue: string,
  maxValue: string,
};

export function newSharedDecimal(): SharedDecimal {
  return {
    ...newSharedSimple(),
    type: 'sharedDecimal',
    typeHumanizedName: 'Shared Decimal',
    totalDigits: '',
    decimalPlaces: '',
    minValue: '',
    maxValue: '',
    sourceMap: newSharedDecimalSourceMap(),
  };
}

export const asSharedDecimal = (x: ModelBase): SharedDecimal => ((x: any): SharedDecimal);
