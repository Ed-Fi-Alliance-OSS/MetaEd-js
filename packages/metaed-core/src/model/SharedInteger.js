// @flow
import type { SharedSimple, SharedSimpleSourceMap } from './SharedSimple';
import { newSharedSimpleSourceMap, newSharedSimple } from './SharedSimple';
import type { ModelBase } from './ModelBase';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export type SharedIntegerSourceMap = {
  ...$Exact<SharedSimpleSourceMap>,
  isShort: ?SourceMap,
  minValue: ?SourceMap,
  maxValue: ?SourceMap,
};

export function newSharedIntegerSourceMap(): SharedIntegerSourceMap {
  return {
    ...newSharedSimpleSourceMap(),
    isShort: NoSourceMap,
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
  };
}

export type SharedInteger = {
  sourceMap: SharedIntegerSourceMap,
  ...$Exact<SharedSimple>,
  isShort: boolean,
  minValue: string,
  maxValue: string,
};

export function newSharedInteger(): SharedInteger {
  return {
    ...newSharedSimple(),
    type: 'sharedInteger',
    typeHumanizedName: 'Shared Integer',
    isShort: false,
    minValue: '',
    maxValue: '',
    sourceMap: newSharedIntegerSourceMap(),
  };
}

export const asSharedInteger = (x: ModelBase): SharedInteger => ((x: any): SharedInteger);
