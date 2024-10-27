import deepFreeze from 'deep-freeze';
import { Namespace, NoNamespace } from './Namespace';
import { ModelType } from './ModelType';
import { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

/**
 *
 */
export interface ModelBaseSourceMap {
  type: SourceMap;
  isDeprecated: SourceMap;
  deprecationReason: SourceMap;
  documentation: SourceMap;
  metaEdName: SourceMap;
}

/**
 *
 */
export function newModelBaseSourceMap() {
  return {
    type: NoSourceMap,
    isDeprecated: NoSourceMap,
    deprecationReason: NoSourceMap,
    documentation: NoSourceMap,
    metaEdName: NoSourceMap,
  };
}

/**
 *
 */
export interface ModelBase {
  //  entityUuid is a unique identifier for this entity. It is transient, meaning it will differ between runs.
  entityUuid: string;
  type: ModelType;
  isDeprecated: boolean;
  deprecationReason: string;
  documentation: string;
  metaEdName: string;
  namespace: Namespace;
  data: any;
}

/**
 *
 */
export function newModelBase(): ModelBase {
  return {
    entityUuid: '',
    type: 'unknown',
    isDeprecated: false,
    deprecationReason: '',
    documentation: '',
    metaEdName: '',
    namespace: NoNamespace,
    data: {},
  };
}

/**
 *
 */
export const NoModelBase: ModelBase = deepFreeze({
  ...newModelBase(),
  metaEdName: 'NoModelBase',
});
