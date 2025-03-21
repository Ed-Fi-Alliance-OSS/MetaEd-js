// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import { EntityProperty } from './EntityProperty';

/**
 *
 */
export type TimePropertySourceMap = SimplePropertySourceMap;

/**
 *
 */
export function newTimePropertySourceMap(): TimePropertySourceMap {
  return newSimplePropertySourceMap();
}

export interface TimeProperty extends SimpleProperty {
  sourceMap: TimePropertySourceMap;
}

/**
 *
 */
export function newTimeProperty(): TimeProperty {
  return {
    ...newSimpleProperty(),
    type: 'time',
    typeHumanizedName: 'Time Property',
    sourceMap: newTimePropertySourceMap(),
  };
}

/**
 *
 */
export const asTimeProperty = (x: EntityProperty): TimeProperty => x as TimeProperty;
