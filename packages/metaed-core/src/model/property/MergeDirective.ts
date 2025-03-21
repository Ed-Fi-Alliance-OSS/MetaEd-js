// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { EntityProperty } from './EntityProperty';
import { SourceMap } from '../SourceMap';
import { NoSourceMap } from '../SourceMap';

/**
 *
 */
export interface MergeDirectiveSourceMap {
  type: SourceMap;
  sourcePropertyPathStrings: SourceMap;
  targetPropertyPathStrings: SourceMap;
  sourcePropertyChain: SourceMap;
  targetPropertyChain: SourceMap;
  sourceProperty: SourceMap;
  targetProperty: SourceMap;
}

/**
 *
 */
export function newMergeDirectiveSourceMap() {
  return {
    type: NoSourceMap,
    sourcePropertyPathStrings: NoSourceMap,
    targetPropertyPathStrings: NoSourceMap,
    sourcePropertyChain: NoSourceMap,
    targetPropertyChain: NoSourceMap,
    sourceProperty: NoSourceMap,
    targetProperty: NoSourceMap,
  };
}

/**
 *
 */
export interface MergeDirective {
  sourcePropertyPathStrings: string[];
  targetPropertyPathStrings: string[];
  sourcePropertyChain: EntityProperty[];
  targetPropertyChain: EntityProperty[];
  sourceProperty: EntityProperty | null;
  targetProperty: EntityProperty | null;
  sourceMap: MergeDirectiveSourceMap;
}

/**
 *
 */
export function newMergeDirective(): MergeDirective {
  return {
    sourcePropertyPathStrings: [],
    targetPropertyPathStrings: [],
    sourcePropertyChain: [],
    targetPropertyChain: [],
    sourceProperty: null,
    targetProperty: null,
    sourceMap: newMergeDirectiveSourceMap(),
  };
}

/**
 *
 */
export const NoMergeDirective: MergeDirective = deepFreeze({
  ...newMergeDirective(),
});
