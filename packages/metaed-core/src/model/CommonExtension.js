// @flow
import type { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import type { ModelBase } from './ModelBase';

export type CommonExtensionSourceMap = TopLevelEntitySourceMap;

export function newCommonExtensionSourceMap(): CommonExtensionSourceMap {
  return newTopLevelEntitySourceMap();
}

export type CommonExtension = {
  sourceMap: CommonExtensionSourceMap,
  ...$Exact<TopLevelEntity>,
};

export function newCommonExtension(): CommonExtension {
  return {
    ...newTopLevelEntity(),
    type: 'commonExtension',
    typeHumanizedName: 'Common Extension',
    sourceMap: newCommonExtensionSourceMap(),
  };
}

export const asCommonExtension = (x: ModelBase): CommonExtension => ((x: any): CommonExtension);
