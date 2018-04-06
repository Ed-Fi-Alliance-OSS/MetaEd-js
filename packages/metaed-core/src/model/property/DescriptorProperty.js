// @flow
import type { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';
import type { EntityProperty } from './EntityProperty';

export type DescriptorPropertySourceMap = ReferentialPropertySourceMap;

export function newDescriptorPropertySourceMap(): DescriptorPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
  };
}

export type DescriptorProperty = {
  sourceMap: DescriptorPropertySourceMap,
  ...$Exact<ReferentialProperty>,
};

export function newDescriptorProperty(): DescriptorProperty {
  return {
    ...newReferentialProperty(),
    type: 'descriptor',
    typeHumanizedName: 'Descriptor Property',
    sourceMap: newDescriptorPropertySourceMap(),
  };
}

export const asDescriptorProperty = (x: EntityProperty): DescriptorProperty => ((x: any): DescriptorProperty);
