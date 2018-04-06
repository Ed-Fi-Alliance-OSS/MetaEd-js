// @flow
import { newEnumeration } from './Enumeration';
import type { ModelBase } from './ModelBase';
import type { Enumeration } from './Enumeration';

export type MapTypeEnumeration = Enumeration;

export function newMapTypeEnumeration(): MapTypeEnumeration {
  return {
    ...newEnumeration(),
    type: 'mapTypeEnumeration',
    typeHumanizedName: 'Map Type Enumeration',
  };
}

export const NoMapTypeEnumeration: MapTypeEnumeration = {
  ...newMapTypeEnumeration(),
  metaEdName: 'NoMapTypeEnumeration',
};

export const asMapTypeEnumeration = (x: ModelBase): MapTypeEnumeration => ((x: any): MapTypeEnumeration);
