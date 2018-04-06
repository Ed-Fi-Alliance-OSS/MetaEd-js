// @flow
import type { ModelBase, ModelBaseSourceMap } from './ModelBase';
import { newModelBaseSourceMap } from './ModelBase';
import { newNamespaceInfo } from './NamespaceInfo';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export type EnumerationItemSourceMap = {
  ...$Exact<ModelBaseSourceMap>,
  shortDescription: SourceMap,
  typeHumanizedName: SourceMap,
};

export function newEnumerationItemSourceMap(): EnumerationItemSourceMap {
  return {
    ...newModelBaseSourceMap(),
    shortDescription: NoSourceMap,
    typeHumanizedName: NoSourceMap,
  };
}

export type EnumerationItem = {
  sourceMap: EnumerationItemSourceMap,
  ...$Exact<ModelBase>,
  shortDescription: string,
  typeHumanizedName: string,
};

export function newEnumerationItem(): EnumerationItem {
  return {
    type: 'enumerationItem',
    typeHumanizedName: 'Enumeration Item',
    documentation: '',
    metaEdName: '',
    metaEdId: '',
    namespaceInfo: newNamespaceInfo(),
    shortDescription: '',
    sourceMap: newEnumerationItemSourceMap(),
    data: {},
    config: {},
  };
}

export const NoEnumerationItem: EnumerationItem = {
  ...newEnumerationItem(),
  metaEdName: 'NoEnumerationItem',
  shortDescription: 'NoEnumerationItem',
};

export const asEnumerationItem = (x: ModelBase): EnumerationItem => ((x: any): EnumerationItem);
