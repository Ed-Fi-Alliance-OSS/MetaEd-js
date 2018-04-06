// @flow
import type { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import type { ModelBase } from './ModelBase';

export type AssociationSubclassSourceMap = TopLevelEntitySourceMap;

export function newAssociationSubclassSourceMap(): AssociationSubclassSourceMap {
  return newTopLevelEntitySourceMap();
}

export type AssociationSubclass = {
  sourceMap: AssociationSubclassSourceMap,
  ...$Exact<TopLevelEntity>,
};

export function newAssociationSubclass(): AssociationSubclass {
  return {
    ...newTopLevelEntity(),
    type: 'associationSubclass',
    typeHumanizedName: 'Association Subclass',
    sourceMap: newAssociationSubclassSourceMap(),
  };
}

export const asAssociationSubclass = (x: ModelBase): AssociationSubclass => ((x: any): AssociationSubclass);
