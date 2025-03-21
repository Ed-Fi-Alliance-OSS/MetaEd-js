// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newStringProperty, newStringPropertySourceMap } from './StringProperty';
import { StringProperty, StringPropertySourceMap } from './StringProperty';
import { EntityProperty } from './EntityProperty';
import { MergeDirective } from './MergeDirective';
import { SourceMap } from '../SourceMap';

export interface SharedStringPropertySourceMap extends StringPropertySourceMap {
  mergeDirectives: SourceMap[];
}

/**
 *
 */
export function newSharedStringPropertySourceMap(): SharedStringPropertySourceMap {
  return {
    ...newStringPropertySourceMap(),
    mergeDirectives: [],
  };
}

export interface SharedStringProperty extends StringProperty {
  sourceMap: SharedStringPropertySourceMap;
  mergeDirectives: MergeDirective[];
}

/**
 *
 */
export function newSharedStringProperty(): SharedStringProperty {
  return {
    ...newStringProperty(),
    type: 'sharedString',
    typeHumanizedName: 'Shared String Property',
    mergeDirectives: [],
    sourceMap: newSharedStringPropertySourceMap(),
  };
}

/**
 *
 */
export const asSharedStringProperty = (x: EntityProperty): SharedStringProperty => x as SharedStringProperty;
