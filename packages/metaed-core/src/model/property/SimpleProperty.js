// @flow
import type { EntityProperty, EntityPropertySourceMap } from './EntityProperty';
import { newEntityPropertySourceMap, newEntityProperty } from './EntityProperty';
import { NoSharedSimple } from '../SharedSimple';
import type { SharedSimple } from '../SharedSimple';
import type { SourceMap } from './../SourceMap';
import { NoSourceMap } from './../SourceMap';

export type SimplePropertySourceMap = {
  ...$Exact<EntityPropertySourceMap>,
  referencedEntity: SourceMap,
};

export function newSimplePropertySourceMap(): SimplePropertySourceMap {
  return {
    ...newEntityPropertySourceMap(),
    referencedEntity: NoSourceMap,
  };
}

export type SimpleProperty = {
  ...$Exact<EntityProperty>,
  referencedEntity: SharedSimple,
};

export function newSimpleProperty() {
  return {
    ...newEntityProperty(),
    referencedEntity: NoSharedSimple,
  };
}

export const asSimpleProperty = (x: EntityProperty): SimpleProperty => ((x: any): SimpleProperty);
