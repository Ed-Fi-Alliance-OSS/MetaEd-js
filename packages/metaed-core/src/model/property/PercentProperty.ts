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
export type PercentPropertySourceMap = SimplePropertySourceMap;

/**
 *
 */
export function newPercentPropertySourceMap(): PercentPropertySourceMap {
  return newSimplePropertySourceMap();
}

export interface PercentProperty extends SimpleProperty {
  sourceMap: PercentPropertySourceMap;
}

/**
 *
 */
export function newPercentProperty(): PercentProperty {
  return {
    ...newSimpleProperty(),
    type: 'percent',
    typeHumanizedName: 'Percent Property',
    sourceMap: newPercentPropertySourceMap(),
  };
}

/**
 *
 */
export const asPercentProperty = (x: EntityProperty): PercentProperty => x as PercentProperty;
