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
export type ChoicePropertySourceMap = ReferentialPropertySourceMap;

/**
 *
 */
export function newChoicePropertySourceMap(): ChoicePropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
  };
}

export interface ChoiceProperty extends ReferentialProperty {
  sourceMap: ChoicePropertySourceMap;
}

/**
 *
 */
export function newChoiceProperty(): ChoiceProperty {
  return {
    ...newReferentialProperty(),
    type: 'choice',
    typeHumanizedName: 'Choice Property',
    sourceMap: newChoicePropertySourceMap(),
  };
}

/**
 *
 */
export const asChoiceProperty = (x: EntityProperty): ChoiceProperty => x as ChoiceProperty;
