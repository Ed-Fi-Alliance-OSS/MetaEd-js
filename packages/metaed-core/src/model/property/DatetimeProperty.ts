// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';

/**
 *
 */
export type DatetimePropertySourceMap = SimplePropertySourceMap;

/**
 *
 */
export function newDatetimePropertySourceMap(): DatetimePropertySourceMap {
  return newSimplePropertySourceMap();
}

export interface DatetimeProperty extends SimpleProperty {
  sourceMap: DatetimePropertySourceMap;
}

/**
 *
 */
export function newDatetimeProperty(): DatetimeProperty {
  return {
    ...newSimpleProperty(),
    type: 'datetime',
    typeHumanizedName: 'Datetime Property',
    sourceMap: newDatetimePropertySourceMap(),
  };
}
