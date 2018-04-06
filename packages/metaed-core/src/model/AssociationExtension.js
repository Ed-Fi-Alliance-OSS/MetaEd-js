// @flow
import type { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import type { ModelBase } from './ModelBase';

export type AssociationExtensionSourceMap = TopLevelEntitySourceMap;

export function newAssociationExtensionSourceMap(): AssociationExtensionSourceMap {
  return newTopLevelEntitySourceMap();
}

export type AssociationExtension = {
  sourceMap: AssociationExtensionSourceMap,
  ...$Exact<TopLevelEntity>,
};

export function newAssociationExtension(): AssociationExtension {
  return {
    ...newTopLevelEntity(),
    type: 'associationExtension',
    typeHumanizedName: 'Association Extension',
    sourceMap: newAssociationExtensionSourceMap(),
  };
}

export const asAssociationExtension = (x: ModelBase): AssociationExtension => ((x: any): AssociationExtension);
