// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { SourceMap, NoSourceMap } from './SourceMap';
import { ModelBase, ModelBaseSourceMap, newModelBaseSourceMap, newModelBase } from './ModelBase';
import { EntityProperty } from './property/EntityProperty';
import { newNamespace } from './Namespace';

export interface StringTypeSourceMap extends ModelBaseSourceMap {
  documentationInherited: SourceMap;
  minLength: SourceMap;
  maxLength: SourceMap;
}

export function newStringTypeSourceMap(): StringTypeSourceMap {
  return {
    ...newModelBaseSourceMap(),
    documentationInherited: NoSourceMap,
    minLength: NoSourceMap,
    maxLength: NoSourceMap,
  };
}

// Note these are XSD specific with the advent of SharedString, and creation should be move to XSD enhancers
export interface StringType extends ModelBase {
  generatedSimpleType: boolean;
  documentationInherited: boolean;
  typeHumanizedName: string;
  minLength: string;
  maxLength: string;
  referringSimpleProperties: EntityProperty[];
  sourceMap: StringTypeSourceMap;
}

export function newStringType(): StringType {
  return {
    ...newModelBase(),
    namespace: newNamespace(),
    type: 'stringType',
    generatedSimpleType: false,
    documentationInherited: false,
    typeHumanizedName: 'String Type',
    minLength: '',
    maxLength: '',
    referringSimpleProperties: [],
    sourceMap: newStringTypeSourceMap(),
  };
}

export const NoStringType: StringType = deepFreeze({ ...newStringType(), metaEdName: 'NoStringType' });

export const asStringType = (x: ModelBase): StringType => x as StringType;
