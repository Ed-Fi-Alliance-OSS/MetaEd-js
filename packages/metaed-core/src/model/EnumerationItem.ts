// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { ModelBase, ModelBaseSourceMap, newModelBaseSourceMap, newModelBase } from './ModelBase';
import { SourceMap, NoSourceMap } from './SourceMap';

export interface EnumerationItemSourceMap extends ModelBaseSourceMap {
  shortDescription: SourceMap;
  typeHumanizedName: SourceMap;
}

/**
 *
 */
export function newEnumerationItemSourceMap(): EnumerationItemSourceMap {
  return {
    ...newModelBaseSourceMap(),
    shortDescription: NoSourceMap,
    typeHumanizedName: NoSourceMap,
  };
}

export interface EnumerationItem extends ModelBase {
  sourceMap: EnumerationItemSourceMap;
  shortDescription: string;
  typeHumanizedName: string;
}

/**
 *
 */
export function newEnumerationItem(): EnumerationItem {
  return {
    ...newModelBase(),
    type: 'enumerationItem',
    typeHumanizedName: 'Enumeration Item',
    shortDescription: '',
    sourceMap: newEnumerationItemSourceMap(),
  };
}

/**
 *
 */
export const NoEnumerationItem: EnumerationItem = deepFreeze({
  ...newEnumerationItem(),
  metaEdName: 'NoEnumerationItem',
  shortDescription: 'NoEnumerationItem',
});

/**
 *
 */
export const asEnumerationItem = (x: ModelBase): EnumerationItem => x as EnumerationItem;
