// @flow
import type { EntityProperty } from './property/EntityProperty';
import type { ModelBase, ModelBaseSourceMap } from './ModelBase';
import { newModelBaseSourceMap } from './ModelBase';
import { newNamespaceInfo } from './NamespaceInfo';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export type TopLevelEntitySourceMap = {
  ...$Exact<ModelBaseSourceMap>,
  properties: Array<SourceMap>,
  identityProperties: Array<SourceMap>,
  queryableFields: Array<SourceMap>,
  allowPrimaryKeyUpdates: SourceMap,
  baseEntityName: SourceMap,
  baseEntity: SourceMap,
};

export function newTopLevelEntitySourceMap() {
  return {
    ...newModelBaseSourceMap(),
    properties: [],
    identityProperties: [],
    queryableFields: [],
    allowPrimaryKeyUpdates: NoSourceMap,
    baseEntityName: NoSourceMap,
    baseEntity: NoSourceMap,
  };
}

export type TopLevelEntity = {
  ...$Exact<ModelBase>,
  properties: Array<EntityProperty>,
  identityProperties: Array<EntityProperty>,
  queryableFields: Array<EntityProperty>,
  typeHumanizedName: string,
  allowPrimaryKeyUpdates: boolean,
  baseEntityName: string,
  baseEntity: ?TopLevelEntity,
  sourceMap: TopLevelEntitySourceMap,
};

export function newTopLevelEntity(): TopLevelEntity {
  return {
    type: 'unknown',
    documentation: '',
    metaEdName: '',
    metaEdId: '',
    namespaceInfo: newNamespaceInfo(),

    properties: [],
    identityProperties: [],
    queryableFields: [],
    typeHumanizedName: '',

    allowPrimaryKeyUpdates: false,
    baseEntityName: '',
    baseEntity: null,
    sourceMap: newTopLevelEntitySourceMap(),

    data: {},
    config: {},
  };
}

export const NoTopLevelEntity: TopLevelEntity = {
  ...newTopLevelEntity(),
  metaEdName: 'NoTopLevelEntity',
};

export const asTopLevelEntity = (x: ModelBase): TopLevelEntity => ((x: any): TopLevelEntity);
