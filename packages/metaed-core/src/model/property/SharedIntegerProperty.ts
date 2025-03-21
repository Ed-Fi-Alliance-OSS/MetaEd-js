// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newIntegerProperty, newIntegerPropertySourceMap } from './IntegerProperty';
import { IntegerProperty, IntegerPropertySourceMap } from './IntegerProperty';
import { EntityProperty } from './EntityProperty';
import { MergeDirective } from './MergeDirective';
import { SourceMap } from '../SourceMap';

export interface SharedIntegerPropertySourceMap extends IntegerPropertySourceMap {
  mergeDirectives: SourceMap[];
}

/**
 *
 */
export function newSharedIntegerPropertySourceMap(): SharedIntegerPropertySourceMap {
  return {
    ...newIntegerPropertySourceMap(),
    mergeDirectives: [],
  };
}

export interface SharedIntegerProperty extends IntegerProperty {
  sourceMap: SharedIntegerPropertySourceMap;
  mergeDirectives: MergeDirective[];
}

/**
 *
 */
export function newSharedIntegerProperty(): SharedIntegerProperty {
  return {
    ...newIntegerProperty(),
    type: 'sharedInteger',
    typeHumanizedName: 'Shared Integer Property',
    mergeDirectives: [],
    sourceMap: newSharedIntegerPropertySourceMap(),
  };
}

/**
 *
 */
export const asSharedIntegerProperty = (x: EntityProperty): SharedIntegerProperty => x as SharedIntegerProperty;
