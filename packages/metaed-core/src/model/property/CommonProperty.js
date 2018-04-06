// @flow
import type { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';
import type { SourceMap } from './../SourceMap';
import { NoSourceMap } from './../SourceMap';
import type { EntityProperty } from './EntityProperty';

export type CommonPropertySourceMap = {
  ...$Exact<ReferentialPropertySourceMap>,
  isExtensionOverride: SourceMap,
};

export function newCommonPropertySourceMap(): CommonPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
    isExtensionOverride: NoSourceMap,
  };
}

export type CommonProperty = {
  sourceMap: CommonPropertySourceMap,
  ...$Exact<ReferentialProperty>,
  isExtensionOverride: boolean,
};

export function newCommonProperty(): CommonProperty {
  return {
    ...newReferentialProperty(),
    type: 'common',
    typeHumanizedName: 'Common Property',
    isExtensionOverride: false,
    sourceMap: newCommonPropertySourceMap(),
  };
}

export const asCommonProperty = (x: EntityProperty): CommonProperty => ((x: any): CommonProperty);
