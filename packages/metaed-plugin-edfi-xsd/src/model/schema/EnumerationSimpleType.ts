// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { SimpleType, newSimpleType } from './SimpleType';
import { EnumerationToken } from './EnumerationToken';

export interface EnumerationSimpleType extends SimpleType {
  enumerationTokens: EnumerationToken[];
  hasRestrictions: () => boolean;
}

export function newEnumerationSimpleType(): EnumerationSimpleType {
  return {
    ...newSimpleType(),
    enumerationTokens: [],
    hasRestrictions() {
      return this.enumerationTokens.length > 0;
    },
  };
}

export const NoEnumerationSimpleType: SimpleType = deepFreeze({ ...newSimpleType(), name: 'NoEnumerationSimpleType' });
