// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

export interface ColumnData {
  unknown: string;
  bigint: string;
  boolean: string;
  currency: string;
  date: string;
  datetime: string;
  decimal: (precision: string, scale: string) => string;
  duration: string;
  integer: string;
  percent: string;
  short: string;
  string: (length: string) => string;
  time: string;
  year: string;
}

export const ColumnDataTypes: ColumnData = {
  unknown: '',
  bigint: 'BIGINT',
  boolean: 'BOOLEAN',
  currency: 'MONEY',
  date: 'DATE',
  datetime: 'TIMESTAMP',
  decimal: (precision, scale) => `DECIMAL(${precision}, ${scale})`,
  duration: 'VARCHAR(30)',
  integer: 'INT',
  percent: 'DECIMAL(5, 4)',
  short: 'SMALLINT',
  string: (length) => `VARCHAR(${length})`,
  time: 'TIME',
  year: 'SMALLINT',
};
