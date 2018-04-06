// @flow
import type { NamespaceInfo } from './NamespaceInfo';
import type { ModelType } from './ModelType';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export type ModelBaseSourceMap = {
  type: SourceMap,
  documentation: SourceMap,
  metaEdName: SourceMap,
  metaEdId: SourceMap,
  namespaceInfo: SourceMap,
};

export function newModelBaseSourceMap() {
  return {
    type: NoSourceMap,
    documentation: NoSourceMap,
    metaEdName: NoSourceMap,
    metaEdId: NoSourceMap,
    namespaceInfo: NoSourceMap,
  };
}

export type ModelBase = {
  type: ModelType,
  documentation: string,
  metaEdName: string,
  metaEdId: string,
  namespaceInfo: NamespaceInfo,
  data: any,
  config: any,
};
