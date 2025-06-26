// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';

/**
 *
 */
export type YearPropertySourceMap = SimplePropertySourceMap;

/**
 *
 */
export function newYearPropertySourceMap(): YearPropertySourceMap {
  return newSimplePropertySourceMap();
}

export interface YearProperty extends SimpleProperty {
  sourceMap: YearPropertySourceMap;
}

/**
 *
 */
export function newYearProperty(): YearProperty {
  return {
    ...newSimpleProperty(),
    type: 'year',
    typeHumanizedName: 'Year Property',
    sourceMap: newYearPropertySourceMap(),
  };
}
