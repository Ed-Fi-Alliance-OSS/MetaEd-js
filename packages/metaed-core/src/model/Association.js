// @flow
import type { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import type { ModelBase } from './ModelBase';

export type AssociationSourceMap = TopLevelEntitySourceMap;

export function newAssociationSourceMap(): AssociationSourceMap {
  return newTopLevelEntitySourceMap();
}

export type Association = {
  sourceMap: AssociationSourceMap,
  ...$Exact<TopLevelEntity>,
};

export function newAssociation(): Association {
  return {
    ...newTopLevelEntity(),
    type: 'association',
    typeHumanizedName: 'Association',
    sourceMap: newAssociationSourceMap(),
  };
}

export const asAssociation = (x: ModelBase): Association => ((x: any): Association);
