// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

export interface TablesRow {
  entityName: string;
  entitySchema: string;
  entityDefinition: string;
}

export const tablesSchema = [
  {
    column: 'Entity Name',
    type: String,
    width: 60,
    value: (row: TablesRow) => row.entityName,
  },
  {
    column: 'Entity Schema',
    type: String,
    width: 20,
    value: (row: TablesRow) => row.entitySchema,
  },
  {
    column: 'Entity Definition',
    type: String,
    width: 100,
    value: (row: TablesRow) => row.entityDefinition,
  },
];

export const tablesWorksheetName = 'Tables';
