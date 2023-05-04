import { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import { EntityProperty } from './EntityProperty';
import { SourceMap } from '../SourceMap';
import { NoSourceMap } from '../SourceMap';

export interface IntegerPropertySourceMap extends SimplePropertySourceMap {
  minValue: SourceMap;
  maxValue: SourceMap;
}

/**
 *
 */
export function newIntegerPropertySourceMap(): IntegerPropertySourceMap {
  return {
    ...newSimplePropertySourceMap(),
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
  };
}

export interface IntegerProperty extends SimpleProperty {
  sourceMap: IntegerPropertySourceMap;
  minValue: string | null;
  maxValue: string | null;
  hasBigHint: boolean;
}

/**
 *
 */
export function newIntegerProperty(): IntegerProperty {
  return {
    ...newSimpleProperty(),
    type: 'integer',
    typeHumanizedName: 'Integer Property',
    minValue: null,
    maxValue: null,
    hasBigHint: false,
    sourceMap: newIntegerPropertySourceMap(),
  };
}

/**
 *
 */
export const asIntegerProperty = (x: EntityProperty): IntegerProperty => x as IntegerProperty;
