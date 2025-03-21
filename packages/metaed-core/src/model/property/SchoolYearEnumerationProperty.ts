// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ReferentialProperty, ReferentialPropertySourceMap } from './ReferentialProperty';
import { newReferentialProperty, newReferentialPropertySourceMap } from './ReferentialProperty';
import { EntityProperty } from './EntityProperty';

/**
 *
 */
export type SchoolYearEnumerationPropertySourceMap = ReferentialPropertySourceMap;

/**
 *
 */
export function newSchoolYearEnumerationPropertySourceMap(): SchoolYearEnumerationPropertySourceMap {
  return {
    ...newReferentialPropertySourceMap(),
  };
}

export interface SchoolYearEnumerationProperty extends ReferentialProperty {
  sourceMap: SchoolYearEnumerationPropertySourceMap;
}

/**
 *
 */
export function newSchoolYearEnumerationProperty(): SchoolYearEnumerationProperty {
  return {
    ...newReferentialProperty(),
    type: 'schoolYearEnumeration',
    typeHumanizedName: 'School Year Enumeration Property',
    sourceMap: newSchoolYearEnumerationPropertySourceMap(),
  };
}

/**
 *
 */
export const asSchoolYearEnumerationProperty = (x: EntityProperty): SchoolYearEnumerationProperty =>
  x as SchoolYearEnumerationProperty;
