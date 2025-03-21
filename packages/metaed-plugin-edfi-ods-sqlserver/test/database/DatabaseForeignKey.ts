// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import Sugar from 'sugar';
import { database, firstKeyValueOf, scalar, testDatabaseName } from './DatabaseConnection';
import { DatabaseTable } from './DatabaseTable';

export interface DatabaseForeignKey {
  parentTable: DatabaseTable;
  parentColumns: string[];
  foreignTable: DatabaseTable;
  foreignColumns: string[];
}

const existsSelect = 'SELECT COUNT(1) ';
const deleteCascadeSelect = 'SELECT RC.DELETE_RULE ';
const updateCascadeSelect = 'SELECT RC.UPDATE_RULE ';
const fromBody = `
  FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS FK_TC
  INNER JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS RC
    ON FK_TC.CONSTRAINT_CATALOG = RC.CONSTRAINT_CATALOG
    AND FK_TC.CONSTRAINT_SCHEMA = RC.CONSTRAINT_SCHEMA
    AND FK_TC.CONSTRAINT_NAME = RC.CONSTRAINT_NAME
    AND FK_TC.CONSTRAINT_TYPE = 'FOREIGN KEY'
  INNER JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS PK_TC
    ON PK_TC.CONSTRAINT_CATALOG = RC.UNIQUE_CONSTRAINT_CATALOG
    AND PK_TC.CONSTRAINT_SCHEMA = RC.UNIQUE_CONSTRAINT_SCHEMA
    AND PK_TC.CONSTRAINT_NAME = RC.UNIQUE_CONSTRAINT_NAME
    AND PK_TC.CONSTRAINT_TYPE = 'PRIMARY KEY'
  INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE FK_KCU
    ON FK_KCU.CONSTRAINT_CATALOG = FK_TC.CONSTRAINT_CATALOG
    AND FK_KCU.CONSTRAINT_SCHEMA = FK_TC.CONSTRAINT_SCHEMA
    AND FK_KCU.CONSTRAINT_NAME = FK_TC.CONSTRAINT_NAME
  INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE PK_KCU
    ON PK_KCU.CONSTRAINT_CATALOG = PK_TC.CONSTRAINT_CATALOG
    AND PK_KCU.CONSTRAINT_SCHEMA = PK_TC.CONSTRAINT_SCHEMA
    AND PK_KCU.CONSTRAINT_NAME = PK_TC.CONSTRAINT_NAME
    AND PK_KCU.ORDINAL_POSITION = FK_KCU.ORDINAL_POSITION
`;

const whereClauseFormat = `(
  FK_KCU.TABLE_SCHEMA = '{0}'
    AND FK_KCU.TABLE_NAME = '{1}'
    AND FK_KCU.COLUMN_NAME = '{2}'
    AND PK_KCU.TABLE_SCHEMA = '{3}'
    AND PK_KCU.TABLE_NAME = '{4}'
    AND PK_KCU.COLUMN_NAME = '{5}'
    AND PK_KCU.ORDINAL_POSITION = {6}
)`;

function whereClause(foreignKey: DatabaseForeignKey): string {
  if (foreignKey.parentColumns.length !== foreignKey.foreignColumns.length) {
    throw new Error(
      `parentColumns: [${foreignKey.parentColumns.join(
        ', ',
      )}] does not match foreignColumns: [${foreignKey.foreignColumns.join(', ')}]`,
    );
  }

  // @ts-ignore - "column" is never read
  const clause: string[] = foreignKey.parentColumns.map((column: string, x: number) =>
    Sugar.String.format(
      whereClauseFormat,
      foreignKey.parentTable.schema,
      foreignKey.parentTable.name,
      foreignKey.parentColumns[x],
      foreignKey.foreignTable.schema,
      foreignKey.foreignTable.name,
      foreignKey.foreignColumns[x],
      x + 1,
    ),
  );
  return ` WHERE ${clause.join(' OR ')}`;
}

export async function foreignKeyExists(
  foreignKey: DatabaseForeignKey,
  databaseName: string = testDatabaseName,
): Promise<boolean> {
  const sql = existsSelect + fromBody + whereClause(foreignKey);

  let result = false;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'foreignKeyExists', sql);
  });
  return firstKeyValueOf(result) === foreignKey.parentColumns.length;
}

export async function foreignKeyDeleteCascades(
  foreignKey: DatabaseForeignKey,
  databaseName: string = testDatabaseName,
): Promise<boolean> {
  const sql = deleteCascadeSelect + fromBody + whereClause(foreignKey);

  let result = false;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'foreignKeyDeleteCascades', sql);
  });
  return firstKeyValueOf(result) === 'CASCADE';
}

export async function foreignKeyUpdateCascades(
  foreignKey: DatabaseForeignKey,
  databaseName: string = testDatabaseName,
): Promise<boolean> {
  const sql = updateCascadeSelect + fromBody + whereClause(foreignKey);

  let result = false;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'foreignKeyUpdateCascades', sql);
  });
  return firstKeyValueOf(result) === 'CASCADE';
}
