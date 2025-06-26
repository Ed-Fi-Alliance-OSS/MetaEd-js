// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SharedSimple, SharedSimpleSourceMap } from './SharedSimple';
import { newSharedSimpleSourceMap, newSharedSimple } from './SharedSimple';
import { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export interface SharedDecimalSourceMap extends SharedSimpleSourceMap {
  totalDigits: SourceMap;
  decimalPlaces: SourceMap;
  minValue: SourceMap;
  maxValue: SourceMap;
}

/**
 *
 */
export function newSharedDecimalSourceMap(): SharedDecimalSourceMap {
  return {
    ...newSharedSimpleSourceMap(),
    totalDigits: NoSourceMap,
    decimalPlaces: NoSourceMap,
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
  };
}

export interface SharedDecimal extends SharedSimple {
  sourceMap: SharedDecimalSourceMap;
  totalDigits: string;
  decimalPlaces: string;
  minValue: string;
  maxValue: string;
}

/**
 *
 */
export function newSharedDecimal(): SharedDecimal {
  return {
    ...newSharedSimple(),
    type: 'sharedDecimal',
    typeHumanizedName: 'Shared Decimal',
    totalDigits: '',
    decimalPlaces: '',
    minValue: '',
    maxValue: '',
    sourceMap: newSharedDecimalSourceMap(),
  };
}
