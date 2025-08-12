// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
import deepFreeze from 'deep-freeze';
import { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';

/**
 * Source map type for CommonExtension, tracking the original source locations
 * of elements within a common extension definition.
 */
export type CommonExtensionSourceMap = TopLevelEntitySourceMap;

/**
 * Creates a new CommonExtensionSourceMap with default values.
 */
export function newCommonExtensionSourceMap(): CommonExtensionSourceMap {
  return newTopLevelEntitySourceMap();
}

export interface CommonExtension extends TopLevelEntity {
  sourceMap: CommonExtensionSourceMap;
}

/**
 * Creates a new CommonExtension with default values.
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
 * A frozen CommonExtension instance representing no common extension.
 * Used as a default/null object pattern to avoid null checks.
 */
export const NoCommonExtension: CommonExtension = deepFreeze({
  ...newCommonExtension(),
  metaEdName: 'NoCommonExtension',
});
