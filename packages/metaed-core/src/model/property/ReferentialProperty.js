// @flow
import type { EntityProperty, EntityPropertySourceMap } from './EntityProperty';
import { newEntityPropertySourceMap, newEntityProperty } from './EntityProperty';
import type { SourceMap } from './../SourceMap';
import { NoSourceMap } from './../SourceMap';
import type { TopLevelEntity } from './../TopLevelEntity';
import { NoTopLevelEntity } from './../TopLevelEntity';
import type { MergedProperty } from './MergedProperty';

export type ReferentialPropertySourceMap = {
  ...$Exact<EntityPropertySourceMap>,
  referencedEntity: SourceMap,
  mergedProperties: Array<SourceMap>,
};

export function newReferentialPropertySourceMap(): ReferentialPropertySourceMap {
  return {
    ...newEntityPropertySourceMap(),
    referencedEntity: NoSourceMap,
    mergedProperties: [],
  };
}

export type ReferentialProperty = {
  sourceMap: ReferentialPropertySourceMap,
  ...$Exact<EntityProperty>,
  referencedEntity: TopLevelEntity,
  mergedProperties: Array<MergedProperty>,
};

export function isReferentialProperty(property: EntityProperty) {
  return Object.keys(property).includes('mergedProperties');
}

export function newReferentialProperty(): ReferentialProperty {
  return {
    ...newEntityProperty(),
    referencedEntity: NoTopLevelEntity,
    mergedProperties: [],
    sourceMap: newReferentialPropertySourceMap(),
  };
}

export const asReferentialProperty = (x: EntityProperty): ReferentialProperty => ((x: any): ReferentialProperty);
