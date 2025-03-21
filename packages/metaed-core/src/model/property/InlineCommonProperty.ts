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
export type InlineCommonPropertySourceMap = ReferentialPropertySourceMap;

/**
 *
 */
export function newInlineCommonPropertySourceMap(): InlineCommonPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
  };
}

export interface InlineCommonProperty extends ReferentialProperty {
  sourceMap: InlineCommonPropertySourceMap;
}

/**
 *
 */
export function newInlineCommonProperty(): InlineCommonProperty {
  return {
    ...newReferentialProperty(),
    type: 'inlineCommon',
    typeHumanizedName: 'Inline Common Property',
    sourceMap: newInlineCommonPropertySourceMap(),
  };
}

/**
 *
 */
export const asInlineCommonProperty = (x: EntityProperty): InlineCommonProperty => x as InlineCommonProperty;
