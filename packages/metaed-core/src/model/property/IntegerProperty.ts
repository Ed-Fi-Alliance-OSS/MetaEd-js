// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
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
