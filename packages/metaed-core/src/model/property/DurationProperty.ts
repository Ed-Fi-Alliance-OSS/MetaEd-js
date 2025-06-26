// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';

/**
 *
 */
export type DurationPropertySourceMap = SimplePropertySourceMap;

/**
 *
 */
export function newDurationPropertySourceMap(): DurationPropertySourceMap {
  return newSimplePropertySourceMap();
}

export interface DurationProperty extends SimpleProperty {
  sourceMap: DurationPropertySourceMap;
}

/**
 *
 */
export function newDurationProperty(): DurationProperty {
  return {
    ...newSimpleProperty(),
    type: 'duration',
    typeHumanizedName: 'Duration Property',
    sourceMap: newDurationPropertySourceMap(),
  };
}
