// @flow
import type { EntityProperty } from './EntityProperty';
import { NoEntityProperty } from './EntityProperty';
import type { SourceMap } from './../SourceMap';
import { NoSourceMap } from './../SourceMap';

export type MergedPropertySourceMap = {
  type: SourceMap,
  mergePropertyPath: Array<SourceMap>,
  targetPropertyPath: Array<SourceMap>,
  mergeProperty: SourceMap,
  targetProperty: SourceMap,
};

export function newMergedPropertySourceMap() {
  return {
    type: NoSourceMap,
    mergePropertyPath: [],
    targetPropertyPath: [],
    mergeProperty: NoSourceMap,
    targetProperty: NoSourceMap,
  };
}

export type MergedProperty = {
  mergePropertyPath: Array<string>,
  targetPropertyPath: Array<string>,
  mergeProperty: ?EntityProperty,
  targetProperty: ?EntityProperty,
  sourceMap: MergedPropertySourceMap,
};

export function newMergedProperty(): MergedProperty {
  return {
    mergePropertyPath: [],
    targetPropertyPath: [],
    mergeProperty: null,
    targetProperty: null,
    sourceMap: newMergedPropertySourceMap(),
  };
}

export const NoMergedProperty: MergedProperty = {
  ...newMergedProperty(),
  mergeProperty: NoEntityProperty,
  targetProperty: NoEntityProperty,
};

export const asMergedProperty = (x: EntityProperty): MergedProperty => ((x: any): MergedProperty);
