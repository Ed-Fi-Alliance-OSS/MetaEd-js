// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';
import { SourceMap } from '../SourceMap';
import { NoSourceMap } from '../SourceMap';

export interface CommonPropertySourceMap extends ReferentialPropertySourceMap {
  isExtensionOverride: SourceMap;
}

/**
 *
 */
export function newCommonPropertySourceMap(): CommonPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
    isExtensionOverride: NoSourceMap,
  };
}

export interface CommonProperty extends ReferentialProperty {
  sourceMap: CommonPropertySourceMap;
  isExtensionOverride: boolean;
}

/**
 *
 */
export function newCommonProperty(): CommonProperty {
  return {
    ...newReferentialProperty(),
    type: 'common',
    typeHumanizedName: 'Common Property',
    isExtensionOverride: false,
    sourceMap: newCommonPropertySourceMap(),
  };
}
