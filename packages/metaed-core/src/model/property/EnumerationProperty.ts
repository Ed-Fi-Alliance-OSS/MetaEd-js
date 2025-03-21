// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';
import { EntityProperty } from './EntityProperty';

/**
 *
 */
export type EnumerationPropertySourceMap = ReferentialPropertySourceMap;

/**
 *
 */
export function newEnumerationPropertySourceMap(): EnumerationPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
  };
}

export interface EnumerationProperty extends ReferentialProperty {
  sourceMap: EnumerationPropertySourceMap;
}

/**
 *
 */
export function newEnumerationProperty(): EnumerationProperty {
  return {
    ...newReferentialProperty(),
    type: 'enumeration',
    typeHumanizedName: 'Enumeration Property',
    sourceMap: newEnumerationPropertySourceMap(),
  };
}

/**
 *
 */
export const asEnumerationProperty = (x: EntityProperty): EnumerationProperty => x as EnumerationProperty;
