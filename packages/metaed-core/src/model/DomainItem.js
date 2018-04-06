// @flow
import type { ModelBase, ModelBaseSourceMap } from './ModelBase';
import { newModelBaseSourceMap } from './ModelBase';
import { newNamespaceInfo } from './NamespaceInfo';
import type { ModelType } from './ModelType';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export type DomainItemSourceMap = {
  ...$Exact<ModelBaseSourceMap>,
  referencedType: SourceMap,
  typeHumanizedName: SourceMap,
};

export function newDomainItemSourceMap(): DomainItemSourceMap {
  return {
    ...newModelBaseSourceMap(),
    referencedType: NoSourceMap,
    typeHumanizedName: NoSourceMap,
  };
}

export type DomainItem = {
  sourceMap: DomainItemSourceMap,
  ...$Exact<ModelBase>,
  referencedType: ModelType,
  typeHumanizedName: string,
};

export function newDomainItem(): DomainItem {
  return {
    type: 'domainItem',
    typeHumanizedName: 'Domain Item',
    documentation: '',
    metaEdName: '',
    metaEdId: '',
    namespaceInfo: newNamespaceInfo(),
    referencedType: 'unknown',
    sourceMap: newDomainItemSourceMap(),
    data: {},
    config: {},
  };
}

export const NoDomainItem: DomainItem = {
  ...newDomainItem(),
  metaEdName: 'NoDomainItem',
};

export const asDomainItem = (x: ModelBase): DomainItem => ((x: any): DomainItem);
