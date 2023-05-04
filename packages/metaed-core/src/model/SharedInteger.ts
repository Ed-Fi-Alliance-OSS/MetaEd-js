import { SharedSimple, SharedSimpleSourceMap } from './SharedSimple';
import { newSharedSimpleSourceMap, newSharedSimple } from './SharedSimple';
import { ModelBase } from './ModelBase';
import { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export interface SharedIntegerSourceMap extends SharedSimpleSourceMap {
  isShort: SourceMap;
  minValue: SourceMap;
  maxValue: SourceMap;
}

/**
 *
 */
export function newSharedIntegerSourceMap(): SharedIntegerSourceMap {
  return {
    ...newSharedSimpleSourceMap(),
    isShort: NoSourceMap,
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
  };
}

export interface SharedInteger extends SharedSimple {
  sourceMap: SharedIntegerSourceMap;
  isShort: boolean;
  minValue: string;
  maxValue: string;
  hasBigHint: boolean;
}

/**
 *
 */
export function newSharedInteger(): SharedInteger {
  return {
    ...newSharedSimple(),
    type: 'sharedInteger',
    typeHumanizedName: 'Shared Integer',
    isShort: false,
    minValue: '',
    maxValue: '',
    hasBigHint: false,
    sourceMap: newSharedIntegerSourceMap(),
  };
}

/**
 *
 */
export const asSharedInteger = (x: ModelBase): SharedInteger => x as SharedInteger;
