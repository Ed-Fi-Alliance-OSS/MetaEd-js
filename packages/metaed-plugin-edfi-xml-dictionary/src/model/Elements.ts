// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { HasName } from './HasName';

export interface ElementsRow extends HasName {
  type: string;
  parentType: string;
  cardinality: string;
  description: string;
}

export const elementsSchema = [
  {
    column: 'Name',
    type: String,
    width: 20,
    value: (row: ElementsRow) => row.name,
  },
  {
    column: 'Type',
    type: String,
    width: 20,
    value: (row: ElementsRow) => row.type,
  },
  {
    column: 'Parent Type',
    type: String,
    width: 20,
    value: (row: ElementsRow) => row.parentType,
  },
  {
    column: 'Cardinality',
    type: String,
    width: 20,
    value: (row: ElementsRow) => row.cardinality,
  },
  {
    column: 'Description',
    type: String,
    width: 100,
    value: (row: ElementsRow) => row.description,
  },
];

export const elementsWorksheetName = 'Elements';
