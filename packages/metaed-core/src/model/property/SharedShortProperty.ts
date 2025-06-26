// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ShortProperty, ShortPropertySourceMap } from './ShortProperty';
import { newShortProperty, newShortPropertySourceMap } from './ShortProperty';
import { MergeDirective } from './MergeDirective';
import { SourceMap } from '../SourceMap';

export interface SharedShortPropertySourceMap extends ShortPropertySourceMap {
  mergeDirectives: SourceMap[];
}

/**
 *
 */
export function newSharedShortPropertySourceMap(): SharedShortPropertySourceMap {
  return {
    ...newShortPropertySourceMap(),
    mergeDirectives: [],
  };
}

export interface SharedShortProperty extends ShortProperty {
  sourceMap: SharedShortPropertySourceMap;
  mergeDirectives: MergeDirective[];
}

/**
 *
 */
export function newSharedShortProperty(): SharedShortProperty {
  return {
    ...newShortProperty(),
    type: 'sharedShort',
    typeHumanizedName: 'Shared Short Property',
    mergeDirectives: [],
    sourceMap: newSharedShortPropertySourceMap(),
  };
}
