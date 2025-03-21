// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { newEnumerationRowBase } from './EnumerationRowBase';
import { EnumerationRowBase } from './EnumerationRowBase';

export interface EnumerationRow extends EnumerationRowBase {
  codeValue: string;
  description: string;
  shortDescription: string;
}

export function newEnumerationRow(): EnumerationRow {
  return {
    ...newEnumerationRowBase(),
    codeValue: '',
    description: '',
    shortDescription: '',
  };
}

export const NoEnumerationRow: EnumerationRow = deepFreeze({
  ...newEnumerationRow(),
  name: 'NoEnumerationRow',
});
