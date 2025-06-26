// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';

/**
 *
 */
export type BooleanPropertySourceMap = SimplePropertySourceMap;

/**
 *
 */
export function newBooleanPropertySourceMap(): BooleanPropertySourceMap {
  return newSimplePropertySourceMap();
}

export interface BooleanProperty extends SimpleProperty {
  sourceMap: BooleanPropertySourceMap;
}

/**
 *
 */
export function newBooleanProperty(): BooleanProperty {
  return {
    ...newSimpleProperty(),
    type: 'boolean',
    typeHumanizedName: 'Boolean Property',
    sourceMap: newBooleanPropertySourceMap(),
  };
}
