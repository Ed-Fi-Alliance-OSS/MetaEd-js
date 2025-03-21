// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { SimpleType, newSimpleType } from './SimpleType';

export interface StringSimpleType extends SimpleType {
  minLength: string;
  maxLength: string;
  hasRestrictions: () => boolean;
}

export function newStringSimpleType(): StringSimpleType {
  return {
    ...newSimpleType(),
    minLength: '',
    maxLength: '',
    hasRestrictions() {
      return !!this.minLength || !!this.maxLength;
    },
  };
}

export const NoStringSimpleType: StringSimpleType = deepFreeze({ ...newStringSimpleType(), name: 'NoStringSimpleType' });
