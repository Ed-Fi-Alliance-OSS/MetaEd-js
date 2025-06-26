// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SharedSimple, SharedSimpleSourceMap } from './SharedSimple';
import { newSharedSimpleSourceMap, newSharedSimple } from './SharedSimple';
import { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';

export interface SharedIntegerSourceMap extends SharedSimpleSourceMap {
  isShort: SourceMap;
  minValue: SourceMap;
  maxValue: SourceMap;
}

/**
 *
 */
export function newSharedIntegerSourceMap(): SharedIntegerSourceMap {
  return {
    ...newSharedSimpleSourceMap(),
    isShort: NoSourceMap,
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
  };
}

export interface SharedInteger extends SharedSimple {
  sourceMap: SharedIntegerSourceMap;
  isShort: boolean;
  minValue: string;
  maxValue: string;
  hasBigHint: boolean;
}

/**
 *
 */
export function newSharedInteger(): SharedInteger {
  return {
    ...newSharedSimple(),
    type: 'sharedInteger',
    typeHumanizedName: 'Shared Integer',
    isShort: false,
    minValue: '',
    maxValue: '',
    hasBigHint: false,
    sourceMap: newSharedIntegerSourceMap(),
  };
}
