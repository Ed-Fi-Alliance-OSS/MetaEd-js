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
export type ChoiceSourceMap = TopLevelEntitySourceMap;

/**
 *
 */
export function newChoiceSourceMap(): ChoiceSourceMap {
  return newTopLevelEntitySourceMap();
}

export interface Choice extends TopLevelEntity {
  sourceMap: ChoiceSourceMap;
}

/**
 *
 */
export function newChoice(): Choice {
  return {
    ...newTopLevelEntity(),
    type: 'choice',
    typeHumanizedName: 'Choice',
    sourceMap: newChoiceSourceMap(),
  };
}

/**
 *
 */
export const asChoice = (x: ModelBase): Choice => x as Choice;
