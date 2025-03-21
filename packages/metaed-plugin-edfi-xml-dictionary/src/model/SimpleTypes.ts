// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { HasName } from './HasName';

export interface SimpleTypesRow extends HasName {
  restrictions: string;
  description: string;
}

export const simpleTypesSchema = [
  {
    column: 'Name',
    type: String,
    width: 20,
    value: (row: SimpleTypesRow) => row.name,
  },
  {
    column: 'Restrictions',
    type: String,
    width: 20,
    value: (row: SimpleTypesRow) => row.restrictions,
  },
  {
    column: 'Description',
    type: String,
    width: 100,
    value: (row: SimpleTypesRow) => row.description,
  },
];

export const simpleTypesWorksheetName = 'Simple Types';
