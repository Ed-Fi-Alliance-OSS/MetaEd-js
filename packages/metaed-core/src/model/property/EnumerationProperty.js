// @flow
import type { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';
import type { EntityProperty } from './EntityProperty';

export type EnumerationPropertySourceMap = ReferentialPropertySourceMap;

export function newEnumerationPropertySourceMap(): EnumerationPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
  };
}

export type EnumerationProperty = {
  sourceMap: EnumerationPropertySourceMap,
  ...$Exact<ReferentialProperty>,
};

export function newEnumerationProperty(): EnumerationProperty {
  return {
    ...newReferentialProperty(),
    type: 'enumeration',
    typeHumanizedName: 'Enumeration Property',
    sourceMap: newEnumerationPropertySourceMap(),
  };
}

export const asEnumerationProperty = (x: EntityProperty): EnumerationProperty => ((x: any): EnumerationProperty);
