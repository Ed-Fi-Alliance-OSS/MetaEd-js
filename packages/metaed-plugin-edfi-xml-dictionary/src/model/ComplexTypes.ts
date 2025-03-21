// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { HasName } from './HasName';

export interface ComplexTypesRow extends HasName {
  description: string;
}

export const complexTypesSchema = [
  {
    column: 'Name',
    type: String,
    width: 20,
    value: (row: ComplexTypesRow) => row.name,
  },
  {
    column: 'Description',
    type: String,
    width: 100,
    value: (row: ComplexTypesRow) => row.description,
  },
];

export const complexTypesWorksheetName = 'Complex Types';
