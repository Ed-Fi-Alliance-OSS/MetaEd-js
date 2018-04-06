// @flow
import type { SharedSimple, SharedSimpleSourceMap } from './SharedSimple';
import { newSharedSimpleSourceMap, newSharedSimple } from './SharedSimple';
import type { ModelBase } from './ModelBase';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export type SharedStringSourceMap = {
  ...$Exact<SharedSimpleSourceMap>,
  minLength: SourceMap,
  maxLength: SourceMap,
};

export function newSharedStringSourceMap(): SharedStringSourceMap {
  return {
    ...newSharedSimpleSourceMap(),
    minLength: NoSourceMap,
    maxLength: NoSourceMap,
  };
}

export type SharedString = {
  sourceMap: SharedStringSourceMap,
  ...$Exact<SharedSimple>,
  minLength: string,
  maxLength: string,
};

export function newSharedString(): SharedString {
  return {
    ...newSharedSimple(),
    type: 'sharedString',
    typeHumanizedName: 'Shared String',
    minLength: '',
    maxLength: '',
    sourceMap: newSharedStringSourceMap(),
  };
}

export const asSharedString = (x: ModelBase): SharedString => ((x: any): SharedString);
