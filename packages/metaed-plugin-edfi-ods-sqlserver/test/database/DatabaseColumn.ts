// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { database, firstKeyValueOf, queryWithBoolResult, scalar, testDatabaseName } from './DatabaseConnection';

export interface DatabaseColumn {
  parentTableSchema: string;
  parentTableName: string;
  name: string;
}

export async function columnExists(
  databaseColumn: DatabaseColumn,
  databaseName: string = testDatabaseName,
): Promise<boolean> {
  const sql = `
    IF COL_LENGTH('${databaseColumn.parentTableSchema}.${databaseColumn.parentTableName}', '${databaseColumn.name}') IS NULL
    SELECT 0 AS result
    ELSE
    SELECT 1 AS result
  `;

  let result = false;
  await database(databaseName, async (db) => {
    result = await queryWithBoolResult(db, 'columnExists', sql);
  });
  return result;
}

export async function columnMSDescription(
  databaseColumn: DatabaseColumn,
  databaseName: string = testDatabaseName,
): Promise<any> {
  const sql = `
    SELECT ep.value
    FROM sys.extended_properties ep
    INNER JOIN sys.objects o
      ON ep.major_id = o.OBJECT_ID
    INNER JOIN sys.columns c
      ON c.column_id = ep.minor_id
      AND c.OBJECT_ID = o.OBJECT_ID
    WHERE class_desc = 'OBJECT_OR_COLUMN'
      AND ep.name = 'MS_Description'
      AND ep.minor_id != 0
      AND o.name = '${databaseColumn.parentTableName}'
      AND c.name = '${databaseColumn.name}'
  `;

  let result;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'columnMSDescription', sql);
  });
  return firstKeyValueOf(result);
}

export async function columnDataType(databaseColumn: DatabaseColumn, databaseName: string = testDatabaseName): Promise<any> {
  const sql = `
    SELECT DATA_TYPE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = '${databaseColumn.parentTableSchema}'
      AND TABLE_NAME = '${databaseColumn.parentTableName}'
      AND COLUMN_NAME = '${databaseColumn.name}'
  `;

  let result;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'columnDataType', sql);
  });
  return firstKeyValueOf(result);
}

export async function columnLength(databaseColumn: DatabaseColumn, databaseName: string = testDatabaseName): Promise<any> {
  const sql = `
    SELECT CHARACTER_MAXIMUM_LENGTH
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA='${databaseColumn.parentTableSchema}'
      AND TABLE_NAME='${databaseColumn.parentTableName}'
      AND COLUMN_NAME='${databaseColumn.name}'
  `;

  let result;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'columnLength', sql);
  });
  return firstKeyValueOf(result);
}

export async function columnIsIdentity(
  databaseColumn: DatabaseColumn,
  databaseName: string = testDatabaseName,
): Promise<boolean> {
  const sql = `
    SELECT COLUMNPROPERTY(
      OBJECT_ID('${databaseColumn.parentTableSchema}.${databaseColumn.parentTableName}'),
      '${databaseColumn.name}',
      'IsIdentity'
    )`;

  let result = false;
  await database(databaseName, async (db) => {
    result = await queryWithBoolResult(db, 'columnIsIdentity', sql);
  });
  return result;
}

export async function columnIsNullable(
  databaseColumn: DatabaseColumn,
  databaseName: string = testDatabaseName,
): Promise<boolean> {
  const sql = `
    SELECT COLUMNPROPERTY(
      OBJECT_ID('${databaseColumn.parentTableSchema}.${databaseColumn.parentTableName}'),
      '${databaseColumn.name}',
      'AllowsNull'
    )
  `;

  let result = false;
  await database(databaseName, async (db) => {
    result = await queryWithBoolResult(db, 'columnIsNullable', sql);
  });
  return result;
}

export async function columnPrecision(
  databaseColumn: DatabaseColumn,
  databaseName: string = testDatabaseName,
): Promise<any> {
  const sql = `
    SELECT NUMERIC_PRECISION
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = '${databaseColumn.parentTableSchema}'
      AND TABLE_NAME = '${databaseColumn.parentTableName}'
      AND COLUMN_NAME = '${databaseColumn.name}'
  `;

  let result;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'columnPrecision', sql);
  });
  return firstKeyValueOf(result);
}

export async function columnScale(databaseColumn: DatabaseColumn, databaseName: string = testDatabaseName): Promise<any> {
  const sql = `
    SELECT NUMERIC_SCALE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = '${databaseColumn.parentTableSchema}'
      AND TABLE_NAME = '${databaseColumn.parentTableName}'
      AND COLUMN_NAME = '${databaseColumn.name}'
  `;

  let result;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'columnScale', sql);
  });
  return firstKeyValueOf(result);
}

export async function columnDefaultConstraint(
  databaseColumn: DatabaseColumn,
  databaseName: string = testDatabaseName,
): Promise<any> {
  const sql = `
    SELECT COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = '${databaseColumn.parentTableSchema}'
      AND TABLE_NAME = '${databaseColumn.parentTableName}'
      AND COLUMN_NAME = '${databaseColumn.name}'
  `;

  let result;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'columnDefaultConstraint', sql);
  });
  return firstKeyValueOf(result);
}

export async function columnFirstRowValue(
  databaseColumn: DatabaseColumn,
  databaseName: string = testDatabaseName,
): Promise<any> {
  const sql = `
    SELECT TOP 1 [${databaseColumn.name}]
    FROM [${databaseColumn.parentTableSchema}].[${databaseColumn.parentTableName}]
  `;

  let result;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'columnFirstRowValue', sql);
  });
  return firstKeyValueOf(result);
}

export async function columnNthRowValue(
  databaseColumn: DatabaseColumn,
  keyColumn: string,
  position: string,
  databaseName: string = testDatabaseName,
): Promise<any> {
  const sql = `
    SELECT [${databaseColumn.name}] FROM (
      SELECT [${databaseColumn.name}], RANK() OVER (ORDER BY [${keyColumn}]) AS ROW
      FROM [${databaseColumn.parentTableSchema}].[${databaseColumn.parentTableName}]
    ) AS TMP
    WHERE ROW = ${position}
  `;

  let result;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'columnNthRowValue', sql);
  });
  return firstKeyValueOf(result);
}
