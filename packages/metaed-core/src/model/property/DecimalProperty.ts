// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import { SourceMap } from '../SourceMap';
import { NoSourceMap } from '../SourceMap';

export interface DecimalPropertySourceMap extends SimplePropertySourceMap {
  minValue: SourceMap;
  maxValue: SourceMap;
  totalDigits: SourceMap;
  decimalPlaces: SourceMap;
}

/**
 *
 */
export function newDecimalPropertySourceMap(): DecimalPropertySourceMap {
  return {
    ...newSimplePropertySourceMap(),
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
    totalDigits: NoSourceMap,
    decimalPlaces: NoSourceMap,
  };
}

export interface DecimalProperty extends SimpleProperty {
  sourceMap: DecimalPropertySourceMap;
  minValue: string | null;
  maxValue: string | null;
  totalDigits: string;
  decimalPlaces: string;
}

/**
 *
 */
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
