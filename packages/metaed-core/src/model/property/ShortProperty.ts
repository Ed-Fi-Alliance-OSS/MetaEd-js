// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import { EntityProperty } from './EntityProperty';
import { SourceMap } from '../SourceMap';
import { NoSourceMap } from '../SourceMap';

export interface ShortPropertySourceMap extends SimplePropertySourceMap {
  minValue: SourceMap;
  maxValue: SourceMap;
}

/**
 *
 */
export function newShortPropertySourceMap(): ShortPropertySourceMap {
  return {
    ...newSimplePropertySourceMap(),
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
  };
}

export interface ShortProperty extends SimpleProperty {
  sourceMap: ShortPropertySourceMap;
  minValue: string | null;
  maxValue: string | null;
}

/**
 *
 */
export function newShortProperty(): ShortProperty {
  return {
    ...newSimpleProperty(),
    type: 'short',
    typeHumanizedName: 'Short Property',
    minValue: null,
    maxValue: null,
    sourceMap: newShortPropertySourceMap(),
  };
}

/**
 *
 */
export const asShortProperty = (x: EntityProperty): ShortProperty => x as ShortProperty;
