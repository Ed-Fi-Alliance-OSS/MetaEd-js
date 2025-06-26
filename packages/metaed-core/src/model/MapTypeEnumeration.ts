// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { newEnumeration } from './Enumeration';
import { Enumeration } from './Enumeration';

/**
 *
 */
export interface MapTypeEnumeration extends Enumeration {}

/**
 *
 */
export function newMapTypeEnumeration(): MapTypeEnumeration {
  return {
    ...newEnumeration(),
    type: 'mapTypeEnumeration',
    typeHumanizedName: 'Map Type Enumeration',
  };
}

/**
 *
 */
export const NoMapTypeEnumeration: MapTypeEnumeration = deepFreeze({
  ...newMapTypeEnumeration(),
  metaEdName: 'NoMapTypeEnumeration',
});
