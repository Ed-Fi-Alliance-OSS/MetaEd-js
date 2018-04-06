// @flow
import { newNamespaceInfo } from './NamespaceInfo';
import type { ModelBase } from './ModelBase';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export type SharedSimpleSourceMap = {
  type: SourceMap,
  documentation: SourceMap,
  metaEdName: SourceMap,
  metaEdId: SourceMap,
  namespaceInfo: SourceMap,
};

export function newSharedSimpleSourceMap(): SharedSimpleSourceMap {
  return {
    type: NoSourceMap,
    documentation: NoSourceMap,
    metaEdName: NoSourceMap,
    metaEdId: NoSourceMap,
    namespaceInfo: NoSourceMap,
  };
}

export type SharedSimple = {
  ...$Exact<ModelBase>,
  typeHumanizedName: string,
  sourceMap: SharedSimpleSourceMap,
};

export function newSharedSimple(): SharedSimple {
  return {
    type: 'unknown',
    typeHumanizedName: 'unknown',
    documentation: '',
    metaEdName: '',
    metaEdId: '',
    namespaceInfo: newNamespaceInfo(),
    sourceMap: newSharedSimpleSourceMap(),
    data: {},
    config: {},
  };
}

export const NoSharedSimple: SharedSimple = {
  ...newSharedSimple(),
  metaEdName: 'NoSharedSimple',
};
