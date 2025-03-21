// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import { MapTypeEnumeration } from './MapTypeEnumeration';
import { NoMapTypeEnumeration } from './MapTypeEnumeration';
import { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';
import { ModelBase } from './ModelBase';

export interface DescriptorSourceMap extends TopLevelEntitySourceMap {
  isMapTypeRequired: SourceMap;
  isMapTypeOptional: SourceMap;
  mapTypeEnumeration: SourceMap;
}

/**
 *
 */
export function newDescriptorSourceMap(): DescriptorSourceMap {
  return {
    ...newTopLevelEntitySourceMap(),
    isMapTypeRequired: NoSourceMap,
    isMapTypeOptional: NoSourceMap,
    mapTypeEnumeration: NoSourceMap,
  };
}

export interface Descriptor extends TopLevelEntity {
  sourceMap: DescriptorSourceMap;
  isMapTypeRequired: boolean;
  isMapTypeOptional: boolean;
  mapTypeEnumeration: MapTypeEnumeration;
}

/**
 *
 */
export function newDescriptor(): Descriptor {
  return {
    ...newTopLevelEntity(),
    type: 'descriptor',
    typeHumanizedName: 'Descriptor',
    isMapTypeRequired: false,
    isMapTypeOptional: false,
    mapTypeEnumeration: NoMapTypeEnumeration,
    sourceMap: newDescriptorSourceMap(),
  };
}

/**
 *
 */
export const asDescriptor = (x: ModelBase): Descriptor => x as Descriptor;
