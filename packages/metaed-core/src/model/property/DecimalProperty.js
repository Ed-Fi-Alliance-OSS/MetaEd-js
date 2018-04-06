// @flow
import type { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import type { EntityProperty } from './EntityProperty';
import type { SourceMap } from './../SourceMap';
import { NoSourceMap } from './../SourceMap';

export type DecimalPropertySourceMap = {
  ...$Exact<SimplePropertySourceMap>,
  minValue: SourceMap,
  maxValue: SourceMap,
  totalDigits: SourceMap,
  decimalPlaces: SourceMap,
};

export function newDecimalPropertySourceMap(): DecimalPropertySourceMap {
  return {
    ...newSimplePropertySourceMap(),
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
    totalDigits: NoSourceMap,
    decimalPlaces: NoSourceMap,
  };
}

export type DecimalProperty = {
  sourceMap: DecimalPropertySourceMap,
  ...$Exact<SimpleProperty>,
  minValue: ?string,
  maxValue: ?string,
  totalDigits: string,
  decimalPlaces: string,
};

export function newDecimalProperty(): DecimalProperty {
  return {
    ...newSimpleProperty(),
    type: 'decimal',
    typeHumanizedName: 'Decimal Property',
    minValue: null,
    maxValue: null,
    totalDigits: '',
    decimalPlaces: '',
    sourceMap: newDecimalPropertySourceMap(),
  };
}

export const asDecimalProperty = (x: EntityProperty): DecimalProperty => ((x: any): DecimalProperty);
