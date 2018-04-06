// @flow
import type { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';
import type { SourceMap } from './../SourceMap';
import { NoSourceMap } from './../SourceMap';
import type { EntityProperty } from './EntityProperty';

export type AssociationPropertySourceMap = {
  ...$Exact<ReferentialPropertySourceMap>,
  isWeak: SourceMap,
};

export function newAssociationPropertySourceMap(): AssociationPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
    isWeak: NoSourceMap,
  };
}

export type AssociationProperty = {
  sourceMap: AssociationPropertySourceMap,
  ...$Exact<ReferentialProperty>,
  isWeak: boolean,
};

export function newAssociationProperty(): AssociationProperty {
  return {
    ...newReferentialProperty(),
    type: 'association',
    typeHumanizedName: 'Association Property',
    isWeak: false,
    sourceMap: newAssociationPropertySourceMap(),
  };
}

export const asAssociationProperty = (x: EntityProperty): AssociationProperty => ((x: any): AssociationProperty);
