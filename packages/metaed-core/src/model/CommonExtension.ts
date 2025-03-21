// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import { ModelBase } from './ModelBase';

/**
 *
 */
export type CommonExtensionSourceMap = TopLevelEntitySourceMap;

/**
 *
 */
export function newCommonExtensionSourceMap(): CommonExtensionSourceMap {
  return newTopLevelEntitySourceMap();
}

export interface CommonExtension extends TopLevelEntity {
  sourceMap: CommonExtensionSourceMap;
}

/**
 *
 */
export function newCommonExtension(): CommonExtension {
  return {
    ...newTopLevelEntity(),
    type: 'commonExtension',
    typeHumanizedName: 'Common Extension',
    sourceMap: newCommonExtensionSourceMap(),
  };
}

/**
 *
 */
export const asCommonExtension = (x: ModelBase): CommonExtension => x as CommonExtension;
