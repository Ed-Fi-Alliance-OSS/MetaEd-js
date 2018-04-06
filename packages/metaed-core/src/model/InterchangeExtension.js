// @flow
import type { Interchange } from './Interchange';
import { newInterchange } from './Interchange';
import type { ModelBase } from './ModelBase';

export type InterchangeExtension = Interchange;

export function newInterchangeExtension(): InterchangeExtension {
  return {
    ...newInterchange(),
    type: 'interchangeExtension',
    typeHumanizedName: 'Interchange Extension',
  };
}

export const asInterchangeExtension = (x: ModelBase): InterchangeExtension => ((x: any): InterchangeExtension);
