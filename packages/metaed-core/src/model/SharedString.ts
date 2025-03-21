// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SharedSimple, SharedSimpleSourceMap } from './SharedSimple';
import { newSharedSimpleSourceMap, newSharedSimple } from './SharedSimple';
import { ModelBase } from './ModelBase';
import { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export interface SharedStringSourceMap extends SharedSimpleSourceMap {
  minLength: SourceMap;
  maxLength: SourceMap;
}

/**
 *
 */
export function newSharedStringSourceMap(): SharedStringSourceMap {
  return {
    ...newSharedSimpleSourceMap(),
    minLength: NoSourceMap,
    maxLength: NoSourceMap,
  };
}

export interface SharedString extends SharedSimple {
  sourceMap: SharedStringSourceMap;
  minLength: string;
  maxLength: string;
}

/**
 *
 */
export function newSharedString(): SharedString {
  return {
    ...newSharedSimple(),
    type: 'sharedString',
    typeHumanizedName: 'Shared String',
    minLength: '',
    maxLength: '',
    sourceMap: newSharedStringSourceMap(),
  };
}

/**
 *
 */
export const asSharedString = (x: ModelBase): SharedString => x as SharedString;
