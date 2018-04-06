// @flow
import type { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';
import type { EntityProperty } from './EntityProperty';

export type InlineCommonPropertySourceMap = ReferentialPropertySourceMap;

export function newInlineCommonPropertySourceMap(): InlineCommonPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
  };
}

export type InlineCommonProperty = {
  sourceMap: InlineCommonPropertySourceMap,
  ...$Exact<ReferentialProperty>,
};

export function newInlineCommonProperty(): InlineCommonProperty {
  return {
    ...newReferentialProperty(),
    type: 'inlineCommon',
    typeHumanizedName: 'Inline Common Property',
    sourceMap: newInlineCommonPropertySourceMap(),
  };
}

export const asInlineCommonProperty = (x: EntityProperty): InlineCommonProperty => ((x: any): InlineCommonProperty);
