// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MergeElement, newMergeElement } from './MergeElement';

export interface Merge {
  mergeSource: MergeElement;
  mergeTarget: MergeElement;
}

/**
 *
 */
export function newMerge(): Merge {
  return {
    mergeSource: newMergeElement(),
    mergeTarget: newMergeElement(),
  };
}
