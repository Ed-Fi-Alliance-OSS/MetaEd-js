// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';

/**
 *
 */
export type DescriptorPropertySourceMap = ReferentialPropertySourceMap;

/**
 *
 */
export function newDescriptorPropertySourceMap(): DescriptorPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
  };
}

export interface DescriptorProperty extends ReferentialProperty {
  sourceMap: DescriptorPropertySourceMap;
}

/**
 *
 */
export function newDescriptorProperty(): DescriptorProperty {
  return {
    ...newReferentialProperty(),
    type: 'descriptor',
    typeHumanizedName: 'Descriptor Property',
    sourceMap: newDescriptorPropertySourceMap(),
  };
}
