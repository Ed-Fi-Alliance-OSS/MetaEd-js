import { database, firstKeyValueOf, scalar, query, queryWithBoolResult, testDatabaseName } from './DatabaseConnection';

export interface DatabaseTable {
  schema: string;
  name: string;
}

export async function tableExists(databaseTable: DatabaseTable, databaseName: string = testDatabaseName): Promise<boolean> {
  const sql = `
    IF EXISTS (
    SELECT *
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = '${databaseTable.schema}'
      AND TABLE_NAME = '${databaseTable.name}')
    SELECT 1
    ELSE SELECT 0
  `;
  let result = false;
  await database(databaseName, async (db) => {
    result = await queryWithBoolResult(db, 'tableExists', sql);
  });

  return result;
}

export async function tableMSDescription(
  databaseTable: DatabaseTable,
  databaseName: string = testDatabaseName,
): Promise<any> {
  const sql = `
    SELECT ep.value
    FROM sys.extended_properties ep
    INNER JOIN SYS.OBJECTS O
      ON ep.major_id = o.object_id
    WHERE CLASS_DESC = 'OBJECT_OR_COLUMN'
      AND ep.name = 'MS_Description'
      AND ep.minor_id = 0
      AND o.name = '${databaseTable.name}'
  `;

  let result;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'tableMSDescription', sql);
  });
  return firstKeyValueOf(result);
}

export async function tableRowCount(databaseTable: DatabaseTable, databaseName: string = testDatabaseName) {
  const sql = `
    SELECT COUNT(1)
    FROM [${databaseTable.schema}].[${databaseTable.name}]
  `;

  let result;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'tableRowCount', sql);
  });
  return firstKeyValueOf(result);
}

export async function tableColumnCount(databaseTable: DatabaseTable, databaseName: string = testDatabaseName) {
  const sql = `
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = '${databaseTable.schema}'
      AND TABLE_NAME = '${databaseTable.name}'
  `;

  let result;
  await database(databaseName, async (db) => {
    result = await scalar(db, 'tableColumnCount', sql);
  });
  return firstKeyValueOf(result);
}

export async function tablePrimaryKeys(
  databaseTable: DatabaseTable,
  databaseName: string = testDatabaseName,
): Promise<any[]> {
  const sql = `
    SELECT K.COLUMN_NAME
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS C
    JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS K
      ON C.TABLE_NAME = K.TABLE_NAME
      AND C.CONSTRAINT_CATALOG = K.CONSTRAINT_CATALOG
      AND C.CONSTRAINT_SCHEMA = K.CONSTRAINT_SCHEMA
      AND C.CONSTRAINT_NAME = K.CONSTRAINT_NAME
    WHERE C.CONSTRAINT_TYPE = 'PRIMARY KEY'
      AND K.TABLE_SCHEMA = '${databaseTable.schema}'
      AND K.TABLE_NAME = '${databaseTable.name}'
    ORDER BY K.ORDINAL_POSITION
  `;

  let result: any[] = [];
  await database(databaseName, async (db) => {
    result = await query(db, 'tablePrimaryKeys', sql);
  });
  return result.map((pk: any) => firstKeyValueOf(pk));
}

export async function tableUniqueConstraints(
  databaseTable: DatabaseTable,
  databaseName: string = testDatabaseName,
): Promise<any[]> {
  const sql = `
    SELECT K.COLUMN_NAME
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS C
    JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS K
      ON C.TABLE_NAME = K.TABLE_NAME
      AND C.CONSTRAINT_CATALOG = K.CONSTRAINT_CATALOG
      AND C.CONSTRAINT_SCHEMA = K.CONSTRAINT_SCHEMA
      AND C.CONSTRAINT_NAME = K.CONSTRAINT_NAME
    WHERE C.CONSTRAINT_TYPE = 'UNIQUE'
      AND K.TABLE_SCHEMA = '${databaseTable.schema}'
      AND K.TABLE_NAME = '${databaseTable.name}'
    ORDER BY K.ORDINAL_POSITION
  `;

  let result = [];
  await database(databaseName, async (db) => {
    result = await query(db, 'tableUniqueConstraints', sql);
  });
  return result.map((column) => firstKeyValueOf(column));
}
