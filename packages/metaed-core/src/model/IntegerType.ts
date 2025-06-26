// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { SourceMap, NoSourceMap } from './SourceMap';
import { ModelBase, ModelBaseSourceMap, newModelBaseSourceMap, newModelBase } from './ModelBase';
import { EntityProperty } from './property/EntityProperty';
import { newNamespace } from './Namespace';

export interface IntegerTypeSourceMap extends ModelBaseSourceMap {
  generatedSimpleType: SourceMap;
  documentationInherited: SourceMap;
  isShort: SourceMap;
  minValue: SourceMap;
  maxValue: SourceMap;
}

export function newIntegerTypeSourceMap(): IntegerTypeSourceMap {
  return {
    ...newModelBaseSourceMap(),
    generatedSimpleType: NoSourceMap,
    documentationInherited: NoSourceMap,
    isShort: NoSourceMap,
    minValue: NoSourceMap,
    maxValue: NoSourceMap,
  };
}

// Note these are XSD specific with the advent of SharedInteger, and creation should be move to XSD enhancers
export interface IntegerType extends ModelBase {
  generatedSimpleType: boolean;
  documentationInherited: boolean;
  typeHumanizedName: string;
  isShort: boolean;
  minValue: string;
  maxValue: string;
  hasBigHint: boolean;
  referringSimpleProperties: EntityProperty[];
  sourceMap: IntegerTypeSourceMap;
}

export function newIntegerType(): IntegerType {
  return {
    ...newModelBase(),
    namespace: newNamespace(),
    type: 'integerType',
    generatedSimpleType: false,
    documentationInherited: false,
    typeHumanizedName: 'Integer Type',
    isShort: false,
    minValue: '',
    maxValue: '',
    hasBigHint: false,
    referringSimpleProperties: [],
    sourceMap: newIntegerTypeSourceMap(),
  };
}

export function newShortType(): IntegerType {
  return {
    ...newIntegerType(),
    isShort: true,
  };
}

export const NoIntegerType: IntegerType = deepFreeze({
  ...newIntegerType(),
  metaEdName: 'NoIntegerType',
});
