// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { EntityProperty, NoEntityProperty } from './EntityProperty';
import { MergeDirective, NoMergeDirective } from './MergeDirective';

/**
 * A single MergeDirective and the parent property where it is located.
 */
export type MergeDirectiveInfo = {
  parentProperty: EntityProperty;
  mergeDirective: MergeDirective;
};

/**
 *
 */
export function newMergeDirectiveInfo(): MergeDirectiveInfo {
  return {
    parentProperty: NoEntityProperty,
    mergeDirective: NoMergeDirective,
  };
}

/**
 *
 */
export const NoMergeDirectiveInfo: MergeDirectiveInfo = deepFreeze({
  ...newMergeDirectiveInfo(),
});
