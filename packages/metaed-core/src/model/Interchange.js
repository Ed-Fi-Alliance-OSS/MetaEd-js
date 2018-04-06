// @flow
import type { InterchangeItem } from './InterchangeItem';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';
import type { ModelBase, ModelBaseSourceMap } from './ModelBase';
import { newModelBaseSourceMap } from './ModelBase';
import { newNamespaceInfo } from './NamespaceInfo';

export type InterchangeSourceMap = {
  ...$Exact<ModelBaseSourceMap>,
  elements: Array<SourceMap>,
  identityTemplates: Array<SourceMap>,
  extendedDocumentation: SourceMap,
  useCaseDocumentation: SourceMap,
};

export function newInterchangeSourceMap(): InterchangeSourceMap {
  return {
    ...newModelBaseSourceMap(),
    elements: [],
    identityTemplates: [],
    extendedDocumentation: NoSourceMap,
    useCaseDocumentation: NoSourceMap,
  };
}

export type Interchange = {
  ...$Exact<ModelBase>,
  typeHumanizedName: string,
  elements: Array<InterchangeItem>,
  identityTemplates: Array<InterchangeItem>,
  extendedDocumentation: string,
  useCaseDocumentation: string,
  baseEntityName: string,
  baseEntity: ?Interchange,
  sourceMap: ModelBaseSourceMap | InterchangeSourceMap,
};

export function newInterchange(): Interchange {
  return {
    type: 'interchange',
    typeHumanizedName: 'Interchange',
    documentation: '',
    metaEdName: '',
    metaEdId: '',
    namespaceInfo: newNamespaceInfo(),

    elements: [],
    identityTemplates: [],
    extendedDocumentation: '',
    useCaseDocumentation: '',
    baseEntityName: '',
    baseEntity: null,

    sourceMap: newInterchangeSourceMap(),
    data: {},
    config: {},
  };
}

export const NoInterchange: Interchange = {
  ...newInterchange(),
  metaEdName: 'NoInterchange',
};

export const asInterchange = (x: ModelBase): Interchange => ((x: any): Interchange);
