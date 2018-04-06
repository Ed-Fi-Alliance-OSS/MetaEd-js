// @flow
import type { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import type { MapTypeEnumeration } from './MapTypeEnumeration';
import { NoMapTypeEnumeration } from './MapTypeEnumeration';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';
import type { ModelBase } from './ModelBase';

export type DescriptorSourceMap = {
  ...$Exact<TopLevelEntitySourceMap>,
  isMapTypeRequired: SourceMap,
  isMapTypeOptional: SourceMap,
  mapTypeEnumeration: SourceMap,
};

export function newDescriptorSourceMap(): DescriptorSourceMap {
  return {
    ...newTopLevelEntitySourceMap(),
    isMapTypeRequired: NoSourceMap,
    isMapTypeOptional: NoSourceMap,
    mapTypeEnumeration: NoSourceMap,
  };
}

export type Descriptor = {
  sourceMap: DescriptorSourceMap,
  ...$Exact<TopLevelEntity>,
  isMapTypeRequired: boolean,
  isMapTypeOptional: boolean,
  mapTypeEnumeration: MapTypeEnumeration,
};

export function newDescriptor(): Descriptor {
  return {
    ...newTopLevelEntity(),
    type: 'descriptor',
    typeHumanizedName: 'Descriptor',
    isMapTypeRequired: false,
    isMapTypeOptional: false,
    mapTypeEnumeration: NoMapTypeEnumeration,
    sourceMap: newDescriptorSourceMap(),
  };
}

export const asDescriptor = (x: ModelBase): Descriptor => ((x: any): Descriptor);
