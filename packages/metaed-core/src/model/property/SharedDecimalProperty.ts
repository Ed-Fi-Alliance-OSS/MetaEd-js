// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DecimalProperty, DecimalPropertySourceMap } from './DecimalProperty';
import { newDecimalProperty, newDecimalPropertySourceMap } from './DecimalProperty';
import { MergeDirective } from './MergeDirective';
import { SourceMap } from '../SourceMap';

export interface SharedDecimalPropertySourceMap extends DecimalPropertySourceMap {
  mergeDirectives: SourceMap[];
}

/**
 *
 */
export function newSharedDecimalPropertySourceMap(): SharedDecimalPropertySourceMap {
  return {
    ...newDecimalPropertySourceMap(),
    mergeDirectives: [],
  };
}

export interface SharedDecimalProperty extends DecimalProperty {
  sourceMap: SharedDecimalPropertySourceMap;
  mergeDirectives: MergeDirective[];
}

/**
 *
 */
export function newSharedDecimalProperty(): SharedDecimalProperty {
  return {
    ...newDecimalProperty(),
    type: 'sharedDecimal',
    typeHumanizedName: 'Shared Decimal Property',
    mergeDirectives: [],
    sourceMap: newSharedDecimalPropertySourceMap(),
  };
}
