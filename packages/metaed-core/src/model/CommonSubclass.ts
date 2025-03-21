// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';

/**
 *
 */
export type CommonSubclassSourceMap = TopLevelEntitySourceMap;

/**
 *
 */
export function newCommonSubclassSourceMap(): CommonSubclassSourceMap {
  return newTopLevelEntitySourceMap();
}

export interface CommonSubclass extends TopLevelEntity {
  sourceMap: CommonSubclassSourceMap;
}

/**
 *
 */
export function newCommonSubclass(): CommonSubclass {
  return {
    ...newTopLevelEntity(),
    type: 'commonSubclass',
    typeHumanizedName: 'Common Subclass',
    sourceMap: newCommonSubclassSourceMap(),
  };
}
