// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SimpleProperty, SimplePropertySourceMap } from './SimpleProperty';
import { newSimplePropertySourceMap, newSimpleProperty } from './SimpleProperty';
import { EntityProperty } from './EntityProperty';
import { SourceMap } from '../SourceMap';
import { NoSourceMap } from '../SourceMap';

export interface StringPropertySourceMap extends SimplePropertySourceMap {
  minLength: SourceMap;
  maxLength: SourceMap;
}

/**
 *
 */
export function newStringPropertySourceMap(): StringPropertySourceMap {
  return {
    ...newSimplePropertySourceMap(),
    minLength: NoSourceMap,
    maxLength: NoSourceMap,
  };
}

export interface StringProperty extends SimpleProperty {
  sourceMap: StringPropertySourceMap;
  minLength: string | null;
  maxLength: string | null;
}

/**
 *
 */
export function newStringProperty(): StringProperty {
  return {
    ...newSimpleProperty(),
    type: 'string',
    typeHumanizedName: 'String Property',
    minLength: null,
    maxLength: null,
    sourceMap: newStringPropertySourceMap(),
  };
}

/**
 *
 */
export const asStringProperty = (x: EntityProperty): StringProperty => x as StringProperty;
