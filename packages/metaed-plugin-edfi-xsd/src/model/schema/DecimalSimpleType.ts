// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SimpleType, newSimpleType } from './SimpleType';

export interface DecimalSimpleType extends SimpleType {
  totalDigits: string;
  decimalPlaces: string;
  minValue: string;
  maxValue: string;
  hasRestrictions: () => boolean;
}

export function newDecimalSimpleType(): DecimalSimpleType {
  return {
    ...newSimpleType(),
    totalDigits: '',
    decimalPlaces: '',
    minValue: '',
    maxValue: '',
    hasRestrictions() {
      return !!this.totalDigits || !!this.decimalPlaces || !!this.minValue || !!this.maxValue;
    },
  };
}
