// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { newEnumerationRowBase } from './EnumerationRowBase';
import { EnumerationRowBase } from './EnumerationRowBase';

export interface SchoolYearEnumerationRow extends EnumerationRowBase {
  schoolYear: number;
  schoolYearDescription: string;
}

export function newSchoolYearEnumerationRow(): SchoolYearEnumerationRow {
  return {
    ...newEnumerationRowBase(),
    type: 'schoolYearEnumerationRow',
    schoolYear: 0,
    schoolYearDescription: '',
  };
}

export const NoSchoolYearEnumerationRow: SchoolYearEnumerationRow = deepFreeze({
  ...newSchoolYearEnumerationRow(),
  name: 'NoSchoolYearEnumerationRow',
});
