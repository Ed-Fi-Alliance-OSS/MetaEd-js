// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { JsonPath } from './JsonPath';

export type DecimalPropertyValidationInfo = {
  // The json path for this property.
  path: JsonPath;

  // The number of decimal places allowed for this property.
  decimalPlaces?: number;

  // The total number of digits allowed for this property.
  totalDigits?: number;
};
