// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ModelBase } from './ModelBase';
import { Enumeration } from './Enumeration';
import { newEnumeration } from './Enumeration';

/**
 *
 */
export type SchoolYearEnumeration = Enumeration;

/**
 *
 */
export function newSchoolYearEnumeration(): SchoolYearEnumeration {
  return {
    ...newEnumeration(),
    type: 'schoolYearEnumeration',
    typeHumanizedName: 'School Year Enumeration',
  };
}

/**
 *
 */
export const asSchoolYearEnumeration = (x: ModelBase): SchoolYearEnumeration => x as SchoolYearEnumeration;
